import React, { useState } from 'react';
import {
  ChildProfile,
  Stage,
  Question,
  PerformanceSession,
} from './types';
import {
  loadProfiles,
  getActiveProfile,
  setActiveProfileId,
  updateProfile,
  createNewProfile,
  recordSessionResults,
} from './services/storage';
import {
  generateQuestionRound,
  generateChallengeRound,
} from './services/questionGenerator';
import { ALL_STAGES } from './data/stages';
import { isAudioEnabled, setAudioEnabled } from './utils/audio';

import { Header } from './components/Header';
import { StageMap } from './components/StageMap';
import { ExerciseView } from './components/ExerciseView';
import { RoundSummary } from './components/RoundSummary';
import { TrainingMode } from './components/TrainingMode';
import { ChallengeMode } from './components/ChallengeMode';
import { ChildProfileView } from './components/ChildProfileView';
import { ParentsDashboard } from './components/ParentsDashboard';

export function App() {
  const [profiles, setProfiles] = useState<ChildProfile[]>(() => loadProfiles());
  const [activeProfile, setActiveProfile] = useState<ChildProfile>(() => getActiveProfile());
  const [currentTab, setCurrentTab] = useState<'trilha' | 'treino' | 'desafio' | 'perfil' | 'pais'>('trilha');
  const [selectedLevel, setSelectedLevel] = useState<1 | 2>(1);
  const [soundOn, setSoundOn] = useState<boolean>(() => isAudioEnabled());

  const [activeSessionInfo, setActiveSessionInfo] = useState<{
    stageId?: string;
    stageTitle: string;
    mode: 'trilha' | 'treino' | 'desafio' | 'reforco';
    questions: Question[];
  } | null>(null);

  const [finishedSession, setFinishedSession] = useState<PerformanceSession | null>(null);

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setAudioEnabled(next);
  };

  const handleSelectProfile = (id: string) => {
    setActiveProfileId(id);
    const p = profiles.find((item) => item.id === id);
    if (p) setActiveProfile(p);
  };

  const handleCreateProfile = (name: string, avatar: string, ageGroup: '4-6' | '7-9' | '10+') => {
    const created = createNewProfile(name, avatar, ageGroup);
    setProfiles(loadProfiles());
    setActiveProfile(created);
  };

  const handleUpdateProfile = (updated: ChildProfile) => {
    updateProfile(updated);
    setProfiles(loadProfiles());
    setActiveProfile(updated);
  };

  const handleStartStage = (stage: Stage) => {
    const topic = stage.targetTopics[0];
    const questions = generateQuestionRound(topic, 10, 'facil');

    setActiveSessionInfo({
      stageId: stage.id,
      stageTitle: stage.title,
      mode: 'trilha',
      questions,
    });
    setFinishedSession(null);
  };

  const handleStartTrainingTopic = (topicKey: string, topicLabel: string) => {
    const questions = generateQuestionRound(topicKey, 10, 'facil_intermediario');

    setActiveSessionInfo({
      stageTitle: topicLabel,
      mode: 'treino',
      questions,
    });
    setFinishedSession(null);
  };

  const handleStartChallenge = (count: number) => {
    const unlockedTopics: string[] = [];
    ALL_STAGES.forEach((s) => {
      const isUnlocked = !s.prerequisiteId || (activeProfile.stagesProgress[s.prerequisiteId]?.bestPercentage ?? 0) >= 80;
      if (isUnlocked) {
        s.targetTopics.forEach((t) => unlockedTopics.push(t));
      }
    });

    const questions = generateChallengeRound(unlockedTopics, count);

    setActiveSessionInfo({
      stageTitle: 'Desafio Misto',
      mode: 'desafio',
      questions,
    });
    setFinishedSession(null);
  };

  const handleStartReinforcement = (topicKey: string) => {
    const stage = ALL_STAGES.find((s) => s.targetTopics.includes(topicKey));
    const label = stage ? stage.title : 'Reforço Personalizado';
    const questions = generateQuestionRound(topicKey, 10, 'facil_intermediario');

    setActiveSessionInfo({
      stageId: stage?.id,
      stageTitle: `Reforço: ${label}`,
      mode: 'reforco',
      questions,
    });
    setFinishedSession(null);
  };

  const handleFinishRound = (session: PerformanceSession) => {
    const { updatedProfile } = recordSessionResults(
      activeProfile,
      session,
      activeSessionInfo?.stageId
    );

    setActiveProfile(updatedProfile);
    setProfiles(loadProfiles());
    setFinishedSession(session);
    setActiveSessionInfo(null);
  };

  const handleExitExercise = () => {
    setActiveSessionInfo(null);
    setFinishedSession(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 selection:bg-amber-200">
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          handleExitExercise();
          setCurrentTab(tab);
        }}
        profile={activeProfile}
        soundOn={soundOn}
        onToggleSound={handleToggleSound}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeSessionInfo ? (
          <ExerciseView
            stageTitle={activeSessionInfo.stageTitle}
            stageId={activeSessionInfo.stageId}
            mode={activeSessionInfo.mode}
            questions={activeSessionInfo.questions}
            onFinishRound={handleFinishRound}
            onExit={handleExitExercise}
          />
        ) : finishedSession ? (
          <RoundSummary
            session={finishedSession}
            onContinue={handleExitExercise}
            onRetry={() => {
              if (finishedSession.stageId) {
                const stage = ALL_STAGES.find((s) => s.id === finishedSession.stageId);
                if (stage) {
                  handleStartStage(stage);
                  return;
                }
              }
              handleStartChallenge(10);
            }}
          />
        ) : (
          <>
            {currentTab === 'trilha' && (
              <StageMap
                profile={activeProfile}
                selectedLevel={selectedLevel}
                onSelectLevel={setSelectedLevel}
                onStartStage={handleStartStage}
                onStartReinforcement={handleStartReinforcement}
              />
            )}

            {currentTab === 'treino' && (
              <TrainingMode
                profile={activeProfile}
                onStartTrainingTopic={handleStartTrainingTopic}
              />
            )}

            {currentTab === 'desafio' && (
              <ChallengeMode
                profile={activeProfile}
                onStartChallenge={handleStartChallenge}
              />
            )}

            {currentTab === 'perfil' && (
              <ChildProfileView
                profile={activeProfile}
                allProfiles={profiles}
                onSelectProfile={handleSelectProfile}
                onCreateProfile={handleCreateProfile}
                onUpdateProfile={handleUpdateProfile}
                onGoToReinforcement={handleStartReinforcement}
              />
            )}

            {currentTab === 'pais' && (
              <ParentsDashboard
                profile={activeProfile}
                onStartReinforcement={handleStartReinforcement}
              />
            )}
          </>
        )}
      </main>

      <footer className="mt-auto border-t border-sky-100 bg-white py-4 px-6 text-center text-xs text-slate-500">
        <p className="font-semibold text-sky-800">
          Aprender Calculando — O Professor Digital de Matemática Infantil
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Ensinar · Praticar · Avaliar · Reforçar · Dominar
        </p>
      </footer>
    </div>
  );
}
export default App;

import React from 'react';
import { ChildProfile } from '../types';
import { playClickSound } from '../utils/audio';
import { Zap, Trophy, Sparkles, Flame, Play } from 'lucide-react';
import { ALL_STAGES } from '../data/stages';

interface ChallengeModeProps {
  profile: ChildProfile;
  onStartChallenge: (questionCount: number) => void;
}

export const ChallengeMode: React.FC<ChallengeModeProps> = ({
  profile,
  onStartChallenge,
}) => {
  const unlockedTopicKeys: string[] = [];
  ALL_STAGES.forEach((stage) => {
    const isUnlocked = !stage.prerequisiteId || (profile.stagesProgress[stage.prerequisiteId]?.bestPercentage ?? 0) >= 80;
    if (isUnlocked) {
      stage.targetTopics.forEach((t) => {
        if (!unlockedTopicKeys.includes(t)) {
          unlockedTopicKeys.push(t);
        }
      });
    }
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-linear-to-br from-indigo-600 via-sky-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full w-fit text-xs font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
          <span>Modo Desafio Misto</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Mistura Maluca de Matemática!
        </h2>

        <p className="text-sm text-sky-100 max-w-xl">
          Teste sua agilidade mental com perguntas sorteadas de todas as matérias que você já aprendeu:
          somas, subtrações, dezenas e tabuadas misturadas!
        </p>

        <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>XP em Dobro (+30 XP por acerto)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-xl">
            <Flame className="w-4 h-4 text-orange-300 fill-orange-300" />
            <span>Bônus de Sequência</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border-2 border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-slate-800">Desafio Rápido</h3>
            <p className="text-xs text-slate-500">
              10 questões variadas sorteadas dos seus conteúdos desbloqueados. Perfeito para o dia a dia!
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                playClickSound();
                onStartChallenge(10);
              }}
              className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Jogar 10 Questões</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border-2 border-indigo-100 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-2xl">
              👑
            </div>
            <h3 className="text-lg font-bold text-slate-800">Super Desafio</h3>
            <p className="text-xs text-slate-500">
              15 questões misturadas para os verdadeiros campeões da matemática!
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => {
                playClickSound();
                onStartChallenge(15);
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Jogar 15 Questões</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Question, PerformanceSession } from '../types';
import { VisualExplainer } from './VisualExplainer';
import { playCorrectSound, playErrorSound, playClickSound } from '../utils/audio';
import { speakText, stopSpeaking } from '../utils/speech';
import { Volume2, CheckCircle2, ArrowRight, Flame, RotateCcw } from 'lucide-react';

interface ExerciseViewProps {
  stageTitle: string;
  stageId?: string;
  mode: 'trilha' | 'treino' | 'desafio' | 'reforco';
  questions: Question[];
  onFinishRound: (session: PerformanceSession) => void;
  onExit: () => void;
}

export const ExerciseView: React.FC<ExerciseViewProps> = ({
  stageTitle,
  stageId,
  mode,
  questions,
  onFinishRound,
  onExit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [attemptsOnCurrent, setAttemptsOnCurrent] = useState(0);

  const [correctCount, setCorrectCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [mistakes, setMistakes] = useState<PerformanceSession['mistakes']>([]);
  const [startTime] = useState<number>(Date.now());

  const currentQ = questions[currentIndex];

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowExplanation(false);
    setAttemptsOnCurrent(0);
  }, [currentIndex]);

  const handleSelectOption = (option: number | string) => {
    if (isAnswered && isCorrect) return;

    playClickSound();
    setSelectedAnswer(option);
    const correct = String(option) === String(currentQ.respostaCorreta);

    if (correct) {
      setIsCorrect(true);
      setIsAnswered(true);
      playCorrectSound();
      setCurrentStreak((prev) => prev + 1);

      if (attemptsOnCurrent === 0) {
        setCorrectCount((prev) => prev + 1);
      }
    } else {
      setIsCorrect(false);
      setIsAnswered(true);
      playErrorSound();
      setCurrentStreak(0);
      setAttemptsOnCurrent((prev) => prev + 1);

      setMistakes((prev) => [
        ...prev,
        {
          questionText: currentQ.pergunta,
          correctAnswer: currentQ.respostaCorreta,
          userAnswer: option,
          topic: currentQ.assunto,
        },
      ]);
    }
  };

  const handleNextQuestion = () => {
    stopSpeaking();
    playClickSound();

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);
      const percentage = Math.round((correctCount / questions.length) * 100);

      const session: PerformanceSession = {
        id: `sess_${Date.now()}`,
        timestamp: Date.now(),
        stageId,
        stageTitle,
        mode,
        totalQuestions: questions.length,
        correctCount,
        percentage,
        durationSeconds,
        mistakes,
      };

      onFinishRound(session);
    }
  };

  const handleSpeakQuestion = () => {
    if (!currentQ) return;
    speakText(currentQ.pergunta);
  };

  if (!currentQ) return null;

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-xs flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
            {stageTitle}
          </span>
          <div className="text-sm font-bold text-slate-800">
            Questão {currentIndex + 1} de {questions.length}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentStreak >= 2 && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-100 text-orange-700 text-xs font-bold animate-pulse">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              <span>Sequência de {currentStreak}!</span>
            </div>
          )}

          <button
            onClick={onExit}
            className="text-xs text-slate-400 hover:text-slate-700 font-bold px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="w-full bg-sky-100 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-linear-to-r from-sky-500 to-indigo-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-6 border-2 border-sky-100 shadow-md text-center space-y-4">
        <div className="flex justify-end">
          <button
            onClick={handleSpeakQuestion}
            className="p-1.5 text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Ouvir a pergunta"
          >
            <Volume2 className="w-4 h-4" />
            <span>Ouvir</span>
          </button>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight leading-snug">
            {currentQ.pergunta}
          </h2>
        </div>

        <div className="scale-90 origin-center my-[-10px]">
          <VisualExplainer visualData={currentQ.visualData} />
        </div>

        {/* Botão de avançar e Parabéns logo acima das opções quando já acertou */}
        {isAnswered && isCorrect && (
          <div className="space-y-2 py-1 animate-soft-pulse">
            <div className="w-full p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center gap-2 font-bold text-base sm:text-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <span>Parabéns! Você acertou! 🎉</span>
            </div>
            <button
              onClick={handleNextQuestion}
              className="w-full max-w-md mx-auto py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg font-extrabold rounded-2xl shadow-lg transition-transform transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentIndex + 1 === questions.length ? 'Ver Resultado Final' : 'Próxima Questão'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 pt-1">
          {currentQ.alternativas.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isTargetCorrect = String(option) === String(currentQ.respostaCorreta);

            let btnStyle =
              'bg-sky-50/80 hover:bg-sky-100/90 text-sky-900 border-2 border-sky-200 hover:border-sky-300';

            if (isAnswered) {
              if (isTargetCorrect) {
                btnStyle =
                  'bg-emerald-500 text-white border-2 border-emerald-600 ring-4 ring-emerald-100 shadow-md';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-100 text-rose-800 border-2 border-rose-300 opacity-80';
              } else {
                btnStyle = 'bg-slate-50 text-slate-400 border-2 border-slate-200 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered && isCorrect}
                onClick={() => handleSelectOption(option)}
                className={`py-3 px-2 sm:py-4 sm:px-4 rounded-2xl text-xl sm:text-2xl font-extrabold transition-all transform active:scale-95 cursor-pointer shadow-xs truncate w-full ${btnStyle}`}
                title={String(option)}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Popup Modal para Erro / Dica */}
        {isAnswered && !isCorrect && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full border-2 border-amber-200 shadow-2xl text-center space-y-4 animate-soft-pulse">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-3xl">
                💪
              </div>
              <h3 className="text-xl font-black text-slate-800">Quase lá! Vamos tentar novamente?</h3>

              {!showExplanation ? (
                <button
                  onClick={() => {
                    playClickSound();
                    setShowExplanation(true);
                  }}
                  className="text-xs text-amber-700 underline font-semibold hover:text-amber-900 cursor-pointer block mx-auto"
                >
                  Ver dica de como resolver
                </button>
              ) : (
                <p className="text-xs text-slate-700 font-medium bg-amber-50 p-3 rounded-xl border border-amber-200 text-left">
                  {currentQ.explicacao}
                </p>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={() => {
                    setIsAnswered(false);
                    setSelectedAnswer(null);
                  }}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Tentar Esta Novamente</span>
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Pular Questão
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { PerformanceSession, MasteryStatus } from '../types';
import { calculateMastery, getMasteryLabel } from '../services/storage';
import { playFanfare, playStarSound, playClickSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Star, ArrowRight, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';

interface RoundSummaryProps {
  session: PerformanceSession;
  onContinue: () => void;
  onRetry: () => void;
}

export const RoundSummary: React.FC<RoundSummaryProps> = ({
  session,
  onContinue,
  onRetry,
}) => {
  const masteryStatus: MasteryStatus = calculateMastery(session.percentage);
  const masteryInfo = getMasteryLabel(masteryStatus);

  let stars = 0;
  if (session.percentage >= 95) stars = 3;
  else if (session.percentage >= 80) stars = 2;
  else if (session.percentage >= 60) stars = 1;

  const passed = session.percentage >= 80;

  useEffect(() => {
    if (passed) {
      playFanfare();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Ignore
      }
    } else {
      playStarSound(0);
    }
  }, [passed]);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-xl text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-4xl shadow-inner">
            {passed ? '🏆' : '🌱'}
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            {passed ? 'Excelente Trabalho!' : 'Bom Esforço!'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {passed
              ? 'Você alcançou o domínio necessário para avançar!'
              : 'Continue praticando para dominar essa fase e liberar a próxima!'}
          </p>
        </div>

        <div className="flex justify-center items-center gap-3 py-2">
          {[1, 2, 3].map((starIdx) => (
            <Star
              key={starIdx}
              className={`w-10 h-10 transition-all ${
                starIdx <= stars
                  ? 'text-amber-400 fill-amber-400 drop-shadow-md scale-110'
                  : 'text-slate-200'
              }`}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
          <div>
            <span className="text-xs font-semibold text-sky-700">Acertos</span>
            <div className="text-2xl sm:text-3xl font-black text-sky-900">
              {session.correctCount} / {session.totalQuestions}
            </div>
          </div>
          <div>
            <span className="text-xs font-semibold text-sky-700">Aproveitamento</span>
            <div className="text-2xl sm:text-3xl font-black text-sky-900">
              {session.percentage}%
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div
            className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 ${masteryInfo.badgeBg} ${masteryInfo.color}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Nível de Domínio: {masteryInfo.text}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          {passed ? (
            <span className="text-emerald-700 font-bold">
              ✓ Meta de 80% atingida! Próxima fase desbloqueada na Trilha!
            </span>
          ) : (
            <span className="text-amber-800 font-semibold">
              Exigência para desbloqueio: pelo menos 80% de domínio (você fez {session.percentage}%).
            </span>
          )}
        </div>

        {session.mistakes.length > 0 && (
          <div className="text-left bg-rose-50/60 border border-rose-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
              <AlertCircle className="w-4 h-4" />
              <span>Questões para revisar ({session.mistakes.length}):</span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {session.mistakes.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-xl border border-rose-100 text-xs space-y-1"
                >
                  <p className="font-bold text-slate-800">{m.questionText}</p>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-rose-600 font-medium">Sua resposta: {m.userAnswer}</span>
                    <span className="text-emerald-700 font-bold">Resposta correta: {m.correctAnswer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => {
              playClickSound();
              onRetry();
            }}
            className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tentar Novamente</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onContinue();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold shadow-md transition-transform transform active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Continuar na Trilha</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

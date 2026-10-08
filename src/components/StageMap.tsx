import React from 'react';
import { ChildProfile, Stage } from '../types';
import { ALL_STAGES } from '../data/stages';
import { isStageUnlocked, getMasteryLabel } from '../services/storage';
import { Lock, Star, Sparkles, CheckCircle2, Play } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface StageMapProps {
  profile: ChildProfile;
  selectedLevel: 1 | 2;
  onSelectLevel: (lvl: 1 | 2) => void;
  onStartStage: (stage: Stage) => void;
  onStartReinforcement: (topicKey: string) => void;
}

export const StageMap: React.FC<StageMapProps> = ({
  profile,
  selectedLevel,
  onSelectLevel,
  onStartStage,
  onStartReinforcement,
}) => {
  const stages = ALL_STAGES.filter((s) => s.level === selectedLevel);

  const needRefList = Object.entries(profile.topicsStats).filter(
    ([_, stat]) => stat.presented >= 3 && stat.percentage < 80
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-sky-100 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Mapa de Aprendizado</h2>
          <p className="text-xs text-slate-500">
            Avanço progressivo com domínio mínimo de 80% para desbloquear a próxima fase.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-sky-100/70 rounded-xl">
          <button
            onClick={() => {
              playClickSound();
              onSelectLevel(1);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedLevel === 1
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-sky-800 hover:bg-white/60'
            }`}
          >
            Nível 1 — Fundamentos
          </button>
          <button
            onClick={() => {
              playClickSound();
              onSelectLevel(2);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              selectedLevel === 2
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-sky-800 hover:bg-white/60'
            }`}
          >
            Nível 2 — Desafios Avançados
          </button>
        </div>
      </div>

      {needRefList.length > 0 && (
        <div className="bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 bg-amber-100 rounded-xl">💡</span>
            <div>
              <h3 className="text-sm font-bold text-amber-900">
                Dica do Professor Digital: Reforço Recomendado!
              </h3>
              <p className="text-xs text-amber-800">
                Você teve alguns errinhos em{' '}
                <strong className="font-semibold">{needRefList[0][1].label}</strong> ({needRefList[0][1].percentage}% de acerto). Que tal praticar mais um pouco?
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onStartReinforcement(needRefList[0][0]);
            }}
            className="w-full sm:w-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            Treinar Agora
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stages.map((stage) => {
          const unlocked = isStageUnlocked(stage.id, profile);
          const progress = profile.stagesProgress[stage.id];
          const bestPct = progress?.bestPercentage || 0;
          const stars = progress?.stars || 0;
          const masteryStatus = progress?.masteryLevel || 'precisa_treinar';
          const mastery = getMasteryLabel(masteryStatus);

          return (
            <div
              key={stage.id}
              className={`relative rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                unlocked
                  ? 'bg-white border-sky-100 hover:border-sky-300 hover:shadow-md cursor-pointer'
                  : 'bg-slate-50/80 border-slate-200 opacity-75'
              }`}
              onClick={() => {
                if (unlocked) {
                  playClickSound();
                  onStartStage(stage);
                }
              }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-xl bg-sky-50 border border-sky-100">
                      {stage.icon}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                        Fase {stage.order}
                      </span>
                      <h3 className="text-base font-bold text-slate-800 leading-tight">
                        {stage.title}
                      </h3>
                    </div>
                  </div>

                  <div>
                    {!unlocked ? (
                      <span className="p-1.5 rounded-lg bg-slate-200 text-slate-500 flex items-center justify-center">
                        <Lock className="w-4 h-4" />
                      </span>
                    ) : progress?.completed ? (
                      <span className="p-1 rounded-lg text-emerald-600 flex items-center justify-center" title="Fase Dominada!">
                        <CheckCircle2 className="w-5 h-5" />
                      </span>
                    ) : null}
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                  {stage.description}
                </p>

                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] font-mono text-slate-600 mb-3">
                  {stage.subtitle}
                </div>

                {unlocked && (
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${mastery.badgeBg} ${mastery.color}`}
                      >
                        {mastery.text}
                      </span>
                      <span className="font-mono font-bold text-slate-700">
                        {progress?.attempts ? `${bestPct}%` : 'Não iniciado'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className={`w-4 h-4 ${
                            starIdx <= stars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200'
                          }`}
                        />
                      ))}
                      {progress?.attempts ? (
                        <span className="text-[10px] text-slate-400 ml-auto">
                          {progress.attempts} {progress.attempts === 1 ? 'tentativa' : 'tentativas'}
                        </span>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-slate-50 border-t border-slate-100 mt-auto">
                {unlocked ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playClickSound();
                      onStartStage(stage);
                    }}
                    className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    {progress?.completed ? 'Jogar Novamente' : 'Iniciar Fase (10 Questões)'}
                  </button>
                ) : (
                  <div className="text-center text-[11px] text-slate-500 font-medium py-1">
                    Bloqueado · Obtenha 80% na fase anterior
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

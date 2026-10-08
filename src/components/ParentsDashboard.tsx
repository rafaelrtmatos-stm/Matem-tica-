import React, { useState } from 'react';
import { ChildProfile } from '../types';
import { playClickSound } from '../utils/audio';
import {
  Lock,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

interface ParentsDashboardProps {
  profile: ChildProfile;
  onStartReinforcement: (topicKey: string) => void;
}

export const ParentsDashboard: React.FC<ParentsDashboardProps> = ({
  profile,
  onStartReinforcement,
}) => {
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [mathQuestion] = useState({ n1: 7, n2: 6, answer: 42 });
  const [gateInput, setGateInput] = useState('');
  const [gateError, setGateError] = useState(false);

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(gateInput, 10) === mathQuestion.answer) {
      setGateUnlocked(true);
      setGateError(false);
    } else {
      setGateError(true);
      setGateInput('');
    }
  };

  if (!gateUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border-2 border-amber-100 shadow-lg text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-2xl">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800">Área Exclusiva dos Pais</h2>
          <p className="text-xs text-slate-500 mt-1">
            Por favor, responda à verificação para confirmar que você é um adulto responsável:
          </p>
        </div>

        <form onSubmit={handleVerifyGate} className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <span className="text-xs font-bold text-amber-900 block mb-1">Desafio de Segurança:</span>
            <span className="text-2xl font-black text-slate-800">
              Quanto é {mathQuestion.n1} × {mathQuestion.n2}?
            </span>
          </div>

          <div>
            <input
              type="number"
              placeholder="Digite a resposta"
              value={gateInput}
              onChange={(e) => setGateInput(e.target.value)}
              className="w-full text-center py-3 px-4 rounded-xl border border-slate-300 text-lg font-bold focus:outline-sky-500"
              autoFocus
            />
            {gateError && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5">
                Resposta incorreta. Tente novamente!
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Acessar Painel
          </button>
        </form>
      </div>
    );
  }

  const multStats = Array.from({ length: 10 }, (_, i) => {
    const tab = i + 1;
    const stageId = `n1-mult-${tab}`;
    const stageProgress = profile.stagesProgress[stageId];
    const topicStat = profile.topicsStats[`tabuada_${tab}`];

    let pct = 0;
    if (stageProgress && stageProgress.attempts > 0) {
      pct = stageProgress.bestPercentage;
    } else if (topicStat && topicStat.presented > 0) {
      pct = topicStat.percentage;
    }

    return {
      table: tab,
      label: `×${tab}`,
      percentage: pct,
      needsReinforcement: pct > 0 && pct < 80,
      notStarted: pct === 0,
    };
  });

  const recommendedTables = multStats.filter((m) => m.needsReinforcement);

  const studyMinutes = Math.round(profile.totalStudySeconds / 60);
  const accuracy =
    profile.totalAnswered > 0
      ? Math.round((profile.totalCorrect / profile.totalAnswered) * 100)
      : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4" />
            <span>Relatório Pedagógico e Painel dos Responsáveis</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mt-1">
            Acompanhamento de {profile.name}
          </h2>
          <p className="text-xs text-slate-500">
            Métricas detalhadas de domínio, taxa de retenção e evolução do aprendizado.
          </p>
        </div>

        <button
          onClick={() => {
            playClickSound();
            setGateUnlocked(false);
          }}
          className="px-3.5 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          Bloquear Acesso
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 block">Total de Exercícios</span>
          <span className="text-2xl font-black text-slate-800">{profile.totalAnswered}</span>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
            {profile.totalCorrect} acertos
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 block">Aproveitamento Geral</span>
          <span className="text-2xl font-black text-slate-800">{accuracy}%</span>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
            Meta pedagógica: 80%
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 block">Tempo Dedicado</span>
          <span className="text-2xl font-black text-slate-800">{studyMinutes} min</span>
          <span className="text-[10px] text-sky-600 font-medium block mt-0.5">
            {profile.history.length} sessões registradas
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 block">Estrelas Acumuladas</span>
          <span className="text-2xl font-black text-amber-600">{profile.totalStars} ⭐</span>
          <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
            {profile.scoreXP} pontos de XP
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Desempenho em Multiplicação (Tabuada do 1 ao 10)
            </h3>
            <p className="text-xs text-slate-500">
              Acompanhamento individual de cada tabuada com diagnóstico de reforço.
            </p>
          </div>

          {recommendedTables.length > 0 && (
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Reforço recomendado principalmente em:{' '}
                <strong>{recommendedTables.map((t) => t.label).join(', ')}</strong>
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {multStats.map((item) => {
            let barColor = 'bg-slate-300';
            let textColor = 'text-slate-500';

            if (!item.notStarted) {
              if (item.percentage >= 90) {
                barColor = 'bg-emerald-500';
                textColor = 'text-emerald-700 font-bold';
              } else if (item.percentage >= 80) {
                barColor = 'bg-blue-500';
                textColor = 'text-blue-700 font-bold';
              } else {
                barColor = 'bg-rose-500';
                textColor = 'text-rose-700 font-bold';
              }
            }

            return (
              <div
                key={item.table}
                className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 flex items-center justify-between gap-3"
              >
                <div className="w-16">
                  <span className="text-xs font-black text-slate-800">Tabuada {item.label}</span>
                </div>

                <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} transition-all duration-300`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <div className="w-14 text-right">
                  <span className={`text-xs font-mono ${textColor}`}>
                    {item.notStarted ? '0%' : `${item.percentage}%`}
                  </span>
                </div>

                {item.needsReinforcement && (
                  <button
                    onClick={() => {
                      playClickSound();
                      onStartReinforcement(`tabuada_${item.table}`);
                    }}
                    className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-md font-bold cursor-pointer"
                  >
                    Praticar
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-800">Histórico Recente de Atividades</h3>

        {profile.history.length === 0 ? (
          <p className="text-xs text-slate-400 italic">Nenhuma atividade registrada ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold">
                  <th className="pb-2">Data / Hora</th>
                  <th className="pb-2">Fase / Conteúdo</th>
                  <th className="pb-2">Modo</th>
                  <th className="pb-2">Acertos</th>
                  <th className="pb-2">Aproveitamento</th>
                  <th className="pb-2">Tempo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profile.history.slice(0, 10).map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 text-slate-500 font-mono">
                      {new Date(h.timestamp).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 font-bold text-slate-800">{h.stageTitle}</td>
                    <td className="py-2.5">
                      <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                        {h.mode}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-slate-700">
                      {h.correctCount} / {h.totalQuestions}
                    </td>
                    <td className="py-2.5 font-mono">
                      <span
                        className={`font-bold ${
                          h.percentage >= 80 ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {h.percentage}%
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-slate-500">{h.durationSeconds}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

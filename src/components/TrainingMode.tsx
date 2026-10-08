import React from 'react';
import { ChildProfile } from '../types';
import { playClickSound } from '../utils/audio';
import { Sparkles, Play } from 'lucide-react';

interface TrainingModeProps {
  profile: ChildProfile;
  onStartTrainingTopic: (topicKey: string, topicLabel: string) => void;
}

interface TrainingOption {
  key: string;
  label: string;
  category: string;
  icon: string;
  description: string;
}

const TRAINING_OPTIONS: TrainingOption[] = [
  {
    key: 'soma_unidades_pequenas',
    label: 'SOMA DE UNIDADES',
    category: 'Soma',
    icon: '➕',
    description: 'Praticar somas de números de 1 a 9',
  },
  {
    key: 'soma_dezenas_exatas',
    label: 'SOMA COM DEZENAS',
    category: 'Dezenas',
    icon: '🧱',
    description: '10 + 10, 20 + 30, 40 + 10 e mais',
  },
  {
    key: 'subtracao_unidades',
    label: 'SUBTRAÇÃO DE UNIDADES',
    category: 'Subtração',
    icon: '➖',
    description: 'Tirar quantidades e calcular o resto',
  },
  {
    key: 'subtracao_dezenas_exatas',
    label: 'SUBTRAÇÃO COM DEZENAS',
    category: 'Subtração',
    icon: '🎯',
    description: '50 - 20, 70 - 30 e contas dezenas',
  },
  {
    key: 'tabuada_1',
    label: 'TABUADA DO 1',
    category: 'Multiplicação',
    icon: '✨',
    description: '1 × 1 até 10 × 1',
  },
  {
    key: 'tabuada_2',
    label: 'TABUADA DO 2',
    category: 'Multiplicação',
    icon: '✌️',
    description: 'O dobro: 1 × 2 até 10 × 2',
  },
  {
    key: 'tabuada_3',
    label: 'TABUADA DO 3',
    category: 'Multiplicação',
    icon: '🔺',
    description: 'Contando de 3 em 3',
  },
  {
    key: 'tabuada_4',
    label: 'TABUADA DO 4',
    category: 'Multiplicação',
    icon: '🍀',
    description: 'Grupos de 4: 1 × 4 até 10 × 4',
  },
  {
    key: 'tabuada_5',
    label: 'TABUADA DO 5',
    category: 'Multiplicação',
    icon: '🖐️',
    description: 'De 5 em 5: fácil e divertido',
  },
  {
    key: 'tabuada_6',
    label: 'TABUADA DO 6',
    category: 'Multiplicação',
    icon: '🎲',
    description: 'Grupos de 6: 1 × 6 até 10 × 6',
  },
  {
    key: 'tabuada_7',
    label: 'TABUADA DO 7',
    category: 'Multiplicação',
    icon: '🌈',
    description: 'Treino intensivo para dominar a tabuada do 7',
  },
  {
    key: 'tabuada_8',
    label: 'TABUADA DO 8',
    category: 'Multiplicação',
    icon: '🐙',
    description: 'Grupos de 8: 1 × 8 até 10 × 8',
  },
  {
    key: 'tabuada_9',
    label: 'TABUADA DO 9',
    category: 'Multiplicação',
    icon: '🪄',
    description: 'O padrão mágico da tabuada do 9',
  },
  {
    key: 'tabuada_10',
    label: 'TABUADA DO 10',
    category: 'Multiplicação',
    icon: '👑',
    description: 'Acrescentando o zero: 1 × 10 até 10 × 10',
  },
  {
    key: 'dezenas_unidades_mistas',
    label: 'DEZENAS E UNIDADES MISTAS',
    category: 'Dezenas',
    icon: '🧮',
    description: '23 + 15, 56 - 23 e operações mistas',
  },
  {
    key: 'multiplicacao_mista_1',
    label: 'MULTIPLICAÇÃO MISTA',
    category: 'Multiplicação',
    icon: '⚡',
    description: '12 × 2, 15 × 3, 21 × 4 e além',
  },
  {
    key: 'problemas_contexto',
    label: 'PROBLEMAS MATEMÁTICOS',
    category: 'Problemas',
    icon: '📖',
    description: 'Interpretação e raciocínio com historinhas',
  },
];

export const TrainingMode: React.FC<TrainingModeProps> = ({
  profile,
  onStartTrainingTopic,
}) => {
  const needReinforcementTopics = Object.entries(profile.topicsStats)
    .filter(([_, stat]) => stat.presented >= 2 && stat.percentage < 80)
    .map(([key]) => key);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs">
        <h2 className="text-xl font-bold text-slate-800">Modo Treino Livre</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Escolha qualquer operação ou tabuada para praticar sem pressão e aprimorar seus conhecimentos.
        </p>
      </div>

      {needReinforcementTopics.length > 0 && (
        <div className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>Reforço Personalizado Recomendado</span>
          </div>
          <p className="text-xs text-amber-800">
            Identificamos que você pode melhorar o domínio nestes tópicos. Clique para treinar especificamente:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {needReinforcementTopics.map((topicKey) => {
              const opt = TRAINING_OPTIONS.find((o) => o.key === topicKey);
              if (!opt) return null;
              const stat = profile.topicsStats[topicKey];
              return (
                <button
                  key={topicKey}
                  onClick={() => {
                    playClickSound();
                    onStartTrainingTopic(topicKey, opt.label);
                  }}
                  className="px-3.5 py-2 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-200 text-amber-800 rounded-md">
                    {stat ? `${stat.percentage}%` : 'Reforçar'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {TRAINING_OPTIONS.map((item) => {
          const stat = profile.topicsStats[item.key];
          return (
            <div
              key={item.key}
              onClick={() => {
                playClickSound();
                onStartTrainingTopic(item.key, item.label);
              }}
              className="bg-white hover:bg-sky-50/50 border border-sky-100 hover:border-sky-300 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-xl bg-sky-50 border border-sky-100 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-800 leading-tight">
                        {item.label}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-3">{item.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold text-slate-500">
                  {stat ? `Domínio: ${stat.percentage}%` : 'Não praticado'}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    onStartTrainingTopic(item.key, item.label);
                  }}
                  className="px-3 py-1.5 bg-sky-600 group-hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Treinar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

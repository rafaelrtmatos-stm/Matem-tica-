import React from 'react';
import { VisualData } from '../types';

interface Props {
  visualData?: VisualData;
}

export const VisualExplainer: React.FC<Props> = ({ visualData }) => {
  if (!visualData) return null;

  if (visualData.type === 'grouping' && visualData.num1 && visualData.num2) {
    const groups = visualData.num1;
    const itemsPerGroup = visualData.num2;
    if (groups * itemsPerGroup <= 70) {
      return (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 my-3 text-center">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-2">
            Visualização: {groups} {groups === 1 ? 'grupo' : 'grupos'} com {itemsPerGroup} {itemsPerGroup === 1 ? 'item' : 'itens'} cada
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {Array.from({ length: groups }).map((_, gIdx) => (
              <div
                key={gIdx}
                className="bg-white border-2 border-amber-300 rounded-xl p-2 shadow-xs flex items-center justify-center gap-1.5"
              >
                {Array.from({ length: itemsPerGroup }).map((_, iIdx) => (
                  <div
                    key={iIdx}
                    className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-linear-to-tr from-amber-400 to-amber-500 shadow-xs border border-amber-500 flex items-center justify-center text-[9px] text-white font-bold"
                  >
                    •
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }
  }

  if (visualData.type === 'blocks') {
    const tens = visualData.tens || 0;
    const units = visualData.units || 0;
    return (
      <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-4 my-3 text-center">
        <p className="text-xs font-semibold text-sky-800 uppercase tracking-wide mb-2">
          Dezenas e Unidades: {tens} {tens === 1 ? 'dezena' : 'dezenas'} ({tens * 10}) + {units} {units === 1 ? 'unidade' : 'unidades'} ({units})
        </p>
        <div className="flex flex-wrap items-end justify-center gap-4">
          {tens > 0 && (
            <div className="flex items-end gap-1.5 p-2 bg-white/80 rounded-xl border border-sky-200 shadow-xs">
              {Array.from({ length: Math.min(tens, 10) }).map((_, bIdx) => (
                <div key={bIdx} className="flex flex-col items-center">
                  <div className="w-4 h-24 bg-linear-to-b from-amber-400 via-amber-300 to-amber-500 border border-amber-600 rounded-xs flex flex-col justify-between p-[1px] shadow-xs">
                    {Array.from({ length: 10 }).map((_, segmentIdx) => (
                      <div key={segmentIdx} className="h-2 border-b border-amber-600/30" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 mt-0.5">10</span>
                </div>
              ))}
            </div>
          )}

          {units > 0 && (
            <div className="flex items-center gap-1.5 p-2 bg-white/80 rounded-xl border border-sky-200 shadow-xs">
              {Array.from({ length: units }).map((_, uIdx) => (
                <div
                  key={uIdx}
                  className="w-4 h-4 bg-amber-300 border border-amber-600 rounded-xs flex items-center justify-center text-[8px] font-bold text-amber-800 shadow-xs"
                >
                  1
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (visualData.type === 'number_line' && visualData.highlightNumber !== undefined) {
    const center = visualData.highlightNumber;
    const start = Math.max(0, center - 2);
    const range = Array.from({ length: 5 }, (_, i) => start + i);

    return (
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 my-3 text-center">
        <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-2">
          Reta Numérica
        </p>
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
          {range.map((num) => {
            const isTarget = num === center;
            const isBefore = visualData.beforeNum === num;
            const isAfter = visualData.afterNum === num;

            let badgeStyle = 'bg-white text-slate-700 border-slate-300';
            if (isTarget) {
              badgeStyle = 'bg-emerald-600 text-white border-emerald-700 scale-110 font-bold ring-2 ring-emerald-300';
            } else if (isBefore || isAfter) {
              badgeStyle = 'bg-amber-100 text-amber-800 border-amber-400 font-bold border-dashed';
            }

            return (
              <div key={num} className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center text-sm shadow-xs transition-transform ${badgeStyle}`}
                >
                  {num}
                </div>
                {isTarget && <span className="text-[10px] text-emerald-700 font-bold mt-1">Número</span>}
                {isBefore && <span className="text-[10px] text-amber-700 font-bold mt-1">Antes</span>}
                {isAfter && <span className="text-[10px] text-amber-700 font-bold mt-1">Depois</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (visualData.type === 'objects' && visualData.num1) {
    const count = visualData.num1;
    const emojis = {
      apple: '🍎',
      star: '⭐',
      balloon: '🎈',
      pencil: '✏️',
      fish: '🐠',
    };
    const emoji = emojis[visualData.objectType || 'star'];

    if (count <= 24) {
      return (
        <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 my-3 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-sm mx-auto">
            {Array.from({ length: count }).map((_, idx) => (
              <span
                key={idx}
                className="text-2xl p-1 bg-white rounded-lg shadow-xs border border-purple-100 transform hover:scale-115 transition-transform"
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      );
    }
  }

  if (visualData.type === 'dots' && visualData.num1 !== undefined && visualData.num2 !== undefined) {
    const a = visualData.num1;
    const b = visualData.num2;
    const op = visualData.operator || '+';

    return (
      <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-2xl p-4 my-3 text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="flex flex-wrap gap-1 max-w-[120px] justify-center p-2 bg-white rounded-xl border border-indigo-100 shadow-xs">
            {Array.from({ length: a }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-blue-500 border border-blue-600 shadow-xs"
              />
            ))}
          </div>

          <span className="text-xl font-bold text-indigo-700">{op}</span>

          <div className="flex flex-wrap gap-1 max-w-[120px] justify-center p-2 bg-white rounded-xl border border-indigo-100 shadow-xs">
            {Array.from({ length: b }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border shadow-xs ${
                  op === '-' ? 'bg-rose-400 border-rose-500 opacity-60' : 'bg-amber-400 border-amber-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

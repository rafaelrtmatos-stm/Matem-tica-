import React, { useState } from 'react';
import { ChildProfile } from '../types';
import { ALL_ACHIEVEMENTS } from '../data/achievements';
import { ALL_STAGES } from '../data/stages';
import { playClickSound } from '../utils/audio';
import {
  Star,
  Flame,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit2,
  Check,
  Award,
} from 'lucide-react';

interface ChildProfileViewProps {
  profile: ChildProfile;
  allProfiles: ChildProfile[];
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (name: string, avatar: string, ageGroup: '4-6' | '7-9' | '10+') => void;
  onUpdateProfile: (updated: ChildProfile) => void;
  onGoToReinforcement: (topicKey: string) => void;
}

const AVATAR_OPTIONS = ['🦁', '🦄', '🚀', '🐼', '🦊', '🐯', '🤖', '🐬', '🦖', '🌟', '🦉', '🐱'];

export const ChildProfileView: React.FC<ChildProfileViewProps> = ({
  profile,
  allProfiles,
  onSelectProfile,
  onCreateProfile,
  onUpdateProfile,
  onGoToReinforcement,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editAvatar, setEditAvatar] = useState(profile.avatar);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newAvatar, setNewAvatar] = useState('🦁');
  const [newAge, setNewAge] = useState<'4-6' | '7-9' | '10+'>('7-9');

  const handleSaveEdit = () => {
    if (!editName.trim()) return;
    playClickSound();
    onUpdateProfile({
      ...profile,
      name: editName.trim(),
      avatar: editAvatar,
    });
    setIsEditing(false);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    playClickSound();
    onCreateProfile(newName.trim(), newAvatar, newAge);
    setShowNewModal(false);
    setNewName('');
  };

  const accuracy =
    profile.totalAnswered > 0
      ? Math.round((profile.totalCorrect / profile.totalAnswered) * 100)
      : 0;

  const studyMinutes = Math.round(profile.totalStudySeconds / 60);

  const masteredStages = ALL_STAGES.filter((s) => {
    const prog = profile.stagesProgress[s.id];
    return prog && prog.bestPercentage >= 80;
  });

  const reinforcementTopics = Object.entries(profile.topicsStats).filter(
    ([_, stat]) => stat.presented >= 2 && stat.percentage < 80
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-linear-to-tr from-sky-400 to-indigo-500 p-1 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[22px] flex items-center justify-center text-4xl">
                  {profile.avatar}
                </div>
              </div>
            </div>

            <div>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="px-3 py-1.5 border border-sky-300 rounded-xl text-lg font-bold text-slate-800 focus:outline-sky-500"
                    maxLength={15}
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-slate-800">{profile.name}</h2>
                  <button
                    onClick={() => {
                      playClickSound();
                      setIsEditing(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                    title="Editar nome ou avatar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="text-xs font-semibold text-slate-500 mt-1">
                Nível Atual: <span className="text-sky-600 font-bold">Nível {profile.currentLevel}</span> · Faixa etária: {profile.ageGroup} anos
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {allProfiles.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  playClickSound();
                  onSelectProfile(p.id);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  p.id === profile.id
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{p.avatar}</span>
                <span>{p.name}</span>
              </button>
            ))}

            <button
              onClick={() => {
                playClickSound();
                setShowNewModal(true);
              }}
              className="px-3 py-1.5 rounded-xl border border-dashed border-sky-300 text-sky-700 hover:bg-sky-50 text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Perfil</span>
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 space-y-2">
            <span className="text-xs font-bold text-sky-900">Escolha seu Avatar:</span>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  onClick={() => setEditAvatar(av)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-transform ${
                    editAvatar === av
                      ? 'bg-sky-600 text-white scale-110 shadow-xs'
                      : 'bg-white hover:bg-sky-100'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-center">
            <div className="flex justify-center text-amber-500 mb-1">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-900">{profile.totalStars}</div>
            <div className="text-[11px] font-bold text-amber-700">Estrelas Ganhas</div>
          </div>

          <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-4 text-center">
            <div className="flex justify-center text-orange-500 mb-1">
              <Flame className="w-5 h-5 fill-orange-500" />
            </div>
            <div className="text-2xl font-black text-orange-900">{profile.bestStreak}</div>
            <div className="text-[11px] font-bold text-orange-700">Melhor Sequência</div>
          </div>

          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-center">
            <div className="flex justify-center text-emerald-500 mb-1">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-900">{accuracy}%</div>
            <div className="text-[11px] font-bold text-emerald-700">
              Taxa de Acerto ({profile.totalCorrect}/{profile.totalAnswered})
            </div>
          </div>

          <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 text-center">
            <div className="flex justify-center text-indigo-500 mb-1">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-indigo-900">{studyMinutes} min</div>
            <div className="text-[11px] font-bold text-indigo-700">Tempo de Estudo</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Conteúdos Dominados ({masteredStages.length})</span>
          </div>

          {masteredStages.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              Conclua fases com pelo menos 80% de aproveitamento para listá-las aqui!
            </p>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {masteredStages.map((stage) => {
                const prog = profile.stagesProgress[stage.id];
                return (
                  <div
                    key={stage.id}
                    className="flex items-center justify-between p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span>{stage.icon}</span>
                      <span className="font-bold text-slate-800">{stage.title}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">
                      {prog.bestPercentage}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-base">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span>Precisam de Reforço ({reinforcementTopics.length})</span>
          </div>

          {reinforcementTopics.length === 0 ? (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
              <span className="text-2xl mb-1 block">🎉</span>
              <p className="text-xs text-emerald-800 font-bold">
                Nenhuma dificuldade detectada no momento! Excelente aproveitamento.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {reinforcementTopics.map(([key, stat]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2.5 bg-amber-50/60 rounded-xl border border-amber-200 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">{stat.label}</span>
                    <span className="text-[10px] text-amber-700 font-medium">
                      Aproveitamento: {stat.percentage}% ({stat.errors} erros)
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      playClickSound();
                      onGoToReinforcement(key);
                    }}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Treinar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-lg">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Medalhas & Conquistas</span>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {profile.unlockedAchievements.length} de {ALL_ACHIEVEMENTS.length} desbloqueadas
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {ALL_ACHIEVEMENTS.map((ach) => {
            const unlocked = profile.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  unlocked
                    ? 'bg-amber-50/50 border-amber-200 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
                }`}
              >
                <div className="text-3xl mb-1">{ach.icon}</div>
                <h4 className="text-xs font-bold text-slate-800 leading-tight">{ach.title}</h4>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{ach.description}</p>
                {unlocked && (
                  <span className="inline-block mt-2 text-[9px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Conquistada!
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-sky-100 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Criar Perfil da Criança</h3>
            <form onSubmit={handleCreateNew} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nome:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Sofia, Pedro..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Avatar:</label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.slice(0, 8).map((av) => (
                    <button
                      type="button"
                      key={av}
                      onClick={() => setNewAvatar(av)}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center ${
                        newAvatar === av ? 'bg-sky-600 text-white' : 'bg-slate-100'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Idade aproximada:</label>
                <div className="flex gap-2">
                  {(['4-6', '7-9', '10+'] as const).map((ag) => (
                    <button
                      type="button"
                      key={ag}
                      onClick={() => setNewAge(ag)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border ${
                        newAge === ag
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {ag} anos
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-sky-600 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  Criar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

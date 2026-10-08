import React from 'react';
import { ChildProfile } from '../types';
import { Volume2, VolumeX, Sparkles, Flame, ShieldAlert } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface HeaderProps {
  currentTab: 'trilha' | 'treino' | 'desafio' | 'perfil' | 'pais';
  onSelectTab: (tab: 'trilha' | 'treino' | 'desafio' | 'perfil' | 'pais') => void;
  profile: ChildProfile;
  soundOn: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  profile,
  soundOn,
  onToggleSound,
}) => {
  const handleNavClick = (tab: 'trilha' | 'treino' | 'desafio' | 'perfil' | 'pais') => {
    playClickSound();
    onSelectTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={() => handleNavClick('trilha')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-sky-600 group-hover:text-sky-700 transition-colors">
            Aprender Calculando
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => handleNavClick('trilha')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 whitespace-nowrap ${
              currentTab === 'trilha'
                ? 'text-sky-600 border-sky-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Trilha de Fases
          </button>
          <button
            onClick={() => handleNavClick('treino')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 whitespace-nowrap ${
              currentTab === 'treino'
                ? 'text-sky-600 border-sky-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Modo Treino
          </button>
          <button
            onClick={() => handleNavClick('desafio')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 whitespace-nowrap ${
              currentTab === 'desafio'
                ? 'text-sky-600 border-sky-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Desafio Misto
          </button>
          <button
            onClick={() => handleNavClick('perfil')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 whitespace-nowrap ${
              currentTab === 'perfil'
                ? 'text-sky-600 border-sky-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Perfil da Criança
          </button>
          <button
            onClick={() => handleNavClick('pais')}
            className={`cursor-pointer transition-colors pb-1 border-b-2 whitespace-nowrap flex items-center gap-1 ${
              currentTab === 'pais'
                ? 'text-amber-600 border-amber-600 font-bold'
                : 'border-transparent text-amber-700/80 hover:text-amber-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Painel dos Pais
          </button>
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onToggleSound}
            aria-label={soundOn ? 'Desativar som' : 'Ativar som'}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title={soundOn ? 'Som ativado' : 'Som desativado'}
          >
            {soundOn ? <Volume2 className="w-5 h-5 text-sky-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          <button
            onClick={() => handleNavClick('perfil')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 transition-colors cursor-pointer shadow-2xs"
          >
            <span className="text-lg leading-none">{profile.avatar}</span>
            <span className="text-xs font-bold text-amber-900 hidden sm:inline">{profile.name}</span>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{profile.totalStars}</span>
            </div>
            {profile.currentStreak > 0 && (
              <div className="flex items-center gap-0.5 text-xs font-bold text-rose-600">
                <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>{profile.currentStreak}</span>
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="md:hidden flex items-center justify-around px-2 py-1.5 border-t border-sky-100/80 bg-sky-50/50 text-xs font-bold text-slate-600">
        <button
          onClick={() => handleNavClick('trilha')}
          className={`px-2 py-1 rounded-lg ${currentTab === 'trilha' ? 'bg-sky-600 text-white' : ''}`}
        >
          Trilha
        </button>
        <button
          onClick={() => handleNavClick('treino')}
          className={`px-2 py-1 rounded-lg ${currentTab === 'treino' ? 'bg-sky-600 text-white' : ''}`}
        >
          Treino
        </button>
        <button
          onClick={() => handleNavClick('desafio')}
          className={`px-2 py-1 rounded-lg ${currentTab === 'desafio' ? 'bg-sky-600 text-white' : ''}`}
        >
          Desafio
        </button>
        <button
          onClick={() => handleNavClick('perfil')}
          className={`px-2 py-1 rounded-lg ${currentTab === 'perfil' ? 'bg-sky-600 text-white' : ''}`}
        >
          Perfil
        </button>
        <button
          onClick={() => handleNavClick('pais')}
          className={`px-2 py-1 rounded-lg ${currentTab === 'pais' ? 'bg-amber-600 text-white' : 'text-amber-800'}`}
        >
          Pais
        </button>
      </div>
    </header>
  );
};

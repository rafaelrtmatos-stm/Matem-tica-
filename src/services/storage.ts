import { ChildProfile, MasteryStatus, PerformanceSession, StageProgress } from '../types';
import { ALL_STAGES } from '../data/stages';

const PROFILES_KEY = 'aprender_mat_profiles_v1';
const ACTIVE_PROFILE_ID_KEY = 'aprender_mat_active_id_v1';

export function calculateMastery(percentage: number): MasteryStatus {
  if (percentage >= 90) return 'dominio_completo';
  if (percentage >= 80) return 'bom_dominio';
  if (percentage >= 60) return 'aprendendo';
  return 'precisa_treinar';
}

export function getMasteryLabel(status: MasteryStatus): { text: string; color: string; badgeBg: string } {
  switch (status) {
    case 'dominio_completo':
      return { text: 'Domínio Completo', color: 'text-emerald-700', badgeBg: 'bg-emerald-100 border-emerald-300' };
    case 'bom_dominio':
      return { text: 'Bom Domínio', color: 'text-blue-700', badgeBg: 'bg-blue-100 border-blue-300' };
    case 'aprendendo':
      return { text: 'Aprendendo', color: 'text-amber-700', badgeBg: 'bg-amber-100 border-amber-300' };
    case 'precisa_treinar':
    default:
      return { text: 'Precisa Treinar', color: 'text-rose-700', badgeBg: 'bg-rose-100 border-rose-300' };
  }
}

const DEFAULT_PROFILE: ChildProfile = {
  id: 'profile_default',
  name: 'Lucas',
  avatar: '🦁',
  ageGroup: '7-9',
  currentLevel: 1,
  scoreXP: 140,
  totalStars: 5,
  currentStreak: 0,
  bestStreak: 6,
  totalAnswered: 18,
  totalCorrect: 16,
  totalStudySeconds: 420,
  lastActiveTimestamp: Date.now(),
  stagesProgress: {
    'n1-num-10': {
      stars: 3,
      bestPercentage: 100,
      attempts: 2,
      completed: true,
      masteryLevel: 'dominio_completo',
      lastPlayedAt: Date.now() - 3600000,
    },
    'n1-num-20': {
      stars: 2,
      bestPercentage: 80,
      attempts: 1,
      completed: true,
      masteryLevel: 'bom_dominio',
      lastPlayedAt: Date.now() - 1800000,
    },
  },
  topicsStats: {
    'numeros_0_10': {
      topicKey: 'numeros_0_10',
      label: 'Números de 0 a 10',
      category: 'Números',
      presented: 10,
      correct: 10,
      errors: 0,
      percentage: 100,
      needsReinforcement: false,
    },
  },
  history: [],
  unlockedAchievements: ['first_win', 'streak_5'],
};

export function loadProfiles(): ChildProfile[] {
  if (typeof window === 'undefined') return [DEFAULT_PROFILE];
  const stored = localStorage.getItem(PROFILES_KEY);
  if (!stored) {
    saveProfiles([DEFAULT_PROFILE]);
    return [DEFAULT_PROFILE];
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_PROFILE];
  } catch {
    return [DEFAULT_PROFILE];
  }
}

export function saveProfiles(profiles: ChildProfile[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function getActiveProfile(): ChildProfile {
  const profiles = loadProfiles();
  if (typeof window === 'undefined') return profiles[0];
  const activeId = localStorage.getItem(ACTIVE_PROFILE_ID_KEY);
  const found = profiles.find((p) => p.id === activeId);
  return found || profiles[0];
}

export function setActiveProfileId(id: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_PROFILE_ID_KEY, id);
}

export function updateProfile(updated: ChildProfile) {
  const profiles = loadProfiles();
  const index = profiles.findIndex((p) => p.id === updated.id);
  if (index !== -1) {
    profiles[index] = updated;
  } else {
    profiles.push(updated);
  }
  saveProfiles(profiles);
}

export function createNewProfile(name: string, avatar: string, ageGroup: '4-6' | '7-9' | '10+'): ChildProfile {
  const newProfile: ChildProfile = {
    id: `profile_${Date.now()}`,
    name,
    avatar,
    ageGroup,
    currentLevel: 1,
    scoreXP: 0,
    totalStars: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    totalStudySeconds: 0,
    lastActiveTimestamp: Date.now(),
    stagesProgress: {
      'n1-num-10': {
        stars: 0,
        bestPercentage: 0,
        attempts: 0,
        completed: false,
        masteryLevel: 'precisa_treinar',
      },
    },
    topicsStats: {},
    history: [],
    unlockedAchievements: [],
  };

  const profiles = loadProfiles();
  profiles.push(newProfile);
  saveProfiles(profiles);
  setActiveProfileId(newProfile.id);
  return newProfile;
}

export function isStageUnlocked(stageId: string, profile: ChildProfile): boolean {
  const stage = ALL_STAGES.find((s) => s.id === stageId);
  if (!stage) return false;
  if (!stage.prerequisiteId) return true;

  const prereqProgress = profile.stagesProgress[stage.prerequisiteId];
  if (!prereqProgress) return false;

  return prereqProgress.bestPercentage >= 80;
}

export function recordSessionResults(
  profile: ChildProfile,
  session: PerformanceSession,
  stageId?: string
): { updatedProfile: ChildProfile; newAchievements: string[] } {
  const updated = { ...profile };
  updated.totalAnswered += session.totalQuestions;
  updated.totalCorrect += session.correctCount;
  updated.totalStudySeconds += session.durationSeconds;
  updated.lastActiveTimestamp = Date.now();

  const xpEarned = session.correctCount * 15 + Math.round(session.percentage * 0.5);
  updated.scoreXP += xpEarned;

  if (stageId) {
    const existing = updated.stagesProgress[stageId] || {
      stars: 0,
      bestPercentage: 0,
      attempts: 0,
      completed: false,
      masteryLevel: 'precisa_treinar',
    };

    const newBestPercentage = Math.max(existing.bestPercentage, session.percentage);
    let starsEarned = 0;
    if (session.percentage >= 95) starsEarned = 3;
    else if (session.percentage >= 80) starsEarned = 2;
    else if (session.percentage >= 60) starsEarned = 1;

    const newBestStars = Math.max(existing.stars, starsEarned);
    const addedStars = newBestStars - existing.stars;
    if (addedStars > 0) {
      updated.totalStars += addedStars;
    }

    const mastery = calculateMastery(newBestPercentage);

    updated.stagesProgress[stageId] = {
      stars: newBestStars,
      bestPercentage: newBestPercentage,
      attempts: existing.attempts + 1,
      completed: newBestPercentage >= 80,
      masteryLevel: mastery,
      lastPlayedAt: Date.now(),
    };
  }

  updated.history.unshift(session);
  if (updated.history.length > 50) {
    updated.history.pop();
  }

  const newAchievements: string[] = [];
  const hasAch = (id: string) => updated.unlockedAchievements.includes(id);

  if (!hasAch('first_win') && session.correctCount > 0) {
    newAchievements.push('first_win');
    updated.unlockedAchievements.push('first_win');
  }

  updateProfile(updated);
  return { updatedProfile: updated, newAchievements };
}

export type DifficultyLevel =
  | 'facil'
  | 'facil_intermediario'
  | 'intermediario'
  | 'intermediario_dificil'
  | 'dificil';

export type OperationType =
  | 'reconhecimento'
  | 'soma'
  | 'subtracao'
  | 'multiplicacao'
  | 'problema'
  | 'misto';

export type MasteryStatus =
  | 'precisa_treinar' // 0% - 59%
  | 'aprendendo' // 60% - 79%
  | 'bom_dominio' // 80% - 89%
  | 'dominio_completo'; // 90% - 100%

export interface VisualData {
  type: 'dots' | 'blocks' | 'number_line' | 'grouping' | 'objects';
  num1?: number;
  num2?: number;
  operator?: '+' | '-' | '×' | '>';
  tens?: number;
  units?: number;
  objectType?: 'apple' | 'star' | 'balloon' | 'pencil' | 'fish';
  highlightNumber?: number;
  beforeNum?: number;
  afterNum?: number;
}

export interface Question {
  id: string;
  nivel: 1 | 2;
  assunto: string;
  operacao: OperationType;
  dificuldade: DifficultyLevel;
  pergunta: string;
  contexto?: string;
  alternativas: (number | string)[];
  respostaCorreta: number | string;
  explicacao: string;
  visualData?: VisualData;
  vezesApresentada: number;
  acertos: number;
  erros: number;
}

export interface Stage {
  id: string;
  level: 1 | 2;
  order: number;
  title: string;
  subtitle: string;
  category: 'numeros' | 'soma' | 'subtracao' | 'multiplicacao' | 'dezenas' | 'problemas';
  icon: string;
  description: string;
  prerequisiteId?: string;
  targetTopics: string[];
}

export interface StageProgress {
  stars: number; // 0, 1, 2, 3
  bestPercentage: number;
  attempts: number;
  completed: boolean;
  masteryLevel: MasteryStatus;
  lastPlayedAt?: number;
}

export interface TopicStat {
  topicKey: string;
  label: string;
  category: string;
  presented: number;
  correct: number;
  errors: number;
  percentage: number;
  needsReinforcement: boolean;
}

export interface PerformanceSession {
  id: string;
  timestamp: number;
  stageId?: string;
  stageTitle: string;
  mode: 'trilha' | 'treino' | 'desafio' | 'reforco';
  totalQuestions: number;
  correctCount: number;
  percentage: number;
  durationSeconds: number;
  mistakes: {
    questionText: string;
    correctAnswer: string | number;
    userAnswer: string | number;
    topic: string;
  }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'questions' | 'mastery' | 'milestone';
  unlockedAt?: number;
}

export interface ChildProfile {
  id: string;
  name: string;
  avatar: string; // avatar identifier/emoji
  ageGroup: '4-6' | '7-9' | '10+';
  currentLevel: 1 | 2;
  scoreXP: number;
  totalStars: number;
  currentStreak: number;
  bestStreak: number;
  totalAnswered: number;
  totalCorrect: number;
  totalStudySeconds: number;
  lastActiveTimestamp: number;
  stagesProgress: Record<string, StageProgress>;
  topicsStats: Record<string, TopicStat>;
  history: PerformanceSession[];
  unlockedAchievements: string[];
}

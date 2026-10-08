import { Question, DifficultyLevel, OperationType, VisualData } from '../types';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateNumericDistractors(correct: number, count = 3, minBound = 0): number[] {
  const distractors = new Set<number>();
  const potentialOffsets = [-1, 1, -2, 2, -10, 10, -5, 5, 3, -3];

  for (const offset of potentialOffsets) {
    const candidate = correct + offset;
    if (candidate >= minBound && candidate !== correct) {
      distractors.add(candidate);
      if (distractors.size === count) break;
    }
  }

  let tries = 0;
  while (distractors.size < count && tries < 30) {
    tries++;
    const delta = randomInt(1, Math.max(4, Math.floor(correct * 0.3) + 2));
    const candidate = Math.random() > 0.5 ? correct + delta : Math.max(minBound, correct - delta);
    if (candidate !== correct) {
      distractors.add(candidate);
    }
  }

  return Array.from(distractors).slice(0, count);
}

export function generateQuestion(topicKey: string, difficulty: DifficultyLevel = 'facil'): Question {
  const id = `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  if (topicKey === 'numeros_0_10' || topicKey === 'n1-num-10') {
    const subType = randomInt(1, 4);
    if (subType === 1) {
      const num = randomInt(1, 9);
      const correct = num + 1;
      const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 0)]);
      return {
        id,
        nivel: 1,
        assunto: 'Reconhecimento 0 a 10',
        operacao: 'reconhecimento',
        dificuldade: difficulty,
        pergunta: `Qual número vem DEPOIS do ${num}?`,
        alternativas: opts,
        respostaCorreta: correct,
        explicacao: `O número que vem logo depois do ${num} é o ${correct} (${num} → ${correct}).`,
        visualData: {
          type: 'number_line',
          highlightNumber: num,
          afterNum: correct,
        },
        vezesApresentada: 0,
        acertos: 0,
        erros: 0,
      };
    } else if (subType === 2) {
      const num = randomInt(2, 10);
      const correct = num - 1;
      const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 0)]);
      return {
        id,
        nivel: 1,
        assunto: 'Reconhecimento 0 a 10',
        operacao: 'reconhecimento',
        dificuldade: difficulty,
        pergunta: `Qual número vem ANTES do ${num}?`,
        alternativas: opts,
        respostaCorreta: correct,
        explicacao: `O número que vem imediatamente antes do ${num} é o ${correct} (${correct} ← ${num}).`,
        visualData: {
          type: 'number_line',
          highlightNumber: num,
          beforeNum: correct,
        },
        vezesApresentada: 0,
        acertos: 0,
        erros: 0,
      };
    } else if (subType === 3) {
      const n1 = randomInt(1, 6);
      const n2 = randomInt(n1 + 1, 10);
      const correct = Math.max(n1, n2);
      const other = Math.min(n1, n2);
      const third = randomInt(0, 10);
      const validThird = third !== correct && third !== other ? third : (correct > 2 ? correct - 2 : correct + 1);
      const choices = Array.from(new Set([n1, n2, validThird]));
      while (choices.length < 4) {
        const extra = randomInt(0, 10);
        if (!choices.includes(extra)) choices.push(extra);
      }
      return {
        id,
        nivel: 1,
        assunto: 'Reconhecimento 0 a 10',
        operacao: 'reconhecimento',
        dificuldade: difficulty,
        pergunta: `Qual é o MAIOR número entre as opções?`,
        alternativas: shuffle(choices),
        respostaCorreta: Math.max(...choices),
        explicacao: `O número ${Math.max(...choices)} é a maior quantidade entre eles.`,
        visualData: {
          type: 'objects',
          num1: Math.max(...choices),
          objectType: 'star',
        },
        vezesApresentada: 0,
        acertos: 0,
        erros: 0,
      };
    } else {
      const count = randomInt(2, 8);
      const opts = shuffle([count, ...generateNumericDistractors(count, 3, 1)]);
      return {
        id,
        nivel: 1,
        assunto: 'Reconhecimento 0 a 10',
        operacao: 'reconhecimento',
        dificuldade: difficulty,
        pergunta: `Quantas maçãs você vê na tela?`,
        alternativas: opts,
        respostaCorreta: count,
        explicacao: `Contando uma a uma, encontramos exatamente ${count} maçãs!`,
        visualData: {
          type: 'objects',
          num1: count,
          objectType: 'apple',
        },
        vezesApresentada: 0,
        acertos: 0,
        erros: 0,
      };
    }
  }

  if (topicKey === 'numeros_0_20' || topicKey === 'n1-num-20') {
    const isAfter = Math.random() > 0.5;
    const base = randomInt(11, 19);
    const correct = isAfter ? base + 1 : base - 1;
    const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 10)]);
    return {
      id,
      nivel: 1,
      assunto: 'Números 0 a 20',
      operacao: 'reconhecimento',
      dificuldade: difficulty,
      pergunta: isAfter ? `Qual número vem DEPOIS do ${base}?` : `Qual número vem ANTES do ${base}?`,
      alternativas: opts,
      respostaCorreta: correct,
      explicacao: isAfter ? `Depois do ${base} vem o ${correct}.` : `Antes do ${base} vem o ${correct}.`,
      visualData: {
        type: 'number_line',
        highlightNumber: base,
        ...(isAfter ? { afterNum: correct } : { beforeNum: correct }),
      },
      vezesApresentada: 0,
      acertos: 0,
      erros: 0,
    };
  }

  if (topicKey === 'numeros_0_50' || topicKey === 'n1-num-50') {
    const type = randomInt(1, 2);
    if (type === 1) {
      const base = randomInt(21, 48);
      const correct = base + 1;
      const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 20)]);
      return {
        id,
        nivel: 1,
        assunto: 'Números 0 a 50',
        operacao: 'reconhecimento',
        dificuldade: difficulty,
        pergunta: `Qual número completa a sequência: ${base - 1}, ${base}, ___?`,
        alternativas: opts,
        respostaCorreta: correct,
        explicacao: `A sequência de 1 em 1 segue: ${base - 1}, ${base}, ${correct}.`,
        visualData: {
          type: 'number_line',
          highlightNumber: base,
          afterNum: correct,
        },
        vezesApresentada: 0,
        acertos: 0,
        erros: 0,
      };
    } else {
      const nums = [randomInt(20, 30), randomInt(31, 40), randomInt(41, 50)];
      const correct = Math.max(...nums);
      const opts = shuffle([correct, ...nums.filter(n => n !== correct), randomInt(15, 35)]);
      const uniqueOpts = Array.from(new Set(opts)).slice(0, 4);
      while (uniqueOpts.length < 4) uniqueOpts.push(randomInt(20, 50));
      const finalMax = Math.max(...uniqueOpts);
      return {
        id,
        nivel: 1,
        assunto: 'Números 0 a 50',
        operacao: 'reconhecimento',
        dificuldade: difficulty,
        pergunta: `Qual é o MAIOR número?`,
        alternativas: shuffle(uniqueOpts),
        respostaCorreta: finalMax,
        explicacao: `Entre as opções, o número ${finalMax} possui o maior valor.`,
        visualData: {
          type: 'blocks',
          tens: Math.floor(finalMax / 10),
          units: finalMax % 10,
        },
        vezesApresentada: 0,
        acertos: 0,
        erros: 0,
      };
    }
  }

  if (topicKey === 'numeros_0_100' || topicKey === 'n1-num-100') {
    const base = randomInt(50, 98);
    const isAfter = Math.random() > 0.5;
    const correct = isAfter ? base + 1 : base - 1;
    const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 40)]);
    return {
      id,
      nivel: 1,
      assunto: 'Números 0 a 100',
      operacao: 'reconhecimento',
      dificuldade: difficulty,
      pergunta: isAfter ? `Qual número vem DEPOIS do ${base}?` : `Qual número vem ANTES do ${base}?`,
      alternativas: opts,
      respostaCorreta: correct,
      explicacao: isAfter ? `${base} + 1 = ${correct}` : `${base} - 1 = ${correct}`,
      visualData: {
        type: 'blocks',
        tens: Math.floor(correct / 10),
        units: correct % 10,
      },
      vezesApresentada: 0,
      acertos: 0,
      erros: 0,
    };
  }

  if (topicKey === 'soma_unidades_pequenas' || topicKey === 'n1-soma-uni-1') {
    const pairs = [
      [1, 1], [2, 3], [4, 2], [5, 3], [9, 1],
      [3, 2], [2, 4], [3, 3], [4, 1], [5, 2]
    ];
    const [a, b] = pairs[randomInt(0, pairs.length - 1)];
    const correct = a + b;
    const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 1)]);
    return {
      id,
      nivel: 1,
      assunto: 'Soma de Unidades',
      operacao: 'soma',
      dificuldade: difficulty,
      pergunta: `${a} + ${b} = ?`,
      alternativas: opts,
      respostaCorreta: correct,
      explicacao: `Juntando ${a} com ${b}, temos o total de ${correct}.`,
      visualData: {
        type: 'dots',
        num1: a,
        num2: b,
        operator: '+',
      },
      vezesApresentada: 0,
      acertos: 0,
      erros: 0,
    };
  }

  if (topicKey === 'soma_unidades_maiores' || topicKey === 'n1-soma-uni-2') {
    const pairs = [
      [7, 5], [8, 6], [9, 7], [6, 7], [8, 7],
      [7, 8], [9, 6], [8, 8], [9, 8], [7, 6]
    ];
    const [a, b] = pairs[randomInt(0, pairs.length - 1)];
    const correct = a + b;
    const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 10)]);
    return {
      id,
      nivel: 1,
      assunto: 'Soma Gradativa',
      operacao: 'soma',
      dificuldade: difficulty,
      pergunta: `${a} + ${b} = ?`,
      alternativas: opts,
      respostaCorreta: correct,
      explicacao: `${a} + ${b} = ${correct}. Dica: guarde o ${a} na cabeça e conte mais ${b}!`,
      visualData: {
        type: 'dots',
        num1: a,
        num2: b,
        operator: '+',
      },
      vezesApresentada: 0,
      acertos: 0,
      erros: 0,
    };
  }

  if (topicKey === 'soma_dezenas_exatas' || topicKey === 'n1-soma-dez-exatas') {
    const pairs = [
      [10, 10], [20, 10], [30, 20], [40, 10], [50, 30],
      [30, 10], [20, 20], [40, 20], [50, 20], [60, 30]
    ];
    const [a, b] = pairs[randomInt(0, pairs.length - 1)];
    const correct = a + b;
    const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 10)]);
    const tensA = a / 10;
    const tensB = b / 10;
    return {
      id,
      nivel: 1,
      assunto: 'Soma de Dezenas Exatas',
      operacao: 'soma',
      dificuldade: difficulty,
      pergunta: `${a} + ${b} = ?`,
      alternativas: opts,
      respostaCorreta: correct,
      explicacao: `${tensA} dezenas + ${tensB} dezenas = ${tensA + tensB} dezenas (${correct}).`,
      visualData: {
        type: 'blocks',
        tens: (a + b) / 10,
        units: 0,
      },
      vezesApresentada: 0,
      acertos: 0,
      erros: 0,
    };
  }

  if (topicKey === 'soma_dezenas_unidades' || topicKey === 'n1-soma-dez-uni') {
    const pairs = [
      [12, 15], [23, 14], [35, 21], [46, 32], [58, 17],
      [14, 13], [22, 25], [31, 24], [43, 22], [52, 23]
    ];
    const [a, b] = pairs[randomInt(0, pairs.length - 1)];
    const correct = a + b;
    const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 20)]);
    const tens = Math.floor(correct / 10);
    const units = correct % 10;
    return {
      id,
      nivel: 1,
      assunto: 'Dezenas e Unidades',
      operacao: 'soma',
      dificuldade: difficulty,
      pergunta: `${a} + ${b} = ?`,
      alternativas: opts,
      respostaCorreta: correct,
      explicacao: `Some unidades com unidades e dezenas com dezenas: ${a} + ${b} = ${correct} (${tens} dezenas e ${units} unidades).`,
      visualData: {
        type: 'blocks',
        tens,
        units,
      },
      vezesApresentada: 0,
      acertos: 0,
      erros: 0,
    };
  }

  if (topicKey === 'subtracao_unidades' || topicKey === 'n1-sub-uni') {
    const pairs = [
      [5, 2], [8, 3], [10, 4], [9, 5], [7, 3],
      [6, 2], [9, 4], [8, 5], [10, 6], [7, 4]
    ];
    const [a, b] = pairs[randomInt(0, pairs.length - 1)];
    const correct = a - b;
    const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 0)]);
    return {
      id,
      nivel: 1,
      assunto: 'Subtração de Unidades',
      operacao: 'subtracao',
      dificuldade: difficulty,
      pergunta: `${a} - ${b} = ?`,
      alternativas: opts,
      respostaCorreta: correct,
      explicacao: `Tendo ${a} e retirando ${b}, ficamos com ${correct}.`,
      visualData: {
        type: 'dots',
        num1: a,
        num2: b,
        operator: '-',
      },
      vezesApresentada: 0,
      acertos: 0,
      erros: 0,
    };
  }

  if (topicKey === 'subtracao_dezenas_exatas' || topicKey === 'n1-sub-dez-exatas') {
    const pairs = [
      [20, 10], [30, 20], [50, 30], [60, 20], [70, 40],
      [40, 20], [80, 30], [50, 10], [90, 50], [60, 30]
    ];
    const [a, b] = pairs[randomInt(0, pairs.length - 1)];
    const correct = a - b;
    const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 0)]);
    return {
      id,
      nivel: 1,
      assunto: 'Subtração de Dezenas',
      operacao: 'subtracao',
      dificuldade: difficulty,
      pergunta: `${a} - ${b} = ?`,
      alternativas: opts,
      respostaCorreta: correct,
      explicacao: `${a / 10} dezenas tirando ${b / 10} dezenas = ${correct / 10} dezenas (${correct}).`,
      visualData: {
        type: 'blocks',
        tens: correct / 10,
        units: 0,
      },
      vezesApresentada: 0,
      acertos: 0,
      erros: 0,
    };
  }

  if (topicKey === 'subtracao_dezenas_unidades' || topicKey === 'n1-sub-dez-uni') {
    const pairs = [
      [25, 12], [43, 21], [56, 34], [38, 15], [47, 23],
      [68, 35], [59, 24], [76, 42], [34, 12], [49, 27]
    ];
    const [a, b] = pairs[randomInt(0, pairs.length - 1)];
    const correct = a - b;
    const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 0)]);
    return {
      id,
      nivel: 1,
      assunto: 'Subtração com Dezenas e Unidades',
      operacao: 'subtracao',
      dificuldade: difficulty,
      pergunta: `${a} - ${b} = ?`,
      alternativas: opts,
      respostaCorreta: correct,
      explicacao: `Subtraia unidade de unidade e dezena de dezena: ${a} - ${b} = ${correct}.`,
      visualData: {
        type: 'blocks',
        tens: Math.floor(correct / 10),
        units: correct % 10,
      },
      vezesApresentada: 0,
      acertos: 0,
      erros: 0,
    };
  }

  for (let tab = 1; tab <= 10; tab++) {
    if (topicKey === `tabuada_${tab}` || topicKey === `n1-mult-${tab}`) {
      const multiplier = randomInt(1, 10);
      const correct = multiplier * tab;
      const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 0)]);
      let expl = `${multiplier} × ${tab} = ${correct}.`;
      if (tab === 1) {
        expl = `Qualquer número multiplicado por 1 continua ele mesmo: ${multiplier} × 1 = ${multiplier}.`;
      } else if (tab === 2) {
        expl = `Multiplicar por 2 é calcular o dobro: ${multiplier} + ${multiplier} = ${correct}.`;
      } else if (tab === 10) {
        expl = `Multiplicar por 10 é fácil: basta colocar o 0 ao final do ${multiplier} → ${correct}!`;
      } else {
        expl = `${multiplier} grupos de ${tab} é igual a ${correct}.`;
      }

      return {
        id,
        nivel: 1,
        assunto: `Tabuada do ${tab}`,
        operacao: 'multiplicacao',
        dificuldade: difficulty,
        pergunta: `${multiplier} × ${tab} = ?`,
        alternativas: opts,
        respostaCorreta: correct,
        explicacao: expl,
        visualData: {
          type: 'grouping',
          num1: multiplier,
          num2: tab,
        },
        vezesApresentada: 0,
        acertos: 0,
        erros: 0,
      };
    }
  }

  if (topicKey === 'dezenas_avancadas' || topicKey === 'n2-dezenas-avancadas') {
    const isSum = Math.random() > 0.5;
    if (isSum) {
      const sums = [[10, 20], [30, 40], [50, 20], [40, 50], [60, 30], [20, 70]];
      const [a, b] = sums[randomInt(0, sums.length - 1)];
      const correct = a + b;
      const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 10)]);
      return {
        id,
        nivel: 2,
        assunto: 'Dezenas Avançadas',
        operacao: 'soma',
        dificuldade: difficulty,
        pergunta: `${a} + ${b} = ?`,
        alternativas: opts,
        respostaCorreta: correct,
        explicacao: `${a} + ${b} = ${correct} (${a / 10 + b / 10} dezenas).`,
        visualData: {
          type: 'blocks',
          tens: correct / 10,
          units: 0,
        },
        vezesApresentada: 0,
        acertos: 0,
        erros: 0,
      };
    } else {
      const subs = [[70, 30], [90, 40], [80, 50], [60, 20], [90, 30], [70, 50]];
      const [a, b] = subs[randomInt(0, subs.length - 1)];
      const correct = a - b;
      const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 0)]);
      return {
        id,
        nivel: 2,
        assunto: 'Dezenas Avançadas',
        operacao: 'subtracao',
        dificuldade: difficulty,
        pergunta: `${a} - ${b} = ?`,
        alternativas: opts,
        respostaCorreta: correct,
        explicacao: `${a} - ${b} = ${correct} (${(a - b) / 10} dezenas).`,
        visualData: {
          type: 'blocks',
          tens: correct / 10,
          units: 0,
        },
        vezesApresentada: 0,
        acertos: 0,
        erros: 0,
      };
    }
  }

  if (topicKey === 'dezenas_unidades_mistas' || topicKey === 'n2-dezenas-com-reagrupamento') {
    const isSum = Math.random() > 0.5;
    if (isSum) {
      const sums = [[23, 15], [42, 27], [34, 25], [51, 36], [48, 24]];
      const [a, b] = sums[randomInt(0, sums.length - 1)];
      const correct = a + b;
      const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 20)]);
      return {
        id,
        nivel: 2,
        assunto: 'Dezenas e Unidades Mistas',
        operacao: 'soma',
        dificuldade: difficulty,
        pergunta: `${a} + ${b} = ?`,
        alternativas: opts,
        respostaCorreta: correct,
        explicacao: `${a} + ${b} = ${correct}. (${Math.floor(correct / 10)} dezenas e ${correct % 10} unidades).`,
        visualData: {
          type: 'blocks',
          tens: Math.floor(correct / 10),
          units: correct % 10,
        },
        vezesApresentada: 0,
        acertos: 0,
        erros: 0,
      };
    } else {
      const subs = [[56, 23], [71, 35], [64, 31], [85, 42], [73, 28]];
      const [a, b] = subs[randomInt(0, subs.length - 1)];
      const correct = a - b;
      const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 0)]);
      return {
        id,
        nivel: 2,
        assunto: 'Dezenas e Unidades Mistas',
        operacao: 'subtracao',
        dificuldade: difficulty,
        pergunta: `${a} - ${b} = ?`,
        alternativas: opts,
        respostaCorreta: correct,
        explicacao: `${a} - ${b} = ${correct}.`,
        visualData: {
          type: 'blocks',
          tens: Math.floor(correct / 10),
          units: correct % 10,
        },
        vezesApresentada: 0,
        acertos: 0,
        erros: 0,
      };
    }
  }

  if (topicKey === 'multiplicacao_mista_1' || topicKey === 'n2-mult-mista-1') {
    const list = [
      [12, 2], [15, 3], [21, 4], [23, 5],
      [32, 2], [45, 3], [14, 2], [22, 3]
    ];
    const [a, b] = list[randomInt(0, list.length - 1)];
    const correct = a * b;
    const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 10)]);
    return {
      id,
      nivel: 2,
      assunto: 'Multiplicação Mista (Grau 1)',
      operacao: 'multiplicacao',
      dificuldade: difficulty,
      pergunta: `${a} × ${b} = ?`,
      alternativas: opts,
      respostaCorreta: correct,
      explicacao: `${a} × ${b} = ${correct}.`,
      visualData: {
        type: 'grouping',
        num1: b,
        num2: a,
      },
      vezesApresentada: 0,
      acertos: 0,
      erros: 0,
    };
  }

  if (topicKey === 'multiplicacao_mista_2' || topicKey === 'n2-mult-mista-2') {
    const list = [
      [12, 5], [23, 4], [34, 6], [45, 7],
      [52, 8], [63, 9], [75, 10], [25, 4], [18, 5]
    ];
    const [a, b] = list[randomInt(0, list.length - 1)];
    const correct = a * b;
    const opts = shuffle([correct, ...generateNumericDistractors(correct, 3, 20)]);
    return {
      id,
      nivel: 2,
      assunto: 'Multiplicação Mista Avançada',
      operacao: 'multiplicacao',
      dificuldade: difficulty,
      pergunta: `${a} × ${b} = ?`,
      alternativas: opts,
      respostaCorreta: correct,
      explicacao: `${a} × ${b} = ${correct}.`,
      visualData: {
        type: 'grouping',
        num1: b,
        num2: a,
      },
      vezesApresentada: 0,
      acertos: 0,
      erros: 0,
    };
  }

  if (topicKey === 'problemas_contexto' || topicKey === 'n2-problemas-matematicos') {
    const problems = [
      {
        pergunta: 'João tem 4 caixas. Cada caixa possui 12 lápis. Quantos lápis João possui no total?',
        correct: 48,
        expl: '4 caixas × 12 lápis = 48 lápis no total!',
        obj: 'pencil' as const,
        n1: 4,
        n2: 12
      },
      {
        pergunta: 'Mariana tem 3 pacotes de figurinhas com 15 figurinhas em cada. Quantas figurinhas ela tem?',
        correct: 45,
        expl: '3 pacotes × 15 figurinhas = 45 figurinhas.',
        obj: 'star' as const,
        n1: 3,
        n2: 15
      },
      {
        pergunta: 'Uma confeitaria fez 5 fornadas com 8 bolinhos em cada uma. Quantos bolinhos foram feitos?',
        correct: 40,
        expl: '5 fornadas × 8 bolinhos = 40 bolinhos deliciosos!',
        obj: 'apple' as const,
        n1: 5,
        n2: 8
      },
      {
        pergunta: 'Em um aquário há 6 sacos com 10 peixinhos em cada. Quantos peixinhos há no total?',
        correct: 60,
        expl: '6 × 10 = 60 peixinhos nadando!',
        obj: 'fish' as const,
        n1: 6,
        n2: 10
      }
    ];

    const item = problems[randomInt(0, problems.length - 1)];
    const opts = shuffle([item.correct, ...generateNumericDistractors(item.correct, 3, 5)]);
    return {
      id,
      nivel: 2,
      assunto: 'Problemas Matemáticos',
      operacao: 'problema',
      dificuldade: difficulty,
      pergunta: item.pergunta,
      alternativas: opts,
      respostaCorreta: item.correct,
      explicacao: item.expl,
      visualData: {
        type: 'objects',
        num1: item.n1,
        num2: item.n2,
        objectType: item.obj,
      },
      vezesApresentada: 0,
      acertos: 0,
      erros: 0,
    };
  }

  const a = randomInt(1, 5);
  const b = randomInt(1, 5);
  const correct = a + b;
  return {
    id,
    nivel: 1,
    assunto: 'Soma Simples',
    operacao: 'soma',
    dificuldade: difficulty,
    pergunta: `${a} + ${b} = ?`,
    alternativas: shuffle([correct, ...generateNumericDistractors(correct, 3, 1)]),
    respostaCorreta: correct,
    explicacao: `${a} + ${b} = ${correct}`,
    visualData: {
      type: 'dots',
      num1: a,
      num2: b,
      operator: '+',
    },
    vezesApresentada: 0,
    acertos: 0,
    erros: 0,
  };
}

export function generateQuestionRound(targetTopic: string, count: number = 10, difficulty: DifficultyLevel = 'facil'): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    questions.push(generateQuestion(targetTopic, difficulty));
  }
  return questions;
}

export function generateChallengeRound(unlockedTopicKeys: string[], count: number = 10): Question[] {
  const topics = unlockedTopicKeys.length > 0 ? unlockedTopicKeys : ['soma_unidades_pequenas', 'numeros_0_10'];
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    const chosenTopic = topics[randomInt(0, topics.length - 1)];
    questions.push(generateQuestion(chosenTopic, 'intermediario'));
  }
  return questions;
}

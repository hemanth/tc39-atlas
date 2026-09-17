import { NoulResult, ChoiceResult, ScoreResult, Proposal } from '../types';

// Pure Functional Evaluators mimicking TypeSafe System One (Jev)

export const evaluateNoul = (
  state: Partial<Proposal>,
  condition: string
): NoulResult => {
  const text = `${state.name || ''} ${state.description || ''} ${(state.tags || []).join(' ')} ${state.semantic?.tags?.join(' ') || ''}`.toLowerCase();
  const q = condition.toLowerCase();

  // Extract key concept words
  const words = q
    .replace(/[?.,!]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['is', 'the', 'does', 'this', 'that', 'for', 'with', 'help', 'make'].includes(w));

  if (words.length === 0) {
    return { tag: 'Noul', probability: 0.5, isMatch: false };
  }

  let matches = 0;
  for (const word of words) {
    if (text.includes(word)) {
      matches += 1;
    } else {
      // Check partial/stem match
      const stem = word.slice(0, Math.max(4, word.length - 2));
      if (text.includes(stem)) {
        matches += 0.6;
      }
    }
  }

  // Domain context boost
  if (q.includes('immutable') && text.includes('record')) matches += 0.8;
  if (q.includes('async') && (text.includes('promise') || text.includes('await'))) matches += 0.8;
  if (q.includes('security') && (text.includes('private') || text.includes('realm'))) matches += 0.8;
  if (q.includes('performance') && (text.includes('buffer') || text.includes('memory'))) matches += 0.8;

  // Calibrated probability sigmoid
  const rawRatio = matches / Math.max(1, words.length);
  const prob = Math.min(0.99, Math.max(0.02, Number((1 / (1 + Math.exp(-4 * (rawRatio - 0.45)))).toFixed(3))));

  return {
    tag: 'Noul',
    probability: prob,
    isMatch: prob >= 0.65,
  };
};

export const evaluateChoice = <T extends string>(
  state: Partial<Proposal>,
  _instructions: string,
  options: readonly T[]
): ChoiceResult<T> => {
  const text = `${state.name || ''} ${state.description || ''} ${(state.tags || []).join(' ')}`.toLowerCase();

  // Compute probability distribution
  const rawScores: Record<string, number> = {};
  for (const opt of options) {
    const optClean = opt.toLowerCase().replace(/_/g, ' ');
    const optKeywords = optClean.split(' ');
    let score = 0.1;

    for (const kw of optKeywords) {
      if (text.includes(kw)) score += 1.2;
    }
    rawScores[opt] = score;
  }

  // Softmax normalization
  const sum = Object.values(rawScores).reduce((a, b) => a + b, 0);
  const distribution: Record<string, number> = {};
  let bestOpt = options[0];
  let maxProb = -1;

  for (const opt of options) {
    const prob = Number((rawScores[opt] / sum).toFixed(3));
    distribution[opt] = prob;
    if (prob > maxProb) {
      maxProb = prob;
      bestOpt = opt;
    }
  }

  return {
    tag: 'Choice',
    selection: bestOpt,
    distribution: distribution as Record<T, number>,
    confidence: Number(maxProb.toFixed(2)),
  };
};

export const evaluateScore = <T extends string>(
  state: Partial<Proposal>,
  _instructions: string,
  levels: readonly T[]
): ScoreResult<T> => {
  const text = `${state.name || ''} ${state.description || ''}`.toLowerCase();
  let baseScore = 2.0;

  if (/record|tuple|shadowrealm|compartment|atomics|memory|buffer|asynccontext/i.test(text)) {
    baseScore = 3.7;
  } else if (/private|scope|operator|pattern matching|decorator|module block/i.test(text)) {
    baseScore = 2.8;
  } else if (/helper|method|is\b|has\b|at\b|find|math\.|object\.|promise\.try/i.test(text)) {
    baseScore = 1.2;
  }

  const clampedScore = Math.min(levels.length, Math.max(1.0, baseScore));
  const levelIndex = Math.min(levels.length - 1, Math.max(0, Math.round(clampedScore) - 1));

  const distribution: Record<string, number> = {};
  levels.forEach((lvl, idx) => {
    const dist = Math.abs(idx - (clampedScore - 1));
    distribution[lvl] = Number(Math.exp(-dist).toFixed(3));
  });

  const sum = Object.values(distribution).reduce((a, b) => a + b, 0);
  for (const lvl of levels) {
    distribution[lvl] = Number((distribution[lvl] / sum).toFixed(3));
  }

  return {
    tag: 'Score',
    score: Number(clampedScore.toFixed(2)),
    level: levels[levelIndex],
    distribution: distribution as Record<T, number>,
  };
};

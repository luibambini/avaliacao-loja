export const ratingFields = [
  'avaliacaoGeral',
  'qualidadeServico',
  'simpatiaEquipe',
  'tempoResposta',
  'avaliacaoLoja'
];

export function createEmptyEvaluation() {
  return {
    vendedora: null,
    comoConheceu: null,
    avaliacaoGeral: null,
    qualidadeServico: null,
    simpatiaEquipe: null,
    tempoResposta: null,
    avaliacaoLoja: null,
    comentarios: '',
    observacoes: ''
  };
}

export function hasAllRatings(evaluation) {
  if (!evaluation || typeof evaluation !== 'object') {
    return false;
  }

  return ratingFields.every(key => {
    const value = evaluation[key];
    return typeof value === 'number' && Number.isFinite(value) && value >= 1;
  });
}

const MIN_DELAY_MS = 5000;
const MIN_INTERVAL_MS = 2000;

function sanitizeImages(list) {
  if (!Array.isArray(list)) {
    return [];
  }

  return list
    .map(item => (typeof item === 'string' ? item.trim() : ''))
    .filter(item => item.length > 0);
}

function normalizeNumber(value, minimum) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return minimum;
  }

  return Math.max(Math.round(value), minimum);
}

export function normalizeScreensaverConfig(config, defaults = {}) {
  const fallbackImages = sanitizeImages(defaults.images);
  const fallbackDelay = normalizeNumber(defaults.delayMs ?? defaults.delaySeconds * 1000, MIN_DELAY_MS);
  const fallbackInterval = normalizeNumber(defaults.intervalMs ?? defaults.intervalSeconds * 1000, MIN_INTERVAL_MS);

  const result = {
    images: fallbackImages.length > 0 ? fallbackImages : [],
    delayMs: fallbackDelay,
    intervalMs: fallbackInterval
  };

  if (!config || typeof config !== 'object') {
    return result;
  }

  const configImages = sanitizeImages(config.images);
  if (configImages.length > 0) {
    result.images = configImages;
  }

  if (typeof config.delaySeconds === 'number') {
    const delayMs = normalizeNumber(config.delaySeconds * 1000, MIN_DELAY_MS);
    result.delayMs = delayMs;
  }

  if (typeof config.intervalSeconds === 'number') {
    const intervalMs = normalizeNumber(config.intervalSeconds * 1000, MIN_INTERVAL_MS);
    result.intervalMs = intervalMs;
  }

  return result;
}

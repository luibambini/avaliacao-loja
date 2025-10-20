import { describe, it, expect } from 'vitest';
import {
  createEmptyEvaluation,
  hasAllRatings,
  ratingFields,
  normalizeScreensaverConfig
} from '../core.js';

describe('createEmptyEvaluation', () => {
  it('produz um objeto com avaliações vazias', () => {
    const evaluation = createEmptyEvaluation();

    ratingFields.forEach(field => {
      expect(evaluation[field]).toBeNull();
    });

    expect(evaluation.vendedora).toBeNull();
    expect(evaluation.comoConheceu).toBeNull();
    expect(evaluation.comentarios).toBe('');
    expect(evaluation.observacoes).toBe('');
  });
});

describe('hasAllRatings', () => {
  it('retorna false quando a avaliação está ausente', () => {
    expect(hasAllRatings(null)).toBe(false);
    expect(hasAllRatings(undefined)).toBe(false);
  });

  it('retorna false quando algum campo está vazio ou abaixo de 1', () => {
    const evaluation = createEmptyEvaluation();
    evaluation.avaliacaoGeral = 5;
    evaluation.qualidadeServico = 4;
    evaluation.simpatiaEquipe = 0;
    evaluation.tempoResposta = 3;
    evaluation.avaliacaoLoja = 5;

    expect(hasAllRatings(evaluation)).toBe(false);
  });

  it('retorna true somente quando todos os campos possuem notas válidas', () => {
    const evaluation = createEmptyEvaluation();
    ratingFields.forEach(field => {
      evaluation[field] = 4;
    });

    expect(hasAllRatings(evaluation)).toBe(true);
  });
});

describe('normalizeScreensaverConfig', () => {
  it('usa valores válidos do manifesto e respeita mínimos', () => {
    const defaults = {
      images: ['Default.png'],
      delayMs: 90000,
      intervalMs: 8000
    };

    const config = {
      images: [' imagem1.jpg ', '', 'imagem2.png'],
      delaySeconds: 2, // abaixo do mínimo, deve virar 5000
      intervalSeconds: 1 // abaixo do mínimo, deve virar 2000
    };

    const normalized = normalizeScreensaverConfig(config, defaults);

    expect(normalized.images).toEqual(['imagem1.jpg', 'imagem2.png']);
    expect(normalized.delayMs).toBe(5000);
    expect(normalized.intervalMs).toBe(2000);
  });

  it('mantém os padrões quando o manifesto é inválido', () => {
    const defaults = {
      images: ['Default1.png', 'Default2.png'],
      delayMs: 7500,
      intervalMs: 2500
    };

    const normalized = normalizeScreensaverConfig(null, defaults);

    expect(normalized.images).toEqual(['Default1.png', 'Default2.png']);
    expect(normalized.delayMs).toBe(7500);
    expect(normalized.intervalMs).toBe(2500);
  });
});

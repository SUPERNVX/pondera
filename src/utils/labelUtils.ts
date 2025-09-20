import type { TFunction } from 'i18next';

/**
 * Returns the translated label for a grading system.
 * @param system The grading system key.
 * @param t The i18n translation function.
 * @returns The translated label.
 */
export const getSystemLabel = (system: 'trimestral' | 'semestral' | 'annual', t: TFunction): string => {
  switch (system) {
    case 'trimestral': return t('trimestral_system');
    case 'semestral': return t('semestral_system');
    case 'annual': return t('annual_system');
    default: return t('trimestral_system'); // Fallback
  }
};

/**
 * Returns the translated label for a grade scale.
 * @param scale The grade scale key.
 * @param t The i18n translation function.
 * @returns The translated label.
 */
export const getScaleLabel = (scale: '0-10' | '0-100' | 'A-F' | 'conceitos', t: TFunction): string => {
  switch (scale) {
    case '0-10': return t('scale_0_10');
    case '0-100': return t('scale_0_100');
    case 'A-F': return t('scale_a_f');
    case 'conceitos': return t('scale_concepts');
    default: return t('scale_0_10'); // Fallback
  }
};

/**
 * Returns the translated label for a subject type.
 * @param type The subject type key.
 * @param t The i18n translation function.
 * @returns The translated label.
 */
export const getTypeLabel = (type: string, t: TFunction): string => {
  switch (type) {
    case 'core': return t('core_subject');
    case 'elective': return t('elective_subject');
    default: return type; // Fallback
  }
};

/**
 * Returns the translated label for a subject level.
 * @param level The subject level key.
 * @param t The i18n translation function.
 * @returns The translated label.
 */
export const getLevelLabel = (level: string, t: TFunction): string => {
  switch (level) {
    case 'regular': return t('regular_level');
    case 'honors': return t('honors_level');
    case 'ap': return t('ap_level');
    default: return level; // Fallback
  }
};
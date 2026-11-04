import { afterEach, describe, expect, it } from 'vitest'
import { i18n, locales } from './i18n.svelte'
import {
  COMMON_MEDICATIONS,
  DOSAGE_UNITS,
  STOCK_UNITS,
  APPOINTMENT_TYPES,
  ADMINISTRATION_METHODS,
  getFrequenciesForMethod,
} from './constants'
import { resources } from './resources-data'
import { catalogLabel, localizedResources, searchLocalizedResources } from './catalog-labels'

afterEach(() => i18n.setLocale('fr'))

describe('localized catalogs', () => {
  it('resolves Brazilian medication, dosage, stock and frequency labels', () => {
    i18n.setLocale('pt-BR')
    expect(catalogLabel('commonNames', 'Spironolactone')).toBe('Espironolactona')
    expect(catalogLabel('dosageUnits', 'pressions')).toBe('acionamentos')
    expect(catalogLabel('stockUnits', 'comprimés')).toBe('comprimidos')
    expect(catalogLabel('frequencies', '1x/jour (soir)')).toBe('1 vez/dia (à noite)')
  })

  it('preserves user-defined names, units and frequencies verbatim', () => {
    i18n.setLocale('pt-BR')
    for (const value of [
      'Minha fórmula 1.5',
      'unidade.custom',
      'a cada 9 dias',
      '',
      'toString',
      '__proto__',
    ]) {
      expect(catalogLabel('commonNames', value)).toBe(value)
      expect(catalogLabel('dosageUnits', value)).toBe(value)
      expect(catalogLabel('frequencies', value)).toBe(value)
    }
  })

  it.each(locales)('covers every selectable catalog entry in %s', (locale) => {
    i18n.setLocale(locale)
    const catalogs = {
      commonNames: COMMON_MEDICATIONS.map((m) => m.name),
      dosageUnits: DOSAGE_UNITS,
      stockUnits: STOCK_UNITS,
      frequencies: [
        ...new Set([
          ...COMMON_MEDICATIONS.map((m) => m.frequency),
          ...Object.keys(ADMINISTRATION_METHODS).flatMap((method) =>
            getFrequenciesForMethod(method as keyof typeof ADMINISTRATION_METHODS)
          ),
        ]),
      ],
    }
    for (const [group, values] of Object.entries(catalogs)) {
      const labels = i18n.raw<Record<string, string>>(`medications.${group}`)
      for (const value of values)
        expect(labels?.[value], `${locale}: ${group}/${value}`).toBeTruthy()
    }
    for (const type of Object.keys(APPOINTMENT_TYPES)) {
      expect(i18n.t(`appointments.types.${type}`)).not.toContain('appointments.types.')
    }
    const tags = i18n.raw<Record<string, string>>('resources.tags')
    for (const tag of resources.flatMap((r) => r.tags)) expect(tags?.[tag]).toBeTruthy()
  })

  it('switches display language without changing canonical medication data', () => {
    const before = JSON.stringify(COMMON_MEDICATIONS)
    i18n.setLocale('en')
    expect(catalogLabel('commonNames', 'Spironolactone')).toBe('Spironolactone')
    i18n.setLocale('de')
    expect(catalogLabel('commonNames', 'Spironolactone')).toBe('Spironolacton')
    i18n.setLocale('fr')
    expect(catalogLabel('commonNames', 'Spironolactone')).toBe('Spironolactone')
    expect(JSON.stringify(COMMON_MEDICATIONS)).toBe(before)
  })

  it('searches translated names, descriptions and tags without changing resource metadata', () => {
    const before = JSON.stringify(resources)
    i18n.setLocale('pt-BR')
    const localized = localizedResources()
    expect(localized.find((r) => r.id === 'partagenre')?.tags).toContain('comunidade')
    expect(searchLocalizedResources('EStrogênios', localized).map((r) => r.id)).toContain(
      'ths-feminisant'
    )
    expect(searchLocalizedResources('trajetórias', localized).map((r) => r.id)).toContain(
      'wiki-trans'
    )
    expect(searchLocalizedResources('Direitos no trabalho', localized).map((r) => r.id)).toContain(
      'droits-travail'
    )
    for (const [index, resource] of localized.entries()) {
      const original = resources[index]!
      expect(resource).toMatchObject({
        id: original.id,
        url: original.url,
        category: original.category,
        language: original.language,
        isFree: original.isFree,
        isOnline: original.isOnline,
      })
    }
    expect(JSON.stringify(resources)).toBe(before)
    i18n.setLocale('en')
    expect(searchLocalizedResources('research', localizedResources()).map((r) => r.id)).toContain(
      'transfemscience'
    )
  })
})

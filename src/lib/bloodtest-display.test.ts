import { describe, expect, it } from 'vitest'
import { displayMeasurement, formatMeasurement, formatLabNumber } from './bloodtest-display'
import { BLOOD_MARKERS, REFERENCE_RANGES, convertToCanonicalUnit } from './constants'

describe('Brazilian lab presentation', () => {
  it('converts testosterone values and both reference bounds together', () => {
    const display = displayMeasurement('testosterone', 0.29, 'ng/mL', 'pt-BR')
    expect(display.value).toBe(29)
    expect(displayMeasurement('testosterone', 4.1, 'ng/mL', 'pt-BR').value).toBe(410)
    expect(display.unit).toBe('ng/dL')
    expect(formatMeasurement('testosterone', 0.29, 'ng/mL', 'pt-BR')).toBe('29 ng/dL')
    const range = REFERENCE_RANGES.find(
      (r) => r.marker === 'testosterone' && r.context === 'feminizing'
    )!
    expect(formatMeasurement(range.marker, range.min, range.unit, 'pt-BR')).toBe('15 ng/dL')
    expect(formatMeasurement(range.marker, range.max, range.unit, 'pt-BR')).toBe('50 ng/dL')
  })
  it('uses equivalent Brazilian units for prolactin, progesterone, LH and FSH', () => {
    expect(formatMeasurement('prolactin', 12.5, 'µg/L', 'pt-BR')).toBe('12,5 ng/mL')
    expect(formatMeasurement('progesterone', 1.5, 'µg/L', 'pt-BR')).toBe('1,5 ng/mL')
    for (const marker of ['lh', 'fsh'] as const) {
      expect(formatMeasurement(marker, 2.5, 'UI/L', 'pt-BR')).toBe('2,5 mUI/mL')
    }
  })
  it('does not convert an already displayed or unrecognized unit again', () => {
    expect(formatMeasurement('testosterone', 50, 'ng/dL', 'pt-BR')).toBe('50 ng/dL')
    expect(formatMeasurement('testosterone', 5, 'custom', 'pt-BR')).toBe('5 custom')
    expect(formatMeasurement('hematocrit', 52, '%', 'pt-BR')).toBe('52 %')
    expect(formatLabNumber(1.25, 'pt-BR')).toBe('1,25')
  })
  it('preserves original units and numbers in FR, EN and DE', () => {
    for (const locale of ['fr', 'en', 'de'] as const) {
      expect(formatMeasurement('testosterone', 0.5, 'ng/mL', locale)).toBe('0.5 ng/mL')
    }
  })
  it('round trips Brazilian testosterone input using the existing canonical converter', () => {
    for (const value of [0, 0.15, 0.29, 0.5, 4, 7, 10]) {
      const display = displayMeasurement(
        'testosterone',
        value,
        BLOOD_MARKERS.testosterone.unit,
        'pt-BR'
      )
      expect(convertToCanonicalUnit('testosterone', display.value, display.unit)).toBeCloseTo(
        value,
        12
      )
    }
    expect(BLOOD_MARKERS.testosterone.unit).toBe('ng/mL')
  })
})

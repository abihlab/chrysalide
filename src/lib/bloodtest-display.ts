import type { BloodMarker } from './types'
import type { Locale } from './i18n.svelte'

/** Presentation only. No changes to canonical storage, reference ranges or alert logic. */
export function displayMeasurement(
  marker: BloodMarker,
  value: number,
  unit: string,
  locale: Locale
) {
  if (locale === 'pt-BR') {
    if (marker === 'testosterone' && unit === 'ng/mL') {
      // Shift the decimal exponent instead of multiplying the binary float:
      // 0.29 ng/mL must prefill an editable 29, not 28.999999999999996.
      const [mantissa, exponent = '0'] = String(value).split('e')
      const converted = Number.isFinite(value)
        ? Number(`${mantissa}e${Number(exponent) + 2}`)
        : value
      return { value: converted, unit: 'ng/dL' }
    }
    // 1 µg/L = 1 ng/mL; 1 UI/L = 1 mUI/mL. Only the notation changes.
    if ((marker === 'prolactin' || marker === 'progesterone') && unit === 'µg/L') {
      return { value, unit: 'ng/mL' }
    }
    if ((marker === 'lh' || marker === 'fsh') && unit === 'UI/L') return { value, unit: 'mUI/mL' }
  }
  return { value, unit }
}

export function formatLabNumber(value: number, locale: Locale): string {
  return locale === 'pt-BR'
    ? new Intl.NumberFormat('pt-BR', { useGrouping: false, maximumSignificantDigits: 15 }).format(
        value
      )
    : String(value)
}

export function formatMeasurement(
  marker: BloodMarker,
  value: number,
  unit: string,
  locale: Locale
): string {
  const display = displayMeasurement(marker, value, unit, locale)
  return `${formatLabNumber(display.value, locale)} ${display.unit}`
}

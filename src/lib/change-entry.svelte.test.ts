import { afterEach, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/svelte'
import { i18n } from './i18n.svelte'
import ChangeEntry from './components/medications/ChangeEntry.svelte'

afterEach(() => {
  cleanup()
  i18n.setLocale('fr')
})

it('localizes medication and frequency change labels without changing the historical values', () => {
  i18n.setLocale('pt-BR')
  const change = {
    medicationId: 1,
    medicationName: 'Spironolactone',
    changeType: 'frequency_change' as const,
    date: new Date(),
    createdAt: new Date(),
    oldValue: '1x/jour',
    newValue: '2x/jour',
  }
  render(ChangeEntry, { change })
  expect(screen.getByText('Espironolactona')).toBeInTheDocument()
  expect(screen.getByText('1 vez/dia')).toBeInTheDocument()
  expect(screen.getByText('2 vezes/dia')).toBeInTheDocument()
  expect(change.oldValue).toBe('1x/jour')
  expect(change.newValue).toBe('2x/jour')
})

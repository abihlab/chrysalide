import { test, expect } from '@playwright/test'
import { skipOnboarding } from './helpers'

test.beforeEach(async ({ page }) => {
  await skipOnboarding(page)
  await page.addInitScript(() => localStorage.setItem('chrysalide-locale', 'pt-BR'))
})

test('localizes presets while persisting canonical medication values through editing', async ({
  page,
}) => {
  await page.goto('/medications/new', { waitUntil: 'networkidle' })
  const presets = page.locator('.card select').first()
  await presets.selectOption({ label: 'Progesterona micronizada' })
  await expect(page.locator('#name')).toHaveValue('Progesterona micronizada')
  await expect(page.locator('#dosage')).toHaveValue('200')
  await expect(page.locator('#frequency')).toHaveValue('1x/jour (soir)')
  await expect(page.locator('#frequency option:checked')).toHaveText('1 vez/dia (à noite)')
  await presets.selectOption('Œstrogel')
  await expect(page.locator('#unit option:checked')).toHaveText('acionamentos')
  await expect(page.locator('#unit')).toHaveValue('pressions')
  await page.locator('#stock').fill('20')
  await page.locator('#stockUnit').selectOption({ label: 'frascos' })
  await page.getByRole('button', { name: 'Salvar', exact: true }).click()
  await expect(page).toHaveURL('/medications')
  const readMedication = () =>
    page.evaluate(
      () =>
        new Promise<Record<string, unknown>>((resolve, reject) => {
          const request = indexedDB.open('ChrysalideDB')
          request.onerror = () => reject(request.error)
          request.onsuccess = () => {
            const database = request.result
            const tx = database.transaction('medications', 'readonly')
            const read = tx.objectStore('medications').getAll()
            read.onsuccess = () => resolve(read.result[0])
            tx.oncomplete = () => database.close()
          }
        })
    )
  const saved = await readMedication()
  expect(saved).toMatchObject({
    name: 'Œstrogel',
    dosage: 2,
    unit: 'pressions',
    frequency: '1x/jour',
    stock: 20,
    stockUnit: 'flacons',
  })
  await page.goto(`/medications/${saved.id}/edit`, { waitUntil: 'networkidle' })
  await expect(page.locator('#unit')).toHaveValue('pressions')
  await expect(page.locator('#stockUnit')).toHaveValue('flacons')
  await page.getByRole('button', { name: 'Salvar', exact: true }).click()
  await expect(page).toHaveURL(`/medications/${saved.id}`)
  expect(await readMedication()).toMatchObject({
    name: 'Œstrogel',
    dosage: 2,
    unit: 'pressions',
    frequency: '1x/jour',
    stockUnit: 'flacons',
  })
})

test('finds resources by Brazilian descriptions and tags and shows their actual language', async ({
  page,
}) => {
  await page.goto('/resources', { waitUntil: 'networkidle' })
  const search = page.getByPlaceholder('Pesquisar recursos...')
  await search.fill('estrogênios')
  await expect(
    page.getByRole('heading', { name: 'Guia de terapia hormonal feminilizante', exact: true })
  ).toBeVisible()
  await expect(page.locator('.resource-card .lang-badge')).toHaveText('FR')
  await search.fill('trajetórias')
  await expect(page.getByRole('heading', { name: 'Wiki Trans', exact: true })).toBeVisible()
})

test('shows Brazilian practitioner labels with unchanged specialty identifiers', async ({
  page,
}) => {
  await page.goto('/practitioners/new', { waitUntil: 'networkidle' })
  await page.locator('#specialty').selectOption({ label: 'Fonoaudióloga(o)' })
  await expect(page.locator('#specialty')).toHaveValue('speechtherapist')
  await expect(page.locator('#specialty option[value="laboratoire"]')).toHaveText('Laboratório')
  await expect(page.locator('#specialty option[value="tattoo"]')).toHaveText('Tatuador(a)')
})

test('converts Brazilian lab display and input while keeping canonical values through editing and language switches', async ({
  page,
}) => {
  await page.goto('/bloodtests/new', { waitUntil: 'networkidle' })
  const unit = page.locator('#testosterone').locator('..').locator('select')
  await expect(unit).toHaveValue('ng/dL')
  await page.locator('#testosterone').fill('29')
  await page.locator('#prolactin').fill('12.5')
  await expect(page.locator('label[for="prolactin"]')).toContainText('ng/mL')
  await page.getByRole('button', { name: 'Salvar', exact: true }).click()
  await expect(page).toHaveURL('/bloodtests')
  await expect(page.locator('.legend').filter({ hasText: 'Testosterona' })).toContainText(
    '29 ng/dL'
  )
  await expect(page.locator('.legend').filter({ hasText: 'Prolactina' })).toContainText(
    '12,5 ng/mL'
  )
  const readTest = () =>
    page.evaluate(
      () =>
        new Promise<{ id: number; results: { marker: string; value: number; unit: string }[] }>(
          (resolve, reject) => {
            const request = indexedDB.open('ChrysalideDB')
            request.onerror = () => reject(request.error)
            request.onsuccess = () => {
              const database = request.result
              const tx = database.transaction('bloodTests', 'readonly')
              const read = tx.objectStore('bloodTests').getAll()
              read.onsuccess = () => resolve(read.result[0])
              tx.oncomplete = () => database.close()
            }
          }
        )
    )
  const saved = await readTest()
  expect(saved.results).toContainEqual({ marker: 'testosterone', value: 0.29, unit: 'ng/mL' })
  expect(saved.results).toContainEqual({ marker: 'prolactin', value: 12.5, unit: 'µg/L' })
  await page.goto(`/bloodtests/${saved.id}`, { waitUntil: 'networkidle' })
  await expect(page.locator('.result-line').filter({ hasText: 'Testosterona' })).toContainText(
    '29 ng/dL'
  )
  await expect(page.locator('.result-line').filter({ hasText: 'Testosterona' })).toContainText(
    '15 - 50 ng/dL'
  )
  await page.goto(`/bloodtests/${saved.id}/edit`, { waitUntil: 'networkidle' })
  await expect(unit).toHaveValue('ng/dL')
  await expect(page.locator('#testosterone')).toHaveValue('29')
  await page.getByRole('button', { name: 'Salvar', exact: true }).click()
  await expect(page).toHaveURL(`/bloodtests/${saved.id}`)
  expect((await readTest()).results).toEqual(saved.results)
  await page.goto('/settings', { waitUntil: 'networkidle' })
  await page
    .locator('select')
    .filter({ has: page.locator('option[value="pt-BR"]') })
    .selectOption('en')
  await page.locator('a[href="/bloodtests"]:visible').first().click()
  await expect(page.locator('.legend').filter({ hasText: 'Testosterone' })).toContainText(
    '0.29 ng/mL'
  )
  await page.locator('.tabs button').last().click()
  await page.locator(`a[href="/bloodtests/${saved.id}"]`).click()
  await expect(page.locator('.result-line').filter({ hasText: 'Testosterone' })).toContainText(
    '0.29 ng/mL'
  )
  expect((await readTest()).results).toEqual(saved.results)
})

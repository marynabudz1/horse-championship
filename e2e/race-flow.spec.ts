import { test, expect } from '@playwright/test'

/** Waits for the first round to complete by watching results populate */
async function waitForRoundComplete(page: import('@playwright/test').Page) {
  await expect(page.locator('text=No results yet.').first()).not.toBeVisible({ timeout: 15_000 })
}

test.describe('Race flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Generate Program populates the schedule', async ({ page }) => {
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()

    await expect(page.locator('text=1ST Lap - 1200m').first()).toBeVisible()
    await expect(page.locator('text=6TH Lap - 2200m').first()).toBeVisible()
  })

  test('START button is disabled before generating a program', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'START' })).toBeDisabled()
  })

  test('START button is enabled after generating a program', async ({ page }) => {
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()
    await expect(page.getByRole('button', { name: 'START' })).toBeEnabled()
  })

  test('Clicking START changes button to PAUSE', async ({ page }) => {
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()
    await page.getByRole('button', { name: 'START' }).click()
    await expect(page.getByRole('button', { name: 'PAUSE' })).toBeVisible()
  })

  test('Clicking PAUSE freezes the race and shows START again', async ({ page }) => {
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()
    await page.getByRole('button', { name: 'START' }).click()
    await page.getByRole('button', { name: 'PAUSE' }).click()
    await expect(page.getByRole('button', { name: 'START' })).toBeVisible()
  })

  test('First round completes and results appear', async ({ page }) => {
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()
    await page.getByRole('button', { name: 'START' }).click()
    await waitForRoundComplete(page)
  })

  test('Results show position 1 after first round', async ({ page }) => {
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()
    await page.getByRole('button', { name: 'START' }).click()
    await waitForRoundComplete(page)

    await expect(page.locator('text=Pos').first()).toBeVisible()
  })

  test('After round completes START is available for next round', async ({ page }) => {
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()
    await page.getByRole('button', { name: 'START' }).click()
    await waitForRoundComplete(page)

    await expect(page.getByRole('button', { name: 'START' })).toBeEnabled({ timeout: 5_000 })
  })

  test('Completing all 6 rounds disables START button', async ({ page }) => {
    test.setTimeout(90_000)

    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()

    for (let round = 0; round < 6; round++) {
      await page.getByRole('button', { name: 'START' }).click()
      await page.waitForFunction(() => {
        const buttons    = Array.from(document.querySelectorAll('button'))
        const startBtn   = buttons.find((b) => b.textContent?.trim() === 'START')
        return startBtn !== undefined
      }, { timeout: 20_000 })
    }

    await expect(page.getByRole('button', { name: 'START' })).toBeDisabled()
  })

  test('Generating a new program resets the race', async ({ page }) => {
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()
    await page.getByRole('button', { name: 'START' }).click()
    await waitForRoundComplete(page)

    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()
    await expect(page.locator('text=No results yet.').first()).toBeVisible()
  })
})

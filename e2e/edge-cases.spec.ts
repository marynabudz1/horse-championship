import { test, expect } from '@playwright/test'

test.describe('Edge cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Generating a program while a race is running stops it cleanly', async ({ page }) => {
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()
    await page.getByRole('button', { name: 'START' }).click()

    // Race is now running — generate a new program mid-race
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()

    // UI should recover: START is enabled (new schedule), no results shown
    await expect(page.getByRole('button', { name: 'START' })).toBeEnabled()
    await expect(page.locator('text=No results yet.').first()).toBeVisible()
  })

  test('Rapid START → PAUSE → START does not break the race', async ({ page }) => {
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()

    await page.getByRole('button', { name: 'START' }).click()
    await page.getByRole('button', { name: 'PAUSE' }).click()
    await page.getByRole('button', { name: 'START' }).click()

    // Race should resume and eventually complete
    await expect(page.locator('text=No results yet.').first()).not.toBeVisible({ timeout: 15_000 })
  })

  test('Refreshing mid-race resets status to Idle but keeps the schedule', async ({ page }) => {
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()
    await page.getByRole('button', { name: 'START' }).click()

    // Refresh before the round ends
    await page.reload()

    // Schedule should still be there, START should be available (Idle status)
    await expect(page.locator('text=1ST Lap - 1200m').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'START' })).toBeEnabled()
  })

  test('START button label is exactly START or PAUSE — never anything else', async ({ page }) => {
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()

    const btn = page.getByRole('button', { name: /^(START|PAUSE)$/ })
    await expect(btn).toBeVisible()

    await btn.click()
    await expect(page.getByRole('button', { name: 'PAUSE' })).toBeVisible()

    await page.getByRole('button', { name: 'PAUSE' }).click()
    await expect(page.getByRole('button', { name: 'START' })).toBeVisible()
  })

  test('Program always has exactly 6 rounds after generating', async ({ page }) => {
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()

    const roundLabels = ['1ST Lap', '2ND Lap', '3RD Lap', '4TH Lap', '5TH Lap', '6TH Lap']
    for (const label of roundLabels) {
      await expect(page.locator(`text=${label}`).first()).toBeVisible()
    }
  })
})

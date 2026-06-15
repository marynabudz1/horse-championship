import { test, expect } from '@playwright/test'

test.describe('LocalStorage persistence', () => {
  test('Schedule survives a page refresh', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()

    await expect(page.locator('text=1ST Lap - 1200m').first()).toBeVisible()

    await page.reload()

    await expect(page.locator('text=1ST Lap - 1200m').first()).toBeVisible()
    await expect(page.locator('text=6ST Lap - 2200m').first()).toBeVisible()
  })

  test('Completed round results survive a page refresh', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()
    await page.getByRole('button', { name: 'START' }).click()

    await expect(page.locator('text=No results yet.').first()).not.toBeVisible({ timeout: 15_000 })

    await page.reload()

    await expect(page.locator('text=No results yet.').first()).not.toBeVisible({ timeout: 5_000 })
  })

  test('Generating a new program clears persisted results', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()
    await page.getByRole('button', { name: 'START' }).click()
    await expect(page.locator('text=No results yet.').first()).not.toBeVisible({ timeout: 15_000 })

    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()
    await page.reload()

    await expect(page.locator('text=No results yet.').first()).toBeVisible()
  })
})

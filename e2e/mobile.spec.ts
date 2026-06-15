import { test, expect, type Page } from '@playwright/test'

/**
 * Both the desktop layout (hidden via CSS) and the mobile layout are present
 * in the DOM at the same time. On an iPhone 13 viewport (390px) the desktop
 * panel has `display:none` while the mobile panel is visible.
 *
 * Because the desktop panel comes first in the DOM, `.first()` returns the
 * hidden element. We use `.last()` to target the visible mobile element, or
 * we assert `.not.toBeVisible()` on the first occurrence when needed.
 */
function mobileVisible(page: Page, text: string) {
  return page.locator(`text=${text}`).last()
}

test.describe('Mobile layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Shows tab navigation bar on mobile', async ({ page }) => {
    await expect(page.getByRole('button', { name: '🐎 Horses'  })).toBeVisible()
    await expect(page.getByRole('button', { name: '🏁 Track'   })).toBeVisible()
    await expect(page.getByRole('button', { name: '📋 Program' })).toBeVisible()
    await expect(page.getByRole('button', { name: '🏆 Results' })).toBeVisible()
  })

  test('Track tab is active by default and shows race track', async ({ page }) => {
    await expect(mobileVisible(page, 'No race scheduled')).toBeVisible()
  })

  test('Horses tab shows the horse list', async ({ page }) => {
    await page.getByRole('button', { name: '🐎 Horses' }).click()
    await expect(mobileVisible(page, 'Horse List')).toBeVisible()
    await expect(mobileVisible(page, 'Cond.')).toBeVisible()
  })

  test('Program tab shows the program panel', async ({ page }) => {
    await page.getByRole('button', { name: '📋 Program' }).click()
    await expect(mobileVisible(page, 'No program generated yet.')).toBeVisible()
  })

  test('Results tab shows the results panel', async ({ page }) => {
    await page.getByRole('button', { name: '🏆 Results' }).click()
    await expect(mobileVisible(page, 'No results yet.')).toBeVisible()
  })

  test('Program tab shows schedule after generating', async ({ page }) => {
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()
    await page.getByRole('button', { name: '📋 Program' }).click()

    await expect(mobileVisible(page, '1ST Lap - 1200m')).toBeVisible()
    await expect(mobileVisible(page, '6TH Lap - 2200m')).toBeVisible()
  })

  test('After a round completes it auto-navigates to Results tab', async ({ page }) => {
    await page.getByRole('button', { name: 'GENERATE PROGRAM' }).click()
    await page.getByRole('button', { name: 'START' }).click()

    // App auto-switches to Results tab — mobile "No results yet." (last in DOM) disappears
    await expect(mobileVisible(page, 'No results yet.')).not.toBeVisible({ timeout: 15_000 })
    await expect(mobileVisible(page, 'Pos')).toBeVisible()
  })
})

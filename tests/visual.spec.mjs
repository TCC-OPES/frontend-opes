import { test, expect } from '@playwright/test'

const routes = ['/','/login','/cadastro','/dashboard','/transacoes','/cartoes','/metas','/investimento','/recorrencias','/calendario','/perfil']
const viewports = [
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-360', width: 360, height: 740 },
  { name: 'desktop', width: 1440, height: 900 },
]

for (const viewport of viewports) {
  test.describe(viewport.name, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })
    for (const route of routes) {
      test(`responsive ${route}`, async ({ page }) => {
        await page.goto('http://127.0.0.1:5173' + route, { waitUntil: 'domcontentloaded' })
        await expect(page.locator('#app')).toBeVisible()
        await expect.poll(() => page.evaluate(() => {
          const body = document.body
          const root = document.documentElement
          return Math.max(body.scrollWidth, root.scrollWidth) <= window.innerWidth + 2
        })).toBeTruthy()
        const background = await page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor)
        expect(background).toBe('rgb(242, 239, 234)')
        await page.screenshot({ path: `test-results/${viewport.name}-${route.replaceAll('/', '-') || 'home'}.png`, fullPage: true })
      })
    }
  })
}

test('desktop sidebar permanece visível ao rolar', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('http://127.0.0.1:5173/recorrencias', { waitUntil: 'domcontentloaded' })
  const sidebar = page.locator('.sidebar-container').last()
  await expect(sidebar).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect.poll(() => sidebar.evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(0)
})

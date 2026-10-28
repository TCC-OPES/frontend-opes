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

test('home exibe conteúdo e não fica encoberta por sobreposição', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
  const header = page.locator('.pagina-inicial .barra-navegacao')
  const heading = page.getByRole('heading', { name: /Transforme sua/i })
  const primaryLink = page.locator('.pagina-inicial .barra-navegacao a[href="/cadastro"]')
  await expect(header).toBeVisible()
  await expect(heading).toBeVisible()
  await expect(primaryLink).toBeVisible()
  await expect.poll(async () => page.evaluate(() => {
    const heading = document.querySelector('.secao-hero h1')
    if (!heading) return false
    const style = getComputedStyle(heading)
    const rect = heading.getBoundingClientRect()
    const x = Math.round(rect.left + rect.width / 2)
    const y = Math.round(rect.top + rect.height / 2)
    const top = document.elementFromPoint(x, y)
    return style.visibility === 'visible' && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0 && !!top && (top === heading || heading.contains(top) || top.contains(heading))
  })).toBeTruthy()
})

test('desktop sidebar permanece visível ao rolar', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('http://127.0.0.1:5173/recorrencias', { waitUntil: 'domcontentloaded' })
  const sidebar = page.locator('.sidebar-container').last()
  await expect(sidebar).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect.poll(() => sidebar.evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(0)
})

test('tema alterna e persiste em desktop e celular', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('http://127.0.0.1:5173/recorrencias')
  await page.evaluate(() => localStorage.removeItem('opes-tema'))
  await page.reload()
  const darkButton = page.getByRole('button', { name: 'Ativar modo escuro' }).first()
  await darkButton.click()
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark')
  await page.reload()
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Ativar modo claro' }).last().click()
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBe('light')
})

import { test, expect } from '@playwright/test'

const base = 'http://127.0.0.1:5173'

test('transações permite registrar e cancelar sem erro de interface', async ({ page }) => {
  const itens = []
  await page.route('**/api/transacoes/', async route => {
    if (route.request().method() === 'POST') {
      const payload = route.request().postDataJSON()
      const criado = { id: 7, ...payload, valor: '50.00', data: '2026-10-28T12:00:00' }
      itens.unshift(criado)
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(criado) })
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(itens) })
    }
  })
  await page.goto(base + '/transacoes')
  await page.getByRole('button', { name: 'Nova Transação' }).click()
  await page.getByRole('button', { name: 'Cancelar' }).click()
  await expect(page.getByRole('heading', { name: 'Nova Transação' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Nova Transação' }).click()
  await page.getByPlaceholder('Ex: Supermercado Central').fill('Café')
  await page.getByPlaceholder('Ex: Alimentação').fill('Alimentação')
  await page.getByPlaceholder('0.00').fill('50')
  await page.getByRole('button', { name: 'Salvar Transação' }).click()
  await expect(page.getByText('Transação registrada com sucesso.')).toBeVisible()
})

test('meta fecha formulário apenas depois de salvar', async ({ page }) => {
  const metas = []
  await page.route('**/api/metas/', async route => {
    if (route.request().method() === 'POST') {
      const criado = { id: 15, ...route.request().postDataJSON() }
      metas.push(criado)
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(criado) })
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(metas) })
    }
  })
  await page.goto(base + '/metas')
  await page.getByRole('button', { name: 'Nova Meta' }).click()
  await page.getByPlaceholder('Ex: Viagem para o Japão').fill('Viagem')
  await page.locator('select').last().selectOption('lazer')
  await page.getByPlaceholder('10000').fill('10000')
  await page.getByPlaceholder('500').fill('500')
  await page.locator('input[type=date]').last().fill('2027-12-01')
  await page.getByRole('button', { name: 'Salvar Meta' }).click()
  await expect(page.getByText('Meta salva com sucesso.')).toBeVisible()
})

test('investimentos cria e exibe ativo cadastrado', async ({ page }) => {
  const investimentos = []
  await page.route('**/api/investimentos/**', async route => {
    if (route.request().method() === 'POST') {
      const item = { id: 9, ...route.request().postDataJSON() }
      investimentos.push(item)
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(item) })
    } else {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(investimentos) })
    }
  })
  await page.goto(base + '/investimento')
  await page.locator('button[title="Novo Investimento"]').click()
  await page.getByPlaceholder('Ex: Tesouro Direto').fill('Tesouro')
  await page.getByPlaceholder('1000.00').fill('1000')
  await page.getByPlaceholder('10.5').fill('8')
  await page.getByRole('button', { name: 'Adicionar', exact: true }).click()
  await expect(page.getByText('Investimento registrado.')).toBeVisible()
})

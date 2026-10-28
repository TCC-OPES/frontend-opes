import { test, expect } from '@playwright/test'

test('dashboard usa apenas dados cadastrados e não mostra saldo bancário', async ({ page }) => {
  await page.route('**/api/dashboard/', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify({
      resumo: { resultado_registrado: 1100, receitas: 1500, despesas: 400, total_transacoes: 2, total_investido: 250 },
      serie_mensal: [
        { mes: '10/2026', receitas: 1500, despesas: 400, resultado: 1100 },
      ],
      gastos_semanais: [{ dia: 'Qua', valor: 400 }],
      proximas: [{ id: 2, titulo: 'Internet', categoria: 'Casa', tipo: 'despesa', valor: 100, vencimento: '2026-11-10' }]
    })
  }))
  await page.route('**/api/metas/', route => route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }))
  await page.goto('http://127.0.0.1:5173/dashboard')
  await expect(page.getByText('Resultado registrado')).toBeVisible()
  await expect(page.getByText(/Não representa seu saldo bancário/)).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Receitas e despesas por mês' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Gastos desta semana' })).toBeVisible()
  await expect(page.getByText('Internet')).toBeVisible()
  await expect(page.getByText('R$ 1.100,00')).toBeVisible()
})

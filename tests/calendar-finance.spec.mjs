import { test, expect } from '@playwright/test'

test('calendário separa conta prevista de transação registrada', async ({ page }) => {
  const hoje = new Date()
  const dia = [hoje.getFullYear(), String(hoje.getMonth() + 1).padStart(2, '0'), '10'].join('-')
  await page.route('**/api/transacoes/', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify([{ id: 12, titulo: 'Internet paga fora do OPES', categoria: 'Moradia', tipo: 'despesa', valor: '200.00', data: dia + 'T12:00:00' }])
  }))
  await page.route('**/api/recorrencias/ocorrencias/**', route => route.fulfill({
    status: 200, contentType: 'application/json',
    body: JSON.stringify([{ id: 2, recorrencia: 3, titulo: 'Internet', categoria: 'Moradia', tipo: 'despesa', valor: '200.00', vencimento: dia, status: 'pendente', confirmada_em: null }])
  }))
  await page.goto('http://127.0.0.1:5173/calendario')
  await expect(page.getByText('Despesas previstas')).toBeVisible()
  await expect(page.getByText('Lançamentos registrados')).toBeVisible()
  await expect(page.getByText('Internet paga fora do OPES')).toBeVisible()
  await expect(page.getByText('Confirmar pagamento')).toHaveCount(0)
})

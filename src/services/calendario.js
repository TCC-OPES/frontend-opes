import api from '@/services/api'
export const carregarCalendario = async (inicio, fim) => {
  const [transacoes, ocorrencias] = await Promise.all([
    api.get('/api/transacoes/'),
    api.get('/api/recorrencias/ocorrencias/', { params: { inicio, fim } }),
  ])
  const lista = data => Array.isArray(data) ? data : (data.results || [])
  const realizados = lista(transacoes.data).filter(t => t.data?.slice(0, 10) >= inicio && t.data?.slice(0, 10) <= fim)
  const agendados = lista(ocorrencias.data)
  const confirmados = new Set(agendados.map(o => o.transacao).filter(Boolean).map(String))
  return [...realizados.filter(t => !confirmados.has(String(t.id))), ...agendados]
}
export const confirmarVencimento = id => api.post('/api/recorrencias/ocorrencias/' + id + '/confirmar/')

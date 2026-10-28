import api from '@/services/api'

const lista = data => Array.isArray(data) ? data : (data.results || [])

export async function carregarDadosSimulador(inicio, fim) {
  const [transacoes, ocorrencias, metas] = await Promise.all([
    api.get('/api/transacoes/'),
    api.get('/api/recorrencias/ocorrencias/', { params: { inicio, fim } }),
    api.get('/api/metas/'),
  ])
  return {
    transacoes: lista(transacoes.data),
    ocorrencias: lista(ocorrencias.data),
    metas: lista(metas.data),
  }
}

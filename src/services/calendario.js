import api from '@/services/api'

// Evita alterar o fuso horário ao montar a data de um compromisso mensal.
export function dataMensal(ano, mes, dia) {
  const ultimo = new Date(ano, mes, 0).getDate()
  return `${ano}-${String(mes).padStart(2, '0')}-${String(Math.min(dia, ultimo)).padStart(2, '0')}`
}

export function eventosCartoes(cartoes, inicio, fim) {
  const [ano, mes] = inicio.slice(0, 7).split('-').map(Number)
  const eventos = []
  for (const cartao of cartoes) {
    // Aceita tanto o formato brasileiro quanto o formato ISO da API.
    const vencimento = String(cartao.vencimento || '')
    const diaVencimento = vencimento.includes('/')
      ? Number(vencimento.split('/')[0])
      : Number(vencimento.slice(8, 10))
    const nome = cartao.nome || 'Cartão'
    const criar = (tipo, dia, titulo) => {
      const data = dataMensal(ano, mes, dia)
      if (data < inicio || data > fim) return
      eventos.push({
        id: `cartao-${cartao.id}-${tipo}-${data}`,
        cartao_id: cartao.id,
        evento_cartao: tipo,
        titulo: `${titulo}: ${nome}`,
        categoria: 'Cartão de crédito',
        tipo: 'aviso',
        valor: null,
        vencimento: data,
        status: 'Programado',
      })
    }
    if (diaVencimento >= 1 && diaVencimento <= 31) criar('vencimento', diaVencimento, 'Vencimento')
    const fechamento = Number(cartao.dia_fechamento)
    if (Number.isInteger(fechamento) && fechamento >= 1 && fechamento <= 31) {
      criar('fechamento', fechamento, 'Fechamento da fatura')
    }
  }
  return eventos
}

export const carregarCalendario = async (inicio, fim) => {
  const [transacoes, ocorrencias, cartoes] = await Promise.all([
    api.get('/api/transacoes/'),
    api.get('/api/recorrencias/ocorrencias/', { params: { inicio, fim } }),
    api.get('/api/cartoes/'),
  ])
  const lista = data => Array.isArray(data) ? data : (data.results || [])
  const realizados = lista(transacoes.data).filter(t => t.data?.slice(0, 10) >= inicio && t.data?.slice(0, 10) <= fim)
  const agendados = lista(ocorrencias.data)
  const confirmados = new Set(agendados.map(o => o.transacao).filter(Boolean).map(String))
  return [...realizados.filter(t => !confirmados.has(String(t.id))), ...agendados, ...eventosCartoes(lista(cartoes.data), inicio, fim)]
}

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useTransacoesStore = defineStore('transacoes', () => {
  const transacoes = ref([])          // Lista exibida na tabela (filtrada)
  const transacoesGeral = ref([])     // Lista completa para manter os cards do topo fixos
  const carregando = ref(false)

  // O resumo agora calcula com base na lista COMPLETA, garantindo que o topo não mude/suma
  const resumo = computed(() => {
    let totalReceitas = 0
    let totalDespesas = 0

    transacoesGeral.value.forEach(t => {
      const valor = Number(t.valor) || 0
      if (t.tipo === 'receita') {
        totalReceitas += valor
      } else if (t.tipo === 'despesa') {
        totalDespesas += valor
      }
    })

    return {
      totalTransacoes: transacoesGeral.value.length,
      totalReceitas,
      totalDespesas
    }
  })

  // Busca as transações do backend
  async function buscarTransacoes(tipoFiltro = 'todas') {
    carregando.value = true
    try {
      // 1. Sempre busca a lista completa na primeira carga ou para atualizar o topo
      const responseGeral = await api.get('/api/transacoes/')
      const dadosCompletos = Array.isArray(responseGeral.data) ? responseGeral.data : (responseGeral.data.results || [])
      transacoesGeral.value = dadosCompletos

      // 2. Aplica o filtro visual na lista de baixo
      if (tipoFiltro && tipoFiltro !== 'todas') {
        transacoes.value = dadosCompletos.filter(t => t.tipo === tipoFiltro)
      } else {
        transacoes.value = dadosCompletos
      }

    } catch (error) {
      console.error('Erro ao buscar transações do backend:', error)
    } finally {
      carregando.value = false
    }
  }

  // Cria uma nova transação e atualiza ambas as listas
  async function criarTransacao(novaTransacaoData) {
    try {
      const response = await api.post('/api/transacoes/', novaTransacaoData)
      transacoesGeral.value.unshift(response.data)
      transacoes.value.unshift(response.data)
      return true
    } catch (error) {
      console.error('Erro ao criar transação:', error)
      alert('Erro ao salvar a transação. Verifique os campos.')
      return false
    }
  }

  // Exportar transações visíveis para CSV
  function exportarTransacoes() {
    if (transacoes.value.length === 0) {
      alert('Não há transações para exportar.')
      return
    }

    let csvContent = 'data:text/csv;charset=utf-8,ID;Titulo;Categoria;Tipo;Valor;Data\n'
    transacoes.value.forEach(t => {
      const linha = [t.id, `"${t.titulo}"`, `"${t.categoria}"`, t.tipo, t.valor, t.data].join(';')
      csvContent += linha + '\n'
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'transacoes.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    transacoes,
    resumo,
    carregando,
    buscarTransacoes,
    criarTransacao,
    exportarTransacoes
  }
})

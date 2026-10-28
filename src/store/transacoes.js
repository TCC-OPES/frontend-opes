import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { notify } from '@/services/toast'

export const useTransacoesStore = defineStore('transacoes', () => {
  const transacoes = ref([])
  const transacoesGeral = ref([])
  const carregando = ref(false)

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

  async function buscarTransacoes(tipoFiltro = 'todas') {
    carregando.value = true
    try {

      const responseGeral = await api.get('/api/transacoes/')
      const dadosCompletos = Array.isArray(responseGeral.data) ? responseGeral.data : (responseGeral.data.results || [])
      transacoesGeral.value = dadosCompletos

      if (tipoFiltro && tipoFiltro !== 'todas') {
        transacoes.value = dadosCompletos.filter(t => t.tipo === tipoFiltro)
      } else {
        transacoes.value = dadosCompletos
      }

    } catch (error) {
      notify.error('Não foi possível carregar suas transações.')
    } finally {
      carregando.value = false
    }
  }

  async function criarTransacao(novaTransacaoData) {
    try {
      const response = await api.post('/api/transacoes/', novaTransacaoData)
      await buscarTransacoes()
      notify.success('Transação registrada com sucesso.')
      return true
    } catch (error) {
      notify.error('Erro ao salvar a transação. Verifique os campos.')
      return false
    }
  }

  async function editarTransacao(id, dados) {
    try {
      await api.patch(`/api/transacoes/${id}/`, dados)
      await buscarTransacoes()
      notify.success('Transação atualizada com sucesso.')
      return true
    } catch {
      notify.error('Não foi possível atualizar a transação.')
      return false
    }
  }

  async function excluirTransacao(id) {
    try {
      await api.delete(`/api/transacoes/${id}/`)
      transacoesGeral.value = transacoesGeral.value.filter(item => item.id !== id)
      transacoes.value = transacoes.value.filter(item => item.id !== id)
      notify.success('Transação excluída com sucesso.')
      return true
    } catch {
      notify.error('Não foi possível excluir a transação.')
      return false
    }
  }

  function exportarTransacoes() {
    if (transacoes.value.length === 0) {
      notify.warning('Não há transações para exportar.')
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
    editarTransacao,
    excluirTransacao,
    exportarTransacoes
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useMetasStore = defineStore('metas', () => {
  const metas = ref([])
  const carregando = ref(false)

  // Busca as metas cadastradas do usuário logado no backend
  async function carregarMetas() {
    carregando.value = true
    try {
      const response = await api.get('api/metas/')
      metas.value = response.data
    } catch (error) {
      console.error('Erro ao buscar metas:', error)
    } finally {
      carregando.value = false
    }
  }

  // Envia uma nova meta para salvar no backend
  async function adicionarMeta(dadosMeta) {
    try {
      const response = await api.post('api/metas/', dadosMeta)
      metas.value.push(response.data)
      return response.data
    } catch (error) {
      console.error('Erro ao adicionar meta:', error)
      throw error
    }
  }

  // Cálculos dinâmicos dos indicadores superiores
  const totalMetas = computed(() => metas.value.length)
  const valorTotalGeral = computed(() => metas.value.reduce((acc, m) => acc + Number(m.valorTotal || m.valor_total || 0), 0))
  const valorEconomizadoGeral = computed(() => metas.value.reduce((acc, m) => acc + Number(m.valorAtual || m.valor_atual || 0), 0))
  const progressoGeral = computed(() => {
    if (valorTotalGeral.value === 0) return 0
    return ((valorEconomizadoGeral.value / valorTotalGeral.value) * 100).toFixed(1)
  })

  return {
    metas,
    carregando,
    totalMetas,
    valorTotalGeral,
    valorEconomizadoGeral,
    progressoGeral,
    carregarMetas,
    adicionarMeta,
  }
})
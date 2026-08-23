import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useMetasStore = defineStore('metas', () => {
  const metas = ref([])
  const carregando = ref(false)

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

  async function editarMeta(id, dadosMeta) {
    try {
      const response = await api.put(`api/metas/${id}/`, dadosMeta)
      const index = metas.value.findIndex(m => m.id === id)
      if (index !== -1) {
        metas.value[index] = response.data
      }
      return response.data
    } catch (error) {
      console.error('Erro ao editar meta:', error)
      throw error
    }
  }

  async function deletarMeta(id) {
    try {
      await api.delete(`api/metas/${id}/`)
      metas.value = metas.value.filter(m => m.id !== id)
    } catch (error) {
      console.error('Erro ao deletar meta:', error)
      throw error
    }
  }

  const totalMetas = computed(() => metas.value.length)

  const valorTotalGeral = computed(() =>
    metas.value.reduce((acc, m) => acc + Number(m.valor_objetivo || 0), 0)
  )

  const valorEconomizadoGeral = computed(() =>
    metas.value.reduce((acc, m) => acc + Number(m.valor_atual || 0), 0)
  )

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
    editarMeta,
    deletarMeta
  }
})

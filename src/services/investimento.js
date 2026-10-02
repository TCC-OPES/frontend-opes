import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from './api' // <-- Aponta para o api.js na mesma pasta

export const useInvestimentosStore = defineStore('investimentos', () => {
  const investimentos = ref([])
  const carregando = ref(false)
  const erro = ref('')

  async function carregarInvestimentos() {
    carregando.value = true
    erro.value = ''
    try {
      const response = await api.get('api/investimentos/')
      investimentos.value = response.data
      return response.data
    } catch (err) {
      erro.value = err.response?.data?.message || 'Erro ao carregar investimentos.'
      throw err
    } finally {
      carregando.value = false
    }
  }

  async function criarInvestimento(payload) {
    carregando.value = true
    erro.value = ''
    try {
      const response = await api.post('api/investimentos/', payload)
      investimentos.value.push(response.data)
      return response.data
    } catch (err) {
      erro.value = err.response?.data?.message || 'Erro ao criar investimento.'
      throw err
    } finally {
      carregando.value = false
    }
  }

  async function deletarInvestimento(id) {
    carregando.value = true
    erro.value = ''
    try {
      await api.delete(`api/investimentos/${id}/`)
      investimentos.value = investimentos.value.filter(item => item.id !== id)
    } catch (err) {
      erro.value = err.response?.data?.message || 'Erro ao deletar investimento.'
      throw err
    } finally {
      carregando.value = false
    }
  }

  return {
    investimentos,
    carregando,
    erro,
    carregarInvestimentos,
    criarInvestimento,
    deletarInvestimento
  }
})
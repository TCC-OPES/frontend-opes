import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useCartoesStore = defineStore('cartoes', () => {
  // Estado
  const cartoes = ref([])
  const carregando = ref(false)
  const erro = ref('')

  // Helper para obter o cabeçalho de autenticação
  function getAuthHeader() {
    const token = localStorage.getItem('token') || localStorage.getItem('access')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Getters (Computeds)
  const totalLimite = computed(() => {
    return cartoes.value.reduce((acc, card) => acc + (Number(card.limite) || 0), 0)
  })

  const totalUtilizado = computed(() => {
    return cartoes.value.reduce((acc, card) => acc + (Number(card.valor_utilizado) || 0), 0)
  })

  const totalDisponivel = computed(() => {
    return totalLimite.value - totalUtilizado.value
  })

  // Ações
  async function carregarCartoes() {
    carregando.value = true
    erro.value = ''
    try {
      const response = await axios.get('/api/cartoes/', {
        headers: getAuthHeader()
      })
      cartoes.value = response.data
    } catch (err) {
      erro.value = err.response?.data?.message || 'Erro ao carregar lista de cartões.'
    } finally {
      carregando.value = false
    }
  }

  async function adicionarCartao(dadosCartao) {
    carregando.value = true
    erro.value = ''

    try {
      const payload = {
        ...dadosCartao,
        limite: parseFloat(dadosCartao.limite)
      }

      const response = await axios.post('/api/cartoes/', payload, {
        headers: getAuthHeader()
      })

      const novoCartao = response.data
      cartoes.value.push(novoCartao)
      return novoCartao
    } catch (err) {
      if (err.response?.status === 401) {
        erro.value = 'Sessão expirada ou usuário não autenticado.'
      } else {
        erro.value = err.response?.data?.message || 'Erro ao salvar o cartão no servidor.'
      }
      throw err
    } finally {
      carregando.value = false
    }
  }

  return {
    cartoes,
    carregando,
    erro,
    totalLimite,
    totalUtilizado,
    totalDisponivel,
    carregarCartoes,
    adicionarCartao
  }
})

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useCartoesStore = defineStore('cartoes', () => {
  const cartoes = ref([])
  const carregando = ref(false)
  const erro = ref('')

  function getAuthHeader() {
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('access')

    return token
      ? { Authorization: `Bearer ${token}` }
      : {}
  }

  const totalLimite = computed(() =>
    cartoes.value.reduce(
      (total, cartao) =>
        total + Number(cartao.limite_total || 0),
      0
    )
  )

  const totalUtilizado = computed(() =>
    cartoes.value.reduce(
      (total, cartao) =>
        total + Number(cartao.valor_utilizado || 0),
      0
    )
  )

  const totalDisponivel = computed(
    () => totalLimite.value - totalUtilizado.value
  )

  function obterMensagemErro(err, padrao) {
    if (err.response?.status === 401) {
      return 'Sessão expirada. Faça login novamente.'
    }

    const dados = err.response?.data

    if (typeof dados?.detail === 'string') {
      return dados.detail
    }

    if (typeof dados?.message === 'string') {
      return dados.message
    }

    if (typeof dados?.erro === 'string') {
      return dados.erro
    }

    if (dados && typeof dados === 'object') {
      const valor = Object.values(dados)[0]
      if (Array.isArray(valor)) return valor.join(' ')
      if (typeof valor === 'string') return valor
    }

    return padrao
  }

  async function carregarCartoes() {
    carregando.value = true
    erro.value = ''

    try {
      const response = await axios.get('/api/cartoes/', {
        headers: getAuthHeader()
      })

      const dados = response.data

      cartoes.value = Array.isArray(dados)
        ? dados
        : (dados.results ?? [])

    } catch (err) {
      erro.value = obterMensagemErro(
        err,
        'Erro ao carregar os cartões.'
      )
      throw err
    } finally {
      carregando.value = false
    }
  }

  async function adicionarCartao(dadosCartao) {
    carregando.value = true
    erro.value = ''

    try {
      const payload = {
        nome: dadosCartao.nome,
        banco: dadosCartao.banco,
        limite_total: Number(dadosCartao.limite_total),
        valor_utilizado: 0,
        vencimento: dadosCartao.vencimento,
        cor: dadosCartao.cor
      }

      const response = await axios.post(
        '/api/cartoes/',
        payload,
        {
          headers: getAuthHeader()
        }
      )

      // Atualiza a interface após o backend salvar
      cartoes.value.push(response.data)

      return response.data

    } catch (err) {
      erro.value = obterMensagemErro(
        err,
        'Não foi possível cadastrar o cartão.'
      )
      throw err
    } finally {
      carregando.value = false
    }
  }

  async function excluirCartao(id) {
    carregando.value = true
    erro.value = ''

    try {
      await axios.delete(`/api/cartoes/${id}/`, {
        headers: getAuthHeader()
      })

      cartoes.value = cartoes.value.filter(
        cartao => cartao.id !== id
      )

    } catch (err) {
      erro.value = obterMensagemErro(
        err,
        'Não foi possível excluir o cartão.'
      )
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
    adicionarCartao,
    excluirCartao
  }
})

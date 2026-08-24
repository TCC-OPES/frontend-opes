import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const loading = ref(false)

  async function realizarLogin(cpf, password) {
    loading.value = true
    try {
      // Remove pontos e traços do CPF antes de enviar
      const cpfLimpo = cpf.replace(/\D/g, '')

      const response = await api.post('api/login/', {
        username: cpfLimpo,
        cpf: cpfLimpo,
        password: password,
      })

      const accessToken = response.data.access
      const refreshToken = response.data.refresh

      localStorage.setItem('access', accessToken)
      localStorage.setItem('refresh', refreshToken)

      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

      if (response.data.user) {
        user.value = response.data.user
        localStorage.setItem('user', JSON.stringify(response.data.user))
      } else {
        await buscarPerfil()
      }

      return response.data
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function buscarPerfil() {
    try {
      const response = await api.get('api/me/')

      const dadosDoUsuario = response.data.user || response.data

      user.value = dadosDoUsuario
      localStorage.setItem('user', JSON.stringify(dadosDoUsuario))
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error)

      if (!user.value) {
        user.value = { nome: 'Usuário', email: '' }
      }
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']

    window.location.href = '/login'
  }

  return {
    user,
    loading,
    realizarLogin,
    buscarPerfil,
    logout
  }
})

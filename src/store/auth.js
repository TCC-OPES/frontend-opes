import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const loading = ref(false)

  async function realizarLogin(cpf, password) {
    loading.value = true
    try {
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

  // NOVA FUNÇÃO DE CADASTRO COM AUTO-LOGIN
  async function cadastrar(dadosCadastro) {
    loading.value = true
    try {
      const response = await api.post('api/cadastro/', dadosCadastro)

      // Se o backend já retorna o token no cadastro, salvamos e logamos direto
      if (response.data && response.data.access) {
        const accessToken = response.data.access
        const refreshToken = response.data.refresh

        localStorage.setItem('access', accessToken)
        if (refreshToken) localStorage.setItem('refresh', refreshToken)

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

        if (response.data.user) {
          user.value = response.data.user
          localStorage.setItem('user', JSON.stringify(response.data.user))
        } else {
          await buscarPerfil()
        }
      } else {
        // Caso o backend não retorne o token no cadastro, fazemos o login automático logo em seguida
        await realizarLogin(dadosCadastro.cpf, dadosCadastro.password)
      }

      return response.data
    } catch (error) {
      console.error('Erro ao cadastrar:', error)
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
    cadastrar,
    buscarPerfil,
    logout
  }
})

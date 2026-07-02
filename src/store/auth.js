import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api' // Certifique-se de que o caminho do seu api.js está correto

export const useAuthStore = defineStore('auth', () => {
  // Estado centralizado - mantendo o padrão "user" que o back exige
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const loading = ref(false)


  async function realizarLogin(cpf, password) {
    loading.value = true
    try {

      const response = await api.post('api/login/', {
        cpf,
        password,
      })


      localStorage.setItem('access', response.data.access)
      localStorage.setItem('refresh', response.data.refresh)


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
  }

  return {
    user,
    loading,
    realizarLogin,
    buscarPerfil,
    logout
  }
})

import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de Requisição: Envia o Access Token em todas as chamadas
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de Resposta: Renova o Token se der erro 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh')

        // Tenta renovar o token chamando a rota de refresh
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/token/refresh/`, {
          refresh: refreshToken
        })

        // Atualiza o novo access token no LocalStorage
        localStorage.setItem('access', data.access)

        // Refaz a requisição original com o novo token
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)

      } catch (refreshError) {
        // Se o refresh token também falhar/expirar, limpa tudo e manda pro login
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api

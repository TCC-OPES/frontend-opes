import axios from 'axios'

// Em produção, nunca deixar o Axios enviar requisições financeiras ao domínio da Vercel.
const DEFAULT_API = 'https://opes.class.fabricadesoftware.ifc.edu.br'
const configuredApi = (import.meta.env.VITE_API_URL || '').trim()
const API_ORIGIN = /^https?:\/\//i.test(configuredApi)
  ? configuredApi.replace(/\/+$/, '').replace(/\/api$/, '')
  : DEFAULT_API

const api = axios.create({
  baseURL: API_ORIGIN,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let renovando = null
api.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config
    if (!original || error.response?.status !== 401 || original._retry ||
        /\/api\/(login|cadastro|token\/refresh)\//.test(original.url || '')) {
      return Promise.reject(error)
    }
    const refresh = localStorage.getItem('refresh')
    if (!refresh) return Promise.reject(error)

    original._retry = true
    try {
      if (!renovando) {
        renovando = axios.post(`${API_ORIGIN}/api/token/refresh/`, { refresh }, { timeout: 20000 })
          .then(({ data }) => {
            localStorage.setItem('access', data.access)
            if (data.refresh) localStorage.setItem('refresh', data.refresh)
            return data.access
          })
          .finally(() => { renovando = null })
      }
      const access = await renovando
      original.headers = original.headers || {}
      original.headers.Authorization = `Bearer ${access}`
      return api(original)
    } catch (refreshError) {
      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      localStorage.removeItem('user')
      if (window.location.pathname !== '/login') window.location.assign('/login')
      return Promise.reject(refreshError)
    }
  },
)
export default api

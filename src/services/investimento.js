import api from './api' // sua instância do Axios

export default {
  buscarInvestimentos() {
    return api.get('api/investimentos/')
  },
  criarInvestimento(payload) {
    return api.post('api/investimentos/', payload)
  },
  deletarInvestimento(id) {
    return api.delete(`api/investimentos/${id}/`)
  }
}

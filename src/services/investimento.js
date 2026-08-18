// Simulação de delay de rede
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const investimentosService = {
  // GET: Lista todos os investimentos
  async getInvestimentos() {
    await delay(600) // Simula resposta do servidor
    return [
      { id: 1, nome: 'Tesouro Direto', valor: 15000, rendimento: 12.5, cor: '#045B1A' },
      { id: 2, nome: 'CDB', valor: 8500, rendimento: 11.2, cor: '#2563EB' },
      { id: 3, nome: 'Ações', valor: 12000, rendimento: 18.3, cor: '#1E293B' },
      { id: 4, nome: 'Fundos Imobiliários', valor: 6500, rendimento: 9.4, cor: '#16A34A' }
    ]
  },

  // POST: Adiciona novo investimento
  async criarInvestimento(novoItem) {
    await delay(400)
    return {
      id: Date.now(),
      ...novoItem,
      valor: Number(novoItem.valor),
      rendimento: Number(novoItem.rendimento)
    }
  },

  // DELETE: Remove investimento
  async deletarInvestimento(id) {
    await delay(300)
    return true
  }
}

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const CHAVE_LOCAL_STORAGE = 'meus_investimentos_v1'

const investimentosService = {
  async getInvestimentos() {
    const dadosSalvos = localStorage.getItem(CHAVE_LOCAL_STORAGE)
    return dadosSalvos ? JSON.parse(dadosSalvos) : []
  },
  async criarInvestimento(novoItem) {
    return {
      id: Date.now(),
      ...novoItem,
      valor: Number(novoItem.valor),
      rendimento: Number(novoItem.rendimento)
    }
  },
  async deletarInvestimento(id) {
    return true
  }
}

const ativos = ref([])
const carregando = ref(true)
const exibeModal = ref(false)
const salvando = ref(false)

const novoAtivo = ref({
  nome: '',
  valor: '',
  rendimento: '',
  cor: '#2563EB'
})

watch(
  ativos,
  (novosAtivos) => {
    localStorage.setItem(CHAVE_LOCAL_STORAGE, JSON.stringify(novosAtivos))
  },
  { deep: true }
)

const carregarDados = async () => {
  try {
    carregando.value = true
    ativos.value = await investimentosService.getInvestimentos()
  } catch (erro) {
    console.error('Erro ao carregar investimentos:', erro)
  } finally {
    carregando.value = false
  }
}

const totalInvestido = computed(() => {
  return ativos.value.reduce((acc, item) => acc + Number(item.valor), 0)
})

const lucroEstimado = computed(() => {
  return ativos.value
    .reduce((acc, item) => acc + (Number(item.valor) * (Number(item.rendimento) / 100)), 0)
    .toFixed(2)
})

const rentabilidadeMedia = computed(() => {
  if (!totalInvestido.value) return '0.0'
  return ((lucroEstimado.value / totalInvestido.value) * 100).toFixed(1)
})

const segmentosGrafico = computed(() => {
  let acumulado = 0
  const total = totalInvestido.value || 1

  return ativos.value.map((ativo) => {
    const percentual = (Number(ativo.valor) / total) * 100
    const offset = 25 - acumulado
    acumulado += percentual

    return {
      ...ativo,
      dashArray: `${percentual} ${100 - percentual}`,
      dashOffset: offset
    }
  })
})

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor || 0)
}

const abrirModal = () => {
  novoAtivo.value = { nome: '', valor: '', rendimento: '', cor: '#2563EB' }
  exibeModal.value = true
}

const fecharModal = () => {
  exibeModal.value = false
}

const salvarInvestimento = async () => {
  if (!novoAtivo.value.nome || !novoAtivo.value.valor) return

  try {
    salvando.value = true
    const itemCriado = await investimentosService.criarInvestimento(novoAtivo.value)
    ativos.value.push(itemCriado)
    fecharModal()
  } catch (erro) {
    console.error('Erro ao salvar:', erro)
  } finally {
    salvando.value = false
  }
}

const removerInvestimento = async (id) => {
  try {
    await investimentosService.deletarInvestimento(id)
    ativos.value = ativos.value.filter(item => item.id !== id)
  } catch (erro) {
    console.error('Erro ao deletar:', erro)
  }
}

onMounted(() => {
  carregarDados()
})
</script>

<template>
  <div class="investimentos-container">
    <header class="page-header">
      <h1>Investimentos</h1>
      <p>Acompanhe sua carteira de investimentos</p>
    </header>

    <div v-if="carregando" class="loading-state">
      Carregando carteira...
    </div>

    <template v-else>
      <!-- Cards de Resumo -->
      <section class="cards-grid">
        <div class="card">
          <div class="card-header">
            <span>Total Investido</span>
            <span class="card-icon">$</span>
          </div>
          <div class="card-value main-value">{{ formatarMoeda(totalInvestido) }}</div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>Rentabilidade Média</span>
            <span class="card-icon text-green">↗</span>
          </div>
          <div class="card-value text-green">+{{ rentabilidadeMedia }}%</div>
        </div>

        <div class="card">
          <div class="card-header">
            <span>Lucro Estimado</span>
            <span class="card-icon text-blue">📈</span>
          </div>
          <div class="card-value text-blue">{{ formatarMoeda(lucroEstimado) }}</div>
        </div>
      </section>

      <!-- Conteúdo Principal -->
      <section class="content-grid">
        <!-- Distribuição de Ativos -->
        <div class="content-card">
          <h3>Distribuição de Ativos</h3>
          <div v-if="ativos.length" class="chart-wrapper">
            <svg viewBox="0 0 36 36" class="donut-chart">
              <circle
                v-for="segmento in segmentosGrafico"
                :key="segmento.id"
                class="donut-segment"
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                :stroke="segmento.cor"
                stroke-width="5"
                :stroke-dasharray="segmento.dashArray"
                :stroke-dashoffset="segmento.dashOffset"
              ></circle>
            </svg>
          </div>
          <div v-else class="empty-state">
            Nenhum ativo cadastrado para exibir no gráfico.
          </div>
        </div>

        <!-- Lista de Investimentos -->
        <div class="content-card">
          <h3>Meus Investimentos</h3>
          <ul v-if="ativos.length" class="investments-list">
            <li v-for="ativo in ativos" :key="ativo.id" class="investment-item">
              <div class="item-info">
                <span class="color-dot" :style="{ backgroundColor: ativo.cor }"></span>
                <span class="item-name">{{ ativo.nome }}</span>
              </div>
              <div class="item-actions">
                <div class="item-values">
                  <span class="item-amount">{{ formatarMoeda(ativo.valor) }}</span>
                  <span class="item-return text-green">+{{ ativo.rendimento }}%</span>
                </div>
                <button @click="removerInvestimento(ativo.id)" class="btn-delete" title="Excluir">✕</button>
              </div>
            </li>
          </ul>
          <div v-else class="empty-state">
            Você ainda não possui investimentos cadastrados. Clique no botão "+" para adicionar.
          </div>
        </div>
      </section>
    </template>

    <!-- FAB -->
    <button @click="abrirModal" class="fab-button" title="Novo Investimento">+</button>

    <!-- Modal Form -->
    <div v-if="exibeModal" class="modal-overlay" @click.self="fecharModal">
      <div class="modal-content">
        <h3>Novo Investimento</h3>
        <form @submit.prevent="salvarInvestimento">
          <div class="form-group">
            <label>Nome do Ativo</label>
            <input v-model="novoAtivo.nome" type="text" placeholder="Ex: Tesouro Direto" required />
          </div>

          <div class="form-group">
            <label>Valor Investido (R$)</label>
            <input v-model.number="novoAtivo.valor" type="number" step="0.01" placeholder="1000.00" required />
          </div>

          <div class="form-group">
            <label>Rendimento (%)</label>
            <input v-model.number="novoAtivo.rendimento" type="number" step="0.1" placeholder="10.5" required />
          </div>

          <div class="form-group">
            <label>Cor de Exibição</label>
            <input v-model="novoAtivo.cor" type="color" class="input-color" />
          </div>

          <div class="modal-actions">
            <button type="button" @click="fecharModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary" :disabled="salvando">
              {{ salvando ? 'Salvando...' : 'Adicionar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.investimentos-container {
  padding: 1.5rem 2rem;
  background-color: #f8fafc;
  min-height: 100vh;
  box-sizing: border-box;
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.02em;
}

.page-header p {
  color: #64748b;
  font-size: 0.938rem;
  margin: 0 0 1.5rem 0;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #94a3b8;
  font-size: 0.875rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.card,
.content-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.03);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.card-icon {
  font-size: 1.1rem;
  color: #94a3b8;
}

.card-value {
  font-size: 1.75rem;
  font-weight: 800;
  margin-top: 0.75rem;
  letter-spacing: -0.02em;
}

.text-green { color: #16a34a; }
.text-blue { color: #2563eb; }
.main-value { color: #0f172a; }

.content-card h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1.25rem 0;
}

.chart-wrapper {
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
}

.donut-chart {
  width: 210px;
  height: 210px;
  transform: rotate(-90deg);
}

.donut-segment {
  transition: stroke-dasharray 0.3s ease;
}

.investments-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.investment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #f8fafc;
}

.investment-item:last-child {
  border-bottom: none;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.item-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.938rem;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.item-values {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.item-amount {
  font-size: 0.938rem;
  font-weight: 700;
  color: #0f172a;
}

.item-return {
  font-size: 0.75rem;
  font-weight: 600;
}

.btn-delete {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 0.875rem;
  opacity: 0.4;
  transition: opacity 0.2s ease;
}

.btn-delete:hover { opacity: 1; }

.fab-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #059669;
  color: white;
  border: none;
  font-size: 1.75rem;
  font-weight: 300;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(5, 150, 105, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.fab-button:hover {
  transform: scale(1.05);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: white;
  width: 100%;
  max-width: 440px;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin: 0 0 1.25rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.form-group {
  margin-bottom: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-group label {
  font-size: 0.813rem;
  color: #475569;
  font-weight: 600;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.938rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #2563eb;
}

.input-color {
  height: 44px;
  padding: 0.25rem;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 0.875rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 0.938rem;
  cursor: pointer;
}

.btn-primary { background: #059669; color: white; }
.btn-secondary { background: #f1f5f9; color: #475569; }

@media (max-width: 900px) {
  .cards-grid { grid-template-columns: 1fr; }
  .content-grid { grid-template-columns: 1fr; }
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../services/api'

const ativos = ref([])
const carregando = ref(true)

const carregarDados = async () => {
  try {
    carregando.value = true
    const { data } = await api.get(`api/investimentos/?t=${Date.now()}`)
    ativos.value = data.map(item => ({
      ...item,
      valor: item.valor_investido ?? item.valor ?? 0,
      rendimento: item.rentabilidade ?? item.rendimento ?? 0,
      cor: item.cor || '#2563EB'
    }))
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
      cor: ativo.cor || '#2563EB',
      dashArray: `${percentual} ${100 - percentual}`,
      dashOffset: offset
    }
  })
})

const formatarMoeda = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor || 0)
}

const removerInvestimento = async (id) => {
  try {
    await api.delete(`api/investimentos/${id}/`)
    ativos.value = ativos.value.filter(item => item.id !== id)
  } catch (erro) {
    console.error('Erro ao deletar investimento:', erro)
  }
}

const adicionarAtivoLocal = (novoItem) => {
  ativos.value.push({
    ...novoItem,
    valor: novoItem.valor_investido ?? novoItem.valor ?? 0,
    rendimento: novoItem.rentabilidade ?? novoItem.rendimento ?? 0,
    cor: novoItem.cor || '#2563EB'
  })
}

defineExpose({ adicionarAtivoLocal })

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

      <section class="content-grid">
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
  </div>
</template>

<style scoped>
.investimentos-container {
  width: 100%;
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
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
  padding-bottom: 2rem;
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
  transition: stroke-dasharray 0.3s ease, stroke 0.3s ease;
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

@media (max-width: 900px) {
  .cards-grid { grid-template-columns: 1fr; }
  .content-grid { grid-template-columns: 1fr; }
}
</style>

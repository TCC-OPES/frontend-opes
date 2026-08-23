<template>
  <div class="dashboard-layout">
    <SideBarComponent />

    <div class="main-container">
      <HeaderComponent />

      <main class="dashboard-content">
        <section class="welcome-section">
          <h2>Bem-vindo de volta, {{ usuario.name || 'Usuário' }}! </h2>
          <p>Aqui está um resumo completo das suas finanças</p>
        </section>

        <section class="balance-gradient-card">
          <div class="balance-main">
            <p class="label">Saldo Total</p>
            <h1 class="amount">R$ {{ formatarMoeda(resumo.saldo_total) }}</h1>
            <span class="trending-badge">
              <i class="fas fa-arrow-up"></i> {{ resumo.porcentagem_mes || '+0%' }} <small>vs mês passado</small>
            </span>
          </div>

          <div class="balance-summary-boxes">
            <div class="summary-box">
              <p><i class="fas fa-arrow-up icon-receita"></i> Receitas</p>
              <h3>R$ {{ formatarMoeda(resumo.receitas) }}</h3>
            </div>
            <div class="summary-box">
              <p><i class="fas fa-arrow-down icon-despesa"></i> Despesas</p>
              <h3>R$ {{ formatarMoeda(resumo.despesas) }}</h3>
            </div>
          </div>
        </section>

        <section class="analytics-grid">
          <div class="chart-card">
            <h3>Evolução Patrimonial</h3>
            <div class="chart-wrapper">
              <Line :data="lineChartData" :options="lineChartOptions" />
            </div>
          </div>
          <div class="chart-card">
            <h3>Gastos Semanais</h3>
            <div class="chart-wrapper">
              <Bar :data="barChartData" :options="barChartOptions" />
            </div>
          </div>
        </section>

        <section class="bottom-grid">
          <div class="card-section">
            <h3>Próximas Contas</h3>
            <div class="contas-list" v-if="proximasContas.length > 0">
              <div v-for="conta in proximasContas" :key="conta.id" class="conta-item">
                <div class="conta-info">
                  <h4>{{ conta.descricao }}</h4>
                  <p>{{ conta.categoria }} • {{ conta.vencimento }}</p>
                </div>
                <span class="conta-valor">R$ {{ formatarMoeda(conta.valor) }}</span>
              </div>
            </div>
            <p v-else class="empty-msg">Nenhuma conta com vencimento próximo.</p>
          </div>

          <div class="card-section">
            <h3>Minhas Metas</h3>
            <div class="metas-list" v-if="metasFormatadas.length > 0">
              <div v-for="meta in metasFormatadas" :key="meta.id" class="meta-item">
                <div class="meta-header">
                  <span>{{ meta.titulo }}</span>
                  <span class="meta-percent">{{ meta.porcentagem }}%</span>
                </div>
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :class="obterCorProgresso(meta.porcentagem)"
                    :style="{ width: meta.porcentagem + '%' }"
                  ></div>
                </div>
              </div>
            </div>
            <p v-else-if="metasStore.carregando" class="empty-msg">Carregando metas...</p>
            <p v-else class="empty-msg">Nenhuma meta cadastrada.</p>
          </div>
        </section>
      </main>

      <button class="fab-button" title="Nova Transação">
        <i class="fas fa-plus"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import SideBarComponent from '@/components/SideBarComponent.vue'
import { useMetasStore } from '@/store/metas'
import api from '@/services/api'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
} from 'chart.js'
import { Line, Bar } from 'vue-chartjs'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
)

const metasStore = useMetasStore()

const usuario = ref({ name: '' })
const resumo = ref({
  saldo_total: 0,
  receitas: 0,
  despesas: 0,
  porcentagem_mes: '+0%'
})
const proximasContas = ref([])

const lineChartData = ref({
  labels: ['Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar'],
  datasets: [
    {
      label: 'Patrimônio',
      data: [8500, 9200, 8900, 9800, 9400, 11500],
      borderColor: '#15803d',
      backgroundColor: 'rgba(21, 128, 61, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6
    }
  ]
})

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => ` R$ ${context.raw.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      }
    }
  },
  scales: {
    y: {
      grid: { color: '#f1f5f9' },
      ticks: {
        color: '#94a3b8',
        callback: (value) => `R$ ${value}`
      }
    },
    x: {
      grid: { display: false },
      ticks: { color: '#94a3b8' }
    }
  }
}

const barChartData = ref({
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  datasets: [
    {
      label: 'Gastos',
      data: [310, 180, 450, 280, 520, 390, 150],
      backgroundColor: '#2563eb',
      borderRadius: 6
    }
  ]
})

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => ` R$ ${context.raw.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      }
    }
  },
  scales: {
    y: {
      grid: { color: '#f1f5f9' },
      ticks: {
        color: '#94a3b8',
        callback: (value) => `R$ ${value}`
      }
    },
    x: {
      grid: { display: false },
      ticks: { color: '#94a3b8' }
    }
  }
}

const metasFormatadas = computed(() => {
  return metasStore.metas.map((meta) => {
    const atual = Number(meta.valor_atual || 0)
    const objetivo = Number(meta.valor_objetivo || 1)
    const porcentagem = Math.min(Math.round((atual / objetivo) * 100), 100)

    return {
      id: meta.id,
      titulo: meta.nome || meta.titulo || 'Meta sem nome',
      porcentagem
    }
  })
})

const carregarDadosDashboard = async () => {
  try {
    const userLocal = localStorage.getItem('user')

    if (userLocal) {
      const parsedUser = JSON.parse(userLocal)
      const dadosUsuario = parsedUser.data || parsedUser
      const nomeCompleto = dadosUsuario.name || dadosUsuario.nome || ''
      const primeiroNome = nomeCompleto.trim().split(' ')[0]

      usuario.value = {
        name: primeiroNome
      }
    }

    metasStore.carregarMetas()

    const resResumo = await api.get('api/dashboard/resumo/').catch(() => null)
    if (resResumo?.data) resumo.value = resResumo.data

    const resContas = await api.get('api/contas/proximas/').catch(() => null)
    if (resContas?.data) proximasContas.value = resContas.data

    const resGraficos = await api.get('api/dashboard/graficos/').catch(() => null)
    if (resGraficos?.data) {
      if (resGraficos.data.evolucao_labels) lineChartData.value.labels = resGraficos.data.evolucao_labels
      if (resGraficos.data.evolucao_valores) lineChartData.value.datasets[0].data = resGraficos.data.evolucao_valores
      if (resGraficos.data.gastos_semanais) barChartData.value.datasets[0].data = resGraficos.data.gastos_semanais
    }
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error)
  }
}

onMounted(() => {
  carregarDadosDashboard()
})

const formatarMoeda = (valor) => {
  if (!valor && valor !== 0) return '0,00'
  return Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const obterCorProgresso = (porcentagem) => {
  if (porcentagem >= 70) return 'green'
  if (porcentagem >= 35) return 'blue'
  return 'gray'
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #f4f6f9;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.dashboard-content {
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.welcome-section h2 {
  font-size: 1.4rem;
  color: #1e293b;
  font-weight: 700;
}
.welcome-section p {
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 2px;
}

.balance-gradient-card {
  background: linear-gradient(135deg, #0d5c63 0%, #115e59 45%, #1e40af 100%);
  border-radius: 16px;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.balance-main .label {
  font-size: 0.85rem;
  opacity: 0.85;
}
.balance-main .amount {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 4px 0;
  word-break: break-all;
}
.trending-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.balance-summary-boxes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.summary-box {
  background: rgba(255, 255, 255, 0.12);
  padding: 12px 14px;
  border-radius: 12px;
  backdrop-filter: blur(8px);
}
.summary-box p {
  font-size: 0.75rem;
  opacity: 0.9;
  margin-bottom: 2px;
}
.summary-box h3 {
  font-size: 1rem;
  font-weight: 600;
  word-break: break-all;
}
.icon-receita { color: #34d399; }
.icon-despesa { color: #f87171; }

.analytics-grid,
.bottom-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.chart-card,
.card-section {
  background: white;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  min-width: 0;
}

.chart-card h3,
.card-section h3 {
  font-size: 1rem;
  color: #1e293b;
  margin-bottom: 12px;
  font-weight: 600;
}

.chart-wrapper {
  height: 220px;
  position: relative;
  width: 100%;
}

.contas-list,
.metas-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.conta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 12px;
}

.conta-info h4 {
  font-size: 0.875rem;
  color: #1e293b;
  margin: 0;
  font-weight: 600;
}

.conta-info p {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 2px 0 0 0;
}

.conta-valor {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.875rem;
}

.meta-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

.meta-percent {
  color: #64748b;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.progress-fill.green { background-color: #15803d; }
.progress-fill.blue { background-color: #2563eb; }
.progress-fill.gray { background-color: #64748b; }

.empty-msg {
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
}

.fab-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  background-color: #0f766e;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 99;
  transition: transform 0.2s, background-color 0.2s;
}

.fab-button:hover {
  background-color: #0d9488;
  transform: scale(1.05);
}

@media (min-width: 640px) {
  .dashboard-content { padding: 24px; }
  .balance-gradient-card { padding: 24px; }
  .balance-main .amount { font-size: 2.2rem; }
}

@media (min-width: 1024px) {
  .dashboard-content { padding: 32px 40px; }
  .welcome-section h2 { font-size: 1.8rem; }
  .balance-gradient-card {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 32px;
  }
  .balance-main .amount { font-size: 2.6rem; }
  .balance-summary-boxes { display: flex; }
  .summary-box { padding: 16px 24px; min-width: 140px; }
  .summary-box h3 { font-size: 1.3rem; }
  .analytics-grid, .bottom-grid {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
  }
  .chart-card, .card-section { padding: 24px; }
  .chart-wrapper { height: 240px; }
}
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Bar, Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler } from 'chart.js'
import api from '@/services/api'
import { notify } from '@/services/toast'
import { tema } from '@/services/tema'
import { useMetasStore } from '@/store/metas'
import SideBarComponent from '@/components/SideBarComponent.vue'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend, Filler)

const metasStore = useMetasStore()
const nome = ref('')
const carregando = ref(true)
const resumo = ref({ resultado_registrado: 0, receitas: 0, despesas: 0, total_transacoes: 0, total_investido: 0 })
const serie = ref([])
const gastos = ref([])
const proximas = ref([])
const erro = ref('')
const moeda = valor => Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const exibirGraficos = computed(() => serie.value.some(x => Number(x.receitas) !== 0 || Number(x.despesas) !== 0))
const exibirGastos = computed(() => gastos.value.some(x => Number(x.valor) !== 0))
const metas = computed(() => metasStore.metas.map(item => ({
  id: item.id,
  titulo: item.titulo,
  progresso: Math.min(100, Math.max(0, Number(item.valor_objetivo) ? Number(item.valor_atual) / Number(item.valor_objetivo) * 100 : 0)),
})))
const cores = computed(() => ({
  texto: tema.value === 'dark' ? '#b7c6bd' : '#6c756d',
  grade: tema.value === 'dark' ? '#455b4c' : '#e5e7eb',
}))
const mesesData = computed(() => ({
  labels: serie.value.map(x => x.mes),
  datasets: [
    { label: 'Receitas', data: serie.value.map(x => Number(x.receitas)), borderColor: '#47866a', backgroundColor: 'rgba(71,134,106,.16)', tension: .25, fill: false },
    { label: 'Despesas', data: serie.value.map(x => Number(x.despesas)), borderColor: '#b7835d', backgroundColor: 'rgba(183,131,93,.18)', tension: .25, fill: false },
  ],
}))
const gastosData = computed(() => ({
  labels: gastos.value.map(x => x.dia),
  datasets: [{ label: 'Despesas registradas', data: gastos.value.map(x => Number(x.valor)), backgroundColor: '#b7835d', borderRadius: 7 }],
}))
const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: cores.value.texto } }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${moeda(c.raw)}` } } },
  scales: {
    y: { beginAtZero: true, grid: { color: cores.value.grade }, ticks: { color: cores.value.texto, callback: v => moeda(v) } },
    x: { grid: { display: false }, ticks: { color: cores.value.texto } },
  },
}))
async function carregar() {
  carregando.value = true
  erro.value = ''
  try {
    const dados = await api.get('/api/dashboard/')
    resumo.value = dados.data.resumo
    serie.value = dados.data.serie_mensal || []
    gastos.value = dados.data.gastos_semanais || []
    proximas.value = dados.data.proximas || []
  } catch (falha) {
    const codigo = falha.response?.status
    erro.value = codigo === 404
      ? 'Resumo financeiro indisponível nesta versão da API. Atualize o backend.'
      : codigo === 401 ? 'Sua sessão expirou. Entre novamente.'
      : codigo >= 500 ? 'O servidor não conseguiu gerar o resumo financeiro.'
      : 'Não foi possível carregar o resumo financeiro. Confira a conexão com a API.'
    notify.error(erro.value)
  } finally {
    carregando.value = false
  }
  try {
    await metasStore.carregarMetas()
  } catch (falhaMetas) {
    console.error('Erro ao carregar metas:', falhaMetas)
  }
}
onMounted(() => {
  try {
    const salvo = JSON.parse(localStorage.getItem('user') || '{}')
    const usuario = salvo.data || salvo
    nome.value = (usuario.name || usuario.nome || '').trim().split(' ')[0]
  } catch { nome.value = '' }
  carregar()
})
</script>

<template>
<div class="dashboard-layout">
  <SideBarComponent />
  <div class="main-container">
    <main class="dashboard-content entrada-pagina">
      <header class="titulo">
        <div><span class="sobretitulo">VISÃO GERAL</span><h1>Bem-vindo{{ nome ? ', ' + nome : '' }}!</h1>
        <p>Resumo dos seus lançamentos financeiros cadastrados.</p></div>
        <button type="button" class="atualizar" :disabled="carregando" @click="carregar">Atualizar</button>
      </header>
      <p v-if="erro" class="estado" role="alert">{{ erro }}</p>
      <p v-if="carregando" class="estado">Carregando dados financeiros...</p>
      <section class="resumo" aria-label="Resumo financeiro">
        <div class="resumo-principal">
          <span>Resultado registrado</span>
          <strong>{{ moeda(resumo.resultado_registrado) }}</strong>
          <small>Receitas menos despesas cadastradas. Não representa seu saldo bancário.</small>
        </div>
        <div class="resumo-menor"><span>Receitas registradas</span><strong>{{ moeda(resumo.receitas) }}</strong><small>Histórico completo</small></div>
        <div class="resumo-menor"><span>Despesas registradas</span><strong>{{ moeda(resumo.despesas) }}</strong><small>Histórico completo</small></div>
        <div class="resumo-menor"><span>Investimentos cadastrados</span><strong>{{ moeda(resumo.total_investido) }}</strong><small>Valor informado, sem atualização de mercado</small></div>
      </section>
      <div class="analytics-grid">
        <section class="cartao">
          <h2>Receitas e despesas por mês</h2><p>Últimos seis meses · valores registrados</p>
          <div v-if="!carregando && exibirGraficos" class="grafico"><Line :data="mesesData" :options="options" /></div>
          <p v-else class="vazio">Ainda não existem lançamentos suficientes para mostrar o gráfico.</p>
        </section>
        <section class="cartao">
          <h2>Gastos desta semana</h2><p>Valores registrados por dia da semana</p>
          <div v-if="!carregando && exibirGastos" class="grafico"><Bar :data="gastosData" :options="options" /></div>
          <p v-else class="vazio">Nenhuma despesa registrada nesta semana.</p>
        </section>
      </div>
      <div class="analytics-grid">
        <section class="cartao">
          <h2>Próximos vencimentos</h2>
          <p v-if="!proximas.length" class="vazio">Nenhuma conta prevista para os próximos 30 dias.</p>
          <div v-for="conta in proximas" :key="conta.id + conta.vencimento" class="linha">
            <div><strong>{{ conta.titulo }}</strong><small>{{ conta.categoria }} · {{ conta.vencimento.split('-').reverse().join('/') }}</small></div>
            <strong>{{ moeda(conta.valor) }}</strong>
          </div>
          <small class="nota">Vencimentos previstos não são pagamentos realizados.</small>
        </section>
        <section class="cartao">
          <h2>Minhas metas</h2>
          <p v-if="!metas.length" class="vazio">Nenhuma meta cadastrada.</p>
          <div v-for="meta in metas" :key="meta.id" class="meta">
            <div class="meta-info"><strong>{{ meta.titulo }}</strong><span>{{ Math.round(meta.progresso) }}%</span></div>
            <div class="trilha"><div :style="{ width: meta.progresso + '%' }" /></div>
          </div>
        </section>
      </div>
    </main>
  </div>
</div>
</template>

<style scoped>
.dashboard-layout{display:flex;min-height:100dvh;background:var(--opes-cream)}
.main-container{flex:1;min-width:0}
.dashboard-content{max-width:1480px;margin:auto;padding:32px 28px 120px;color:var(--opes-ink)}
.titulo{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:24px}
.sobretitulo{font-size:11px;font-weight:800;letter-spacing:1.4px;color:var(--opes-caramel-dark)}
h1{font-size:29px;margin:7px 0 5px}h2{font-size:18px;margin:0 0 8px}
p,.nota{color:var(--opes-muted);margin:0}
.atualizar{border:0;border-radius:10px;background:var(--opes-forest);color:var(--opes-paper);padding:11px 17px}
.resumo{display:grid;grid-template-columns:1.5fr repeat(3,minmax(0,1fr));gap:14px;margin-bottom:22px}
.resumo>div{border:1px solid var(--opes-border);border-radius:16px;padding:20px;background:var(--opes-paper);min-width:0}
.resumo>div{display:flex;flex-direction:column;gap:8px}
.resumo span{font-size:13px;color:var(--opes-muted)}
.resumo strong{font-size:clamp(19px,2vw,28px);overflow-wrap:anywhere}
.resumo small,.nota{font-size:12px;line-height:1.5;color:var(--opes-muted)}
.resumo-principal{background:var(--opes-forest-dark)!important;color:var(--opes-paper)!important}
.resumo-principal span,.resumo-principal small,.resumo-principal strong{color:var(--opes-paper)!important}
.analytics-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:20px 0}
.cartao{background:var(--opes-paper);border:1px solid var(--opes-border);border-radius:16px;padding:22px;min-width:0}
.cartao>p:not(.vazio){font-size:13px}
.grafico{height:260px;margin-top:20px;position:relative}
.vazio{padding:26px 2px;font-size:14px;color:var(--opes-muted)}
.linha{display:flex;justify-content:space-between;gap:18px;padding:15px 0;border-top:1px solid var(--opes-border)}
.linha div{display:flex;flex-direction:column;gap:5px}
.linha small{color:var(--opes-muted)}
.nota{display:block;margin-top:14px}
.meta{margin:18px 0}.meta-info{display:flex;justify-content:space-between;gap:12px;margin-bottom:8px}
.trilha{height:9px;border-radius:20px;background:var(--opes-sand);overflow:hidden}
.trilha>div{height:100%;background:var(--opes-caramel);border-radius:20px}
.estado{padding:10px 0}
@media(max-width:1100px){.resumo{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:720px){.dashboard-content{padding:20px 14px 125px}.resumo,.analytics-grid{grid-template-columns:1fr}.titulo{align-items:flex-start;flex-wrap:wrap}.cartao{padding:16px}}

.entrada-pagina { animation: entrada-pagina 0.6s ease-out both; }
@keyframes entrada-pagina { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>

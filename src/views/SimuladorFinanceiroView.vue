<script setup>
import { ref, computed, onMounted } from 'vue'
import { carregarDadosSimulador } from '@/services/simulador'
import SideBarComponent from '@/components/SideBarComponent.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'

const hojeLocal = () => {
  const d = new Date()
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
}
const diaLocal = hojeLocal()
function adicionarMes(data, i) {
  const [a, m, d] = data.split('-').map(Number)
  const base = new Date(a, m - 1 + i, 1)
  return [base.getFullYear(), String(base.getMonth() + 1).padStart(2, '0'),
    String(Math.min(d, new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate())).padStart(2, '0')].join('-')
}
function adicionarDias(data, dias) {
  const [a, m, d] = data.split('-').map(Number)
  const nova = new Date(a, m - 1, d + dias)
  return [nova.getFullYear(), String(nova.getMonth() + 1).padStart(2, '0'), String(nova.getDate()).padStart(2, '0')].join('-')
}
const limiteCompra = adicionarDias(diaLocal, 30)
const fimConsulta = adicionarDias(diaLocal, 365)
const valor = ref('')
const parcelas = ref(1)
const dataCompra = ref(diaLocal)
const transacoes = ref([])
const ocorrencias = ref([])
const metas = ref([])
const carregando = ref(false)
const carregado = ref(false)
const erro = ref('')
const moeda = v => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const valido = computed(() => {
  const n = Number(parcelas.value)
  return Number(valor.value) > 0 && Number.isFinite(Number(valor.value))
    && Number.isInteger(n) && n >= 1 && n <= 12
    && dataCompra.value >= diaLocal && dataCompra.value <= limiteCompra
})
const saldoAtual = computed(() => transacoes.value
  .filter(t => t.data?.slice(0, 10) <= diaLocal)
  .reduce((s, t) => s + (t.tipo === 'receita' ? 1 : -1) * Number(t.valor), 0))
const reservaMetas = computed(() => metas.value
  .filter(m => m.data_limite >= diaLocal && Number(m.valor_atual) < Number(m.valor_objetivo))
  .reduce((s, m) => s + Math.max(0, Number(m.valor_mensal) || 0), 0))
const resultado = computed(() => {
  if (!valido.value || !carregado.value) return null
  const qtd = Number(parcelas.value)
  const totalCentavos = Math.round(Number(valor.value) * 100)
  const base = Math.floor(totalCentavos / qtd)
  const eventos = []
  const fim = adicionarMes(dataCompra.value, qtd - 1)
  if (fim > fimConsulta) return null

  for (const o of ocorrencias.value) {
    if (!o.confirmada_em && o.vencimento >= diaLocal && o.vencimento <= fim) {
      eventos.push({ data: o.vencimento, titulo: o.titulo, valor: (o.tipo === 'receita' ? 1 : -1) * Number(o.valor) })
    }
  }
  // Transações futuras já cadastradas e não vinculadas a uma ocorrência confirmada.
  const idsConfirmados = new Set(ocorrencias.value.filter(o => o.confirmada_em && o.transacao).map(o => String(o.transacao)))
  for (const t of transacoes.value) {
    const d = t.data?.slice(0, 10)
    if (d > diaLocal && d <= fim && !idsConfirmados.has(String(t.id))) {
      eventos.push({ data: d, titulo: t.titulo, valor: (t.tipo === 'receita' ? 1 : -1) * Number(t.valor) })
    }
  }
  for (let i = 0; i < qtd; i++) {
    eventos.push({ data: adicionarMes(dataCompra.value, i), titulo: 'Compra simulada (' + (i + 1) + '/' + qtd + ')',
      valor: -(base + (i === qtd - 1 ? totalCentavos % qtd : 0)) / 100 })
  }
  eventos.sort((a, b) => a.data.localeCompare(b.data))
  let saldo = saldoAtual.value
  let minimo = saldo
  const projecao = eventos.map(e => {
    saldo = Math.round((saldo + e.valor) * 100) / 100
    minimo = Math.min(minimo, saldo)
    return { ...e, saldo }
  })
  return { saldo, minimo, projecao, parcela: totalCentavos / 100 / qtd,
    valorParcelas: totalCentavos / 100, reservaMetas: reservaMetas.value }
})
async function carregar() {
  carregando.value = true
  erro.value = ''
  carregado.value = false
  try {
    const dados = await carregarDadosSimulador(diaLocal, fimConsulta)
    transacoes.value = dados.transacoes
    ocorrencias.value = dados.ocorrencias
    metas.value = dados.metas
    carregado.value = true
  } catch {
    erro.value = 'Não foi possível obter os dados financeiros para a simulação.'
  } finally { carregando.value = false }
}
onMounted(carregar)
</script>
<template>
<div class="layout"><SideBarComponent /><div class="principal"><HeaderComponent /><main class="conteudo">
  <h1>Posso comprar?</h1><p>Simule uma compra sem alterar suas transações ou seu saldo.</p>
  <p class="aviso">Estimativa baseada nas transações registradas e recorrências conhecidas. As receitas previstas são incertas. Não inclui movimentações não cadastradas, juros nem rendimentos. A projeção não movimenta dinheiro.</p>
  <p v-if="erro" role="alert" class="erro">{{ erro }}</p><p v-if="carregando">Carregando dados financeiros...</p>
  <form class="painel" @submit.prevent>
    <h2>Simulação</h2>
    <label>Valor da compra (R$) <input v-model="valor" type="number" min="0.01" step="0.01" placeholder="Ex.: 1200" /></label>
    <label>Data da compra <input v-model="dataCompra" type="date" :min="diaLocal" :max="limiteCompra" /></label>
    <label>Número de parcelas <input v-model="parcelas" type="number" min="1" max="12" step="1" /></label>
  </form>
  <p v-if="!valido && valor" class="erro">Informe um valor positivo, data entre hoje e os próximos 30 dias e até 12 parcelas.</p>
  <section class="painel" v-if="resultado">
    <h2>Impacto estimado</h2>
    <div class="resumo"><div><span>Saldo atual calculado</span><strong>{{ moeda(saldoAtual) }}</strong></div>
      <div><span>Parcela média</span><strong>{{ moeda(resultado.parcela) }}</strong></div>
      <div><span>Saldo projetado ao fim</span><strong :class="{negativo:resultado.saldo<0}">{{ moeda(resultado.saldo) }}</strong></div></div>
    <p v-if="resultado.saldo<0" class="erro">A projeção indica saldo insuficiente. Considere reduzir ou adiar a compra.</p>
    <p class="aviso">As metas ativas têm contribuição planejada total de {{ moeda(resultado.reservaMetas) }}/mês. Esse valor não foi descontado automaticamente para evitar contabilizar duas vezes uma contribuição já registrada como despesa.</p>
    <p v-if="resultado.minimo < 0" class="erro">Em pelo menos um momento do período projetado, o saldo fica negativo.</p>
    <h3>Movimentações consideradas</h3>
    <div class="linha" v-for="(e,i) in resultado.projecao" :key="i">
      <span>{{ e.data }} · {{ e.titulo }}</span><span>{{ moeda(e.valor) }}</span><strong>{{ moeda(e.saldo) }}</strong>
    </div>
    <p v-if="!resultado.projecao.length">Nenhuma movimentação futura identificada.</p>
  </section>
</main></div></div>
</template>
<style scoped>
.layout{display:flex;min-height:100vh;background:#f8fafc}.principal{flex:1;min-width:0}.conteudo{max-width:1050px;margin:auto;padding:32px 24px 100px;color:#1e293b}h1{font-size:28px}h2{font-size:20px}h3{font-size:17px;margin:24px 0 14px}.painel{background:white;padding:24px;border:1px solid #e2e8f0;border-radius:14px;margin-top:20px;display:grid;gap:16px}.painel label{display:flex;flex-direction:column;gap:8px;max-width:420px}input{padding:12px;border:1px solid #cbd5e1;border-radius:8px}.aviso{background:#fef3c7;padding:14px;border-radius:8px;margin-top:20px}.erro,.negativo{color:#b91c1c}.resumo{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px}.resumo div{display:flex;flex-direction:column;gap:6px}.resumo span{color:#64748b}.resumo strong{font-size:22px}.linha{display:flex;justify-content:space-between;gap:12px;border-top:1px solid #e2e8f0;padding:12px 0;flex-wrap:wrap}@media(max-width:800px){.layout{display:block}.conteudo{padding:20px 16px 100px}}
</style>
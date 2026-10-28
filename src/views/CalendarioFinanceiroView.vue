<script setup>
import { ref, computed, watch } from 'vue'
import { carregarCalendario, confirmarVencimento } from '@/services/calendario'
import SideBarComponent from '@/components/SideBarComponent.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'

const agora = new Date()
const ano = ref(agora.getFullYear())
const mes = ref(agora.getMonth())
const eventos = ref([])
const carregando = ref(false)
const erro = ref('')
const selecionado = ref(null)
const titulo = computed(() => new Date(ano.value, mes.value, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }))
const formatar = v => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const diaISO = n => [ano.value, String(mes.value + 1).padStart(2,'0'), String(n).padStart(2,'0')].join('-')
const celulas = computed(() => {
  const offset = new Date(ano.value, mes.value, 1).getDay()
  const total = new Date(ano.value, mes.value + 1, 0).getDate()
  return [...Array(offset).fill(null), ...Array.from({length:total},(_,i)=>i+1)]
})
const porDia = computed(() => eventos.value.reduce((acc,e) => {
  const data = e.vencimento || e.data?.slice(0,10)
  if (!data) return acc
  ;(acc[data] ||= []).push(e)
  return acc
}, {}))
const eventosSelecionados = computed(() => porDia.value[selecionado.value] || [])
const totais = computed(() => eventos.value.reduce((s,e) => {
  s[e.tipo === 'receita' ? 'receitas' : 'despesas'] += Number(e.valor)||0
  return s
},{ receitas:0, despesas:0 }))
async function carregar() {
  carregando.value = true; erro.value = ''
  const inicio = diaISO(1)
  const fim = diaISO(new Date(ano.value, mes.value + 1, 0).getDate())
  try {
    eventos.value = await carregarCalendario(inicio, fim)
    selecionado.value = inicio
  } catch {
    erro.value='Não foi possível carregar o calendário. Verifique se a API de recorrências da FEAT-52 já foi integrada.'
  } finally { carregando.value=false }
}
function navegar(n) {
  const d = new Date(ano.value,mes.value+n,1)
  ano.value=d.getFullYear();mes.value=d.getMonth()
}
async function confirmar(e) {
  if (!e.recorrencia || e.confirmada_em) return
  try { await confirmarVencimento(e.id); await carregar(); selecionado.value=e.vencimento }
  catch { erro.value='Falha ao confirmar o pagamento.' }
}
watch([ano,mes], carregar,{immediate:true})
</script>
<template>
  <div class="layout"><SideBarComponent /><div class="principal"><HeaderComponent /><main class="conteudo">
    <h1>Calendário financeiro</h1><p>Visualize vencimentos e movimentações do mês.</p>
    <div class="resumo"><span>Receitas (previstas + realizadas): <strong>{{ formatar(totais.receitas) }}</strong></span><span>Despesas (previstas + realizadas): <strong>{{ formatar(totais.despesas) }}</strong></span></div>
    <p v-if="erro" role="alert" class="erro">{{ erro }}</p><p v-if="carregando">Carregando...</p>
    <section class="painel"><div class="cabecalho"><button @click="navegar(-1)" aria-label="Mês anterior">‹</button><h2>{{ titulo }}</h2><button @click="navegar(1)" aria-label="Próximo mês">›</button></div>
      <div class="dias"><strong v-for="d in ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']" :key="d">{{ d }}</strong></div>
      <div class="grade"><div v-for="(dia,i) in celulas" :key="i" :class="['celula', {ativa: dia && selecionado===diaISO(dia)}]">
        <button v-if="dia" @click="selecionado=diaISO(dia)"><span>{{ dia }}</span><small v-if="porDia[diaISO(dia)]">{{ porDia[diaISO(dia)].length }} evento(s)</small></button>
      </div></div>
    </section>
    <section class="painel"><h2>Eventos em {{ selecionado || '—' }}</h2>
      <p v-if="!eventosSelecionados.length">Nenhum evento para este dia.</p>
      <article class="evento" v-for="e in eventosSelecionados" :key="(e.recorrencia?'oc':'tr')+e.id">
        <div><strong>{{ e.titulo }}</strong><p>{{ e.tipo }} · {{ e.status || 'realizado' }}</p></div>
        <div><strong>{{ formatar(e.valor) }}</strong><button v-if="e.recorrencia&&!e.confirmada_em" @click="confirmar(e)">Confirmar</button></div>
      </article>
    </section>
  </main></div></div>
</template>
<style scoped>
.layout{display:flex;min-height:100vh;background:#f8fafc}.principal{flex:1;min-width:0}.conteudo{max-width:1050px;margin:auto;padding:32px 24px 100px;color:#1e293b}h1{font-size:28px}h2{font-size:20px;text-transform:capitalize}.resumo{display:flex;gap:24px;flex-wrap:wrap;margin:20px 0}.painel{background:white;padding:20px;border-radius:14px;border:1px solid #e2e8f0;margin-top:20px}.cabecalho{display:flex;align-items:center;justify-content:space-between}.cabecalho button{font-size:25px}.dias,.grade{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));text-align:center}.dias{margin-top:20px;color:#64748b;font-size:12px}.celula{min-height:90px;border:1px solid #e2e8f0}.celula.ativa{background:#ccfbf1}.celula button{display:flex;flex-direction:column;align-items:flex-start;width:100%;height:100%;padding:10px;color:#0f766e;gap:10px}small{font-size:11px}button{background:none;border:0;cursor:pointer}.evento{display:flex;justify-content:space-between;border-top:1px solid #e2e8f0;padding:16px 0}.evento p{color:#64748b}.evento button{display:block;background:#0f766e;color:white;border-radius:6px;padding:8px;margin-top:8px}.erro{color:#b91c1c}@media(max-width:800px){.layout{display:block}.conteudo{padding:20px 12px 100px}.celula{min-height:63px}.celula button{padding:4px}small{font-size:9px}}
</style>
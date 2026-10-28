<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from '@/services/toast'
import { carregarCalendario, confirmarVencimento } from '@/services/calendario'
import SideBarComponent from '@/components/SideBarComponent.vue'

const router = useRouter()
const agora = new Date()
const ano = ref(agora.getFullYear())
const mes = ref(agora.getMonth())
const eventos = ref([])
const carregando = ref(false)
const erro = ref('')
watch(erro, value => { if (value) notify.error(value) })
const selecionado = ref(null)
const detalhe = ref(null)
const processando = ref(false)
const titulo = computed(() => new Date(ano.value, mes.value, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }))
const moeda = v => Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const dataISO = d => [ano.value, String(mes.value+1).padStart(2,'0'), String(d).padStart(2,'0')].join('-')
const formatarData = d => d ? d.split('-').reverse().join('/') : '—'
const celulas = computed(() => {
  const offset = new Date(ano.value,mes.value,1).getDay()
  const total = new Date(ano.value,mes.value+1,0).getDate()
  return [...Array(offset).fill(null), ...Array.from({length:total},(_,i)=>i+1)]
})
const porDia = computed(() => eventos.value.reduce((acc, e) => {
  const d = e.vencimento || e.data?.slice(0,10)
  if (d) (acc[d] ||= []).push(e)
  return acc
}, {}))
const total = computed(() => eventos.value.reduce((s,e) => {
  s[e.tipo === 'receita' ? 'receitas' : 'despesas'] += Number(e.valor)||0
  return s
}, { receitas:0, despesas:0 }))
const status = e => e.status || (e.confirmada_em ? 'confirmada' : 'realizada')
const classe = e => e.tipo === 'receita' ? 'entrada' : 'saida'
async function carregar() {
  const inicio = dataISO(1)
  const fim = dataISO(new Date(ano.value,mes.value+1,0).getDate())
  carregando.value=true
  erro.value=''
  try { eventos.value=await carregarCalendario(inicio,fim) }
  catch { erro.value='Não foi possível carregar os eventos financeiros.' }
  finally { carregando.value=false }
}
function navegar(n) {
  const d=new Date(ano.value,mes.value+n,1)
  ano.value=d.getFullYear();mes.value=d.getMonth()
  selecionado.value=null;detalhe.value=null
}
function abrir(e) { detalhe.value=e; selecionado.value=e.vencimento || e.data?.slice(0,10) }
function fechar() { detalhe.value=null }
function editarRecorrencia() {
  if (!detalhe.value?.recorrencia) return
  const id = detalhe.value.recorrencia
  detalhe.value = null
  router.push({ path: '/recorrencias', query: { editar: String(id) } })
}
async function confirmar() {
  if(!detalhe.value?.recorrencia || detalhe.value.confirmada_em || processando.value)return
  processando.value=true
  try {
    const data = detalhe.value.vencimento
    await confirmarVencimento(detalhe.value.id)
    await carregar()
    detalhe.value = eventos.value.find(e=>e.recorrencia && e.vencimento===data && e.id===detalhe.value.id) || null
  } catch { erro.value='Falha ao confirmar o lançamento.' }
  finally { processando.value=false }
}
watch([ano,mes], carregar, { immediate:true })
</script>

<template>
<div class="layout"><SideBarComponent /><div class="principal"><main class="conteudo">
  <div class="titulo"><div><span class="sobretitulo">PLANEJAMENTO FINANCEIRO</span><h1>Calendário financeiro</h1><p>Seus compromissos e movimentações, organizados por dia.</p></div></div>
  <div class="resumo">
    <div class="resumo-card"><span>Receitas do mês</span><strong class="verde">{{ moeda(total.receitas) }}</strong><small>Previstas e realizadas</small></div>
    <div class="resumo-card"><span>Despesas do mês</span><strong class="vermelho">{{ moeda(total.despesas) }}</strong><small>Previstas e realizadas</small></div>
    <div class="resumo-card"><span>Lançamentos no mês</span><strong>{{ eventos.length }}</strong><small>Selecione um evento para ver detalhes</small></div>
  </div>
  <section class="painel">
    <div class="cabecalho"><div><span class="sobretitulo">VISÃO MENSAL</span><h2>{{ titulo }}</h2></div>
      <div class="controles"><button type="button" aria-label="Mês anterior" @click="navegar(-1)">‹</button><button type="button" aria-label="Próximo mês" @click="navegar(1)">›</button></div>
    </div>
    <p v-if="carregando" class="mensagem">Carregando eventos...</p>
    <div class="dias"><strong v-for="d in ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']" :key="d">{{ d }}</strong></div>
    <div class="grade"><div v-for="(dia,i) in celulas" :key="i" :class="['celula',{'fora':!dia,'hoje':dia && dataISO(dia)===new Date().toLocaleDateString('sv-SE'),'com-eventos':dia && !!(porDia[dataISO(dia)]||[]).length,'selecionada':dia && selecionado===dataISO(dia)}]">
      <template v-if="dia">
        <button v-if="(porDia[dataISO(dia)]||[]).length" type="button" class="numero dia-ativo" :aria-label="'Abrir eventos de '+formatarData(dataISO(dia))" @click="selecionado=dataISO(dia)">{{ dia }}</button>
        <span v-else class="numero">{{ dia }}</span>
        <button v-for="e in (porDia[dataISO(dia)]||[]).slice(0,2)" :key="(e.recorrencia?'r':'t')+e.id" type="button" :class="['evento-preview',classe(e)]" :title="e.titulo+' — '+moeda(e.valor)" @click="abrir(e)">
          <span class="evento-nome">{{ e.titulo }}</span><span class="evento-valor">{{ moeda(e.valor) }}</span>
        </button>
        <button v-if="(porDia[dataISO(dia)]||[]).length>2" type="button" class="mais" @click="selecionado=dataISO(dia)">+{{ porDia[dataISO(dia)].length-2 }} eventos</button>
        <button v-if="(porDia[dataISO(dia)]||[]).length" type="button" class="selecionar-dia" :aria-label="'Ver eventos de '+formatarData(dataISO(dia))" @click="selecionado=dataISO(dia)">Ver eventos</button>
      </template>
    </div></div>
  </section>
  <section v-if="selecionado" class="painel lista"><div class="cabecalho"><h2>Eventos de {{ formatarData(selecionado) }}</h2><button class="fechar-dia" @click="selecionado=null">Fechar</button></div>
    <p v-if="!(porDia[selecionado]||[]).length">Nenhum evento registrado neste dia.</p>
    <button v-for="e in porDia[selecionado]||[]" :key="(e.recorrencia?'r':'t')+e.id" class="linha" @click="abrir(e)">
      <span><strong>{{ e.titulo }}</strong><small>{{ e.categoria || e.tipo }} · {{ status(e) }}</small></span><strong>{{ moeda(e.valor) }}</strong>
    </button>
  </section>
  <div v-if="detalhe" class="overlay" @click.self="fechar">
    <section class="modal" role="dialog" aria-modal="true" aria-label="Detalhes do lançamento" @keydown.esc="fechar">
      <div class="cabecalho"><span class="sobretitulo">DETALHES DO EVENTO</span><button class="fechar-dia" @click="fechar" aria-label="Fechar detalhes">✕</button></div>
      <h2>{{ detalhe.titulo }}</h2><strong :class="['valor-detalhe',classe(detalhe)]">{{ moeda(detalhe.valor) }}</strong>
      <dl><div><dt>Data</dt><dd>{{ formatarData(detalhe.vencimento || detalhe.data?.slice(0,10)) }}</dd></div>
        <div><dt>Tipo</dt><dd>{{ detalhe.tipo==='receita'?'Receita':'Despesa' }}</dd></div>
        <div><dt>Categoria</dt><dd>{{ detalhe.categoria || 'Não informada' }}</dd></div>
        <div><dt>Situação</dt><dd>{{ status(detalhe) }}</dd></div></dl>
      <button v-if="detalhe.recorrencia" class="confirmar" type="button" @click="editarRecorrencia">Editar recorrência</button>
      <button v-if="detalhe.recorrencia && !detalhe.confirmada_em" class="confirmar" :disabled="processando" @click="confirmar">{{ processando?'Confirmando...':detalhe.tipo==='receita'?'Confirmar recebimento':'Confirmar pagamento' }}</button>
    </section>
  </div>
</main></div></div>
</template>
<style scoped>
.layout{display:flex;min-height:100vh;background:var(--opes-paper)}.principal{flex:1;min-width:0}.conteudo{max-width:1200px;margin:auto;padding:30px 24px 140px;color:var(--opes-ink)}.sobretitulo{font-size:11px;font-weight:800;letter-spacing:1.4px;color:var(--opes-forest)}h1{font-size:30px;margin:8px 0 4px}h2{font-size:20px;margin:5px 0;text-transform:capitalize}.titulo p,.mensagem{color:var(--opes-forest)}.resumo{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:26px 0}.resumo-card{display:flex;flex-direction:column;gap:8px;background:white;border:1px solid var(--opes-cream);border-radius:16px;padding:20px}.resumo-card span,.resumo-card small{color:var(--opes-forest)}.resumo-card strong{font-size:24px}.verde{color:var(--opes-forest)}.vermelho{color:var(--opes-danger)}.painel{background:white;border:1px solid var(--opes-cream);border-radius:16px;padding:20px;margin-top:20px;box-shadow:0 4px 24px #0f172a07}.cabecalho{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:20px}.controles{display:flex;gap:8px}.controles button,.fechar-dia{border:1px solid var(--opes-cream);background:var(--opes-paper);border-radius:10px;padding:8px 14px;cursor:pointer;color:var(--opes-forest);font-weight:700}.controles button{font-size:22px}.dias,.grade{display:grid;grid-template-columns:repeat(7,minmax(0,1fr))}.dias{text-align:center;color:var(--opes-forest);font-size:12px;padding-bottom:10px}.celula{position:relative;min-width:0;min-height:130px;padding:10px 6px;border:1px solid var(--opes-cream);display:flex;flex-direction:column;gap:5px}.celula.fora{background:var(--opes-paper)}.celula.hoje{background:var(--opes-cream)}.numero{font-size:12px;font-weight:750;color:var(--opes-ink);padding:2px 4px}.evento-preview{display:flex;flex-direction:column;align-items:flex-start;gap:2px;border:0;border-left:3px solid;border-radius:6px;padding:6px;text-align:left;min-width:0;cursor:pointer}.evento-preview.entrada{background:var(--opes-cream);border-color:var(--opes-forest);color:var(--opes-forest)}.evento-preview.saida{background:var(--opes-paper);border-color:var(--opes-danger);color:var(--opes-danger)}.evento-nome{font-size:11px;font-weight:750;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.evento-valor{font-size:10px}.mais,.selecionar-dia{background:transparent;color:var(--opes-forest);border:0;text-align:left;font-size:11px;cursor:pointer;padding:2px 4px}.selecionar-dia{margin-top:auto}.lista .linha{display:flex;justify-content:space-between;align-items:center;gap:14px;width:100%;padding:14px 6px;background:white;border:0;border-top:1px solid var(--opes-cream);text-align:left;cursor:pointer}.linha span{display:flex;flex-direction:column;gap:4px}.linha small{color:var(--opes-forest)}.overlay{position:fixed;inset:0;background:#0f172a85;z-index:3000;display:flex;justify-content:center;align-items:center;padding:20px}.modal{background:white;border-radius:18px;padding:24px;width:100%;max-width:460px;box-shadow:0 20px 60px #0003}.valor-detalhe{font-size:30px;display:block;margin:12px 0}.valor-detalhe.entrada{color:var(--opes-forest)}.valor-detalhe.saida{color:var(--opes-danger)}dl div{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--opes-cream)}dt{color:var(--opes-forest)}dd{font-weight:600;margin:0}.confirmar{background:var(--opes-forest);border:0;border-radius:9px;color:white;padding:12px 16px;margin-top:22px;width:100%;cursor:pointer}.erro{color:var(--opes-danger)}@media(max-width:850px){.conteudo{padding:20px 12px 130px}.resumo{grid-template-columns:1fr}.painel{padding:12px}.celula{min-height:85px;padding:5px 2px}.evento-valor{display:none}.evento-preview{padding:3px}.evento-nome{font-size:9px}.selecionar-dia{font-size:9px}.numero{font-size:11px}.dias{font-size:10px}} 
.celula.com-eventos{border-color:var(--opes-sand)}.celula.selecionada{outline:2px solid var(--opes-forest);outline-offset:-2px}.dia-ativo{border:0;background:transparent;text-align:left;cursor:pointer;color:var(--opes-forest);font-weight:800}.dia-ativo:hover{text-decoration:underline}
</style>
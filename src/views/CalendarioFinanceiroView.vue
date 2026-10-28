<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from '@/services/toast'
import { carregarCalendario } from '@/services/calendario'
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
const total = computed(() => eventos.value.reduce((s, e) => {
  if (e.recorrencia && !e.confirmada_em) {
    s[e.tipo === 'receita' ? 'receitasPrevistas' : 'despesasPrevistas'] += Number(e.valor) || 0
  } else {
    s.registrados += 1
  }
  return s
}, { receitasPrevistas: 0, despesasPrevistas: 0, registrados: 0 }))
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
function abrir(e) { detalhe.value=e }
function abrirDia(d) { if ((porDia.value[d] || []).length) selecionado.value=d }
function fecharDia() { selecionado.value=null; detalhe.value=null }
function fechar() { detalhe.value=null }
function editarRecorrencia() {
  if (!detalhe.value?.recorrencia) return
  const id = detalhe.value.recorrencia
  detalhe.value = null
  router.push({ path: '/recorrencias', query: { editar: String(id) } })
}
watch([ano,mes], carregar, { immediate:true })
</script>

<template>
<div class="layout"><SideBarComponent /><div class="principal"><main class="conteudo">
  <div class="titulo"><div><span class="sobretitulo">PLANEJAMENTO FINANCEIRO</span><h1>Calendário financeiro</h1><p>Seus compromissos e movimentações, organizados por dia.</p></div></div>
  <div class="resumo">
    <div class="resumo-card"><span>Receitas previstas</span><strong class="verde">{{ moeda(total.receitasPrevistas) }}</strong><small>Compromissos cadastrados, sem movimentação</small></div>
    <div class="resumo-card"><span>Despesas previstas</span><strong class="vermelho">{{ moeda(total.despesasPrevistas) }}</strong><small>Compromissos cadastrados, sem movimentação</small></div>
    <div class="resumo-card"><span>Lançamentos registrados</span><strong>{{ total.registrados }}</strong><small>Registros realizados no histórico financeiro</small></div>
  </div>
  <section class="painel">
    <div class="cabecalho"><div><span class="sobretitulo">VISÃO MENSAL</span><h2>{{ titulo }}</h2></div>
      <div class="controles"><button type="button" aria-label="Mês anterior" @click="navegar(-1)">‹</button><button type="button" aria-label="Próximo mês" @click="navegar(1)">›</button></div>
    </div>
    <p v-if="carregando" class="mensagem">Carregando eventos...</p>
    <div class="dias"><strong v-for="d in ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']" :key="d">{{ d }}</strong></div>
    <div class="grade"><div v-for="(dia,i) in celulas" :key="i" :class="['celula',{'fora':!dia,'hoje':dia && dataISO(dia)===new Date().toLocaleDateString('sv-SE'),'com-eventos':dia && !!(porDia[dataISO(dia)]||[]).length,'selecionada':dia && selecionado===dataISO(dia)}]">
      <template v-if="dia">
        <button v-if="(porDia[dataISO(dia)]||[]).length" type="button" class="numero dia-ativo" :aria-label="'Abrir eventos de '+formatarData(dataISO(dia))" @click="abrirDia(dataISO(dia))">{{ dia }}</button>
        <span v-else class="numero">{{ dia }}</span>
        <button v-for="e in (porDia[dataISO(dia)]||[]).slice(0,2)" :key="(e.recorrencia?'r':'t')+e.id" type="button" :class="['evento-preview',classe(e)]" :title="e.titulo+' — '+moeda(e.valor)" @click="abrir(e)">
          <span class="evento-nome">{{ e.titulo }}</span><span class="evento-valor">{{ moeda(e.valor) }}</span>
        </button>
        <button v-if="(porDia[dataISO(dia)]||[]).length>2" type="button" class="mais" @click="abrirDia(dataISO(dia))">+{{ porDia[dataISO(dia)].length-2 }} eventos</button>
        <button v-if="(porDia[dataISO(dia)]||[]).length" type="button" class="selecionar-dia" :aria-label="'Ver eventos de '+formatarData(dataISO(dia))" @click="abrirDia(dataISO(dia))">Ver eventos</button>
      </template>
    </div></div>
  </section>
  <div v-if="selecionado" class="overlay overlay-dia" @click.self="fecharDia">
    <section class="modal modal-dia" role="dialog" aria-modal="true" :aria-label="'Eventos de '+formatarData(selecionado)" @keydown.esc="fecharDia">
      <div class="cabecalho">
        <div><span class="sobretitulo">AGENDA DO DIA</span><h2>Eventos de {{ formatarData(selecionado) }}</h2></div>
        <button class="fechar-dia" type="button" aria-label="Fechar eventos" @click="fecharDia">Fechar</button>
      </div>
      <div class="lista-eventos">
        <button v-for="(e, i) in porDia[selecionado] || []" :key="(e.recorrencia?'r':'t')+e.id+'-'+i" type="button" class="linha-evento" @click="abrir(e)">
          <span class="evento-info"><strong>{{ e.titulo }}</strong><small>{{ e.categoria || e.tipo }} · {{ status(e) }}</small></span>
          <strong :class="['evento-montante',classe(e)]">{{ moeda(e.valor) }}</strong>
        </button>
      </div>
      <p class="rodape-dia">Selecione um evento para consultar seus detalhes.</p>
    </section>
  </div>
  <div v-if="detalhe" class="overlay overlay-detalhe" @click.self="fechar">
    <section class="modal" role="dialog" aria-modal="true" aria-label="Detalhes do lançamento" @keydown.esc="fechar">
      <div class="cabecalho"><span class="sobretitulo">DETALHES DO EVENTO</span><button class="fechar-dia" @click="fechar" aria-label="Fechar detalhes">✕</button></div>
      <h2>{{ detalhe.titulo }}</h2><strong :class="['valor-detalhe',classe(detalhe)]">{{ moeda(detalhe.valor) }}</strong>
      <dl><div><dt>Data</dt><dd>{{ formatarData(detalhe.vencimento || detalhe.data?.slice(0,10)) }}</dd></div>
        <div><dt>Tipo</dt><dd>{{ detalhe.tipo==='receita'?'Receita':'Despesa' }}</dd></div>
        <div><dt>Categoria</dt><dd>{{ detalhe.categoria || 'Não informada' }}</dd></div>
        <div><dt>Situação</dt><dd>{{ status(detalhe) }}</dd></div></dl>
      <button v-if="detalhe.recorrencia" class="confirmar" type="button" @click="editarRecorrencia">Editar recorrência</button>
      
    </section>
  </div>
</main></div></div>
</template>
<style scoped>
.layout{display:flex;min-height:100vh;background:var(--opes-paper)}.principal{flex:1;min-width:0}.conteudo{max-width:1200px;margin:auto;padding:30px 24px 140px;color:var(--opes-ink)}.sobretitulo{font-size:11px;font-weight:800;letter-spacing:1.4px;color:var(--opes-forest)}h1{font-size:30px;margin:8px 0 4px}h2{font-size:20px;margin:5px 0;text-transform:capitalize}.titulo p,.mensagem{color:var(--opes-forest)}.resumo{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:26px 0}.resumo-card{display:flex;flex-direction:column;gap:8px;background:var(--opes-paper);border:1px solid var(--opes-border);border-radius:16px;padding:20px}.resumo-card span,.resumo-card small{color:var(--opes-forest)}.resumo-card strong{font-size:24px}.verde{color:var(--opes-forest)}.vermelho{color:var(--opes-danger)}.painel{background:var(--opes-paper);border:1px solid var(--opes-border);border-radius:16px;padding:20px;margin-top:20px;box-shadow:0 4px 24px #0f172a07}.cabecalho{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:20px}.controles{display:flex;gap:8px}.controles button,.fechar-dia{border:1px solid var(--opes-cream);background:var(--opes-paper);border-radius:10px;padding:8px 14px;cursor:pointer;color:var(--opes-forest);font-weight:700}.controles button{font-size:22px}.dias,.grade{display:grid;grid-template-columns:repeat(7,minmax(0,1fr))}.dias{text-align:center;color:var(--opes-forest);font-size:12px;padding-bottom:10px}.celula{position:relative;min-width:0;min-height:130px;padding:10px 6px;border:1px solid var(--opes-cream);display:flex;flex-direction:column;gap:5px}.celula.fora{background:var(--opes-paper)}.celula.hoje{background:var(--opes-cream)}.numero{font-size:12px;font-weight:750;color:var(--opes-ink);padding:2px 4px}.evento-preview{display:flex;flex-direction:column;align-items:flex-start;gap:2px;border:0;border-left:3px solid;border-radius:6px;padding:6px;text-align:left;min-width:0;cursor:pointer}.evento-preview.entrada{background:var(--opes-cream);border-color:var(--opes-forest);color:var(--opes-forest)}.evento-preview.saida{background:var(--opes-paper);border-color:var(--opes-danger);color:var(--opes-danger)}.evento-nome{font-size:11px;font-weight:750;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.evento-valor{font-size:10px}.mais,.selecionar-dia{background:transparent;color:var(--opes-forest);border:0;text-align:left;font-size:11px;cursor:pointer;padding:2px 4px}.selecionar-dia{margin-top:auto}.lista .linha{display:flex;justify-content:space-between;align-items:center;gap:14px;width:100%;padding:14px 6px;background:white;border:0;border-top:1px solid var(--opes-cream);text-align:left;cursor:pointer}.linha span{display:flex;flex-direction:column;gap:4px}.linha small{color:var(--opes-forest)}.overlay{position:fixed;inset:0;background:#0f172a85;z-index:3000;display:flex;justify-content:center;align-items:center;padding:20px}.modal{background:var(--opes-paper);color:var(--opes-ink);border-radius:18px;padding:24px;width:100%;max-width:460px;box-shadow:0 20px 60px #0003}.valor-detalhe{font-size:30px;display:block;margin:12px 0}.valor-detalhe.entrada{color:var(--opes-forest)}.valor-detalhe.saida{color:var(--opes-danger)}dl div{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--opes-cream)}dt{color:var(--opes-forest)}dd{font-weight:600;margin:0}.confirmar{background:var(--opes-forest);border:0;border-radius:9px;color:white;padding:12px 16px;margin-top:22px;width:100%;cursor:pointer}.erro{color:var(--opes-danger)}@media(max-width:850px){.conteudo{padding:20px 12px 130px}.resumo{grid-template-columns:1fr}.painel{padding:12px}.celula{min-height:85px;padding:5px 2px}.evento-valor{display:none}.evento-preview{padding:3px}.evento-nome{font-size:9px}.selecionar-dia{font-size:9px}.numero{font-size:11px}.dias{font-size:10px}} 
.celula.com-eventos{border-color:var(--opes-sand)}.celula.selecionada{outline:2px solid var(--opes-forest);outline-offset:-2px}.dia-ativo{border:0;background:transparent;text-align:left;cursor:pointer;color:var(--opes-forest);font-weight:800}.dia-ativo:hover{text-decoration:underline}

.overlay-dia{z-index:3000;background:rgba(6,17,12,.72);backdrop-filter:blur(5px)}
.overlay-detalhe{z-index:3010}
.modal-dia{max-width:580px;max-height:min(80vh,720px);display:flex;flex-direction:column;gap:6px;border:1px solid var(--opes-border)}
.modal-dia .cabecalho{margin-bottom:12px;align-items:flex-start}
.modal-dia h2{margin-top:7px}
.lista-eventos{overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding:2px}
.linha-evento{display:flex;justify-content:space-between;align-items:center;gap:16px;text-align:left;padding:16px;border:1px solid var(--opes-border);border-radius:12px;background:var(--opes-paper);color:var(--opes-ink);cursor:pointer}
.linha-evento:hover{border-color:var(--opes-forest)}
.evento-info{display:flex;flex-direction:column;gap:5px;min-width:0}
.evento-info strong{overflow-wrap:anywhere}
.evento-info small,.rodape-dia{color:var(--opes-muted);font-size:12px}
.evento-montante{white-space:nowrap}
.evento-montante.entrada{color:var(--opes-forest)}
.evento-montante.saida{color:var(--opes-danger)}
.rodape-dia{margin:10px 2px 0}
@media(max-width:520px){.modal-dia{padding:18px}.linha-evento{padding:12px;gap:9px}.evento-montante{font-size:13px}}

:root[data-theme="dark"] .modal-dia .linha-evento{background:#263d32!important;border-color:#476452!important;color:#edf5ee!important}
:root[data-theme="dark"] .modal-dia .linha-evento:hover{background:#304c3d!important;border-color:#a3cdb4!important}
:root[data-theme="dark"] .modal-dia .evento-info strong{color:#edf5ee!important}
:root[data-theme="dark"] .modal-dia .evento-info small{color:#bdd3c4!important}
:root[data-theme="dark"] .modal-dia .evento-montante.entrada{color:#a5e1bd!important}
:root[data-theme="dark"] .modal-dia .evento-montante.saida{color:#ffaaa1!important}
:root[data-theme="dark"] .modal-dia .fechar-dia{background:#344d3e!important;color:#f1f5ef!important;border-color:#52715d!important}
</style>
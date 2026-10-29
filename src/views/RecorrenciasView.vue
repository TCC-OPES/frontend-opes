<script setup>
import { notify, confirmAction } from '@/services/toast'

import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import SideBarComponent from '@/components/SideBarComponent.vue'

const modelo = () => ({ titulo: '', categoria: '', tipo: 'despesa', valor: '', frequencia: 'mensal', primeiro_vencimento: '', data_fim: null, numero_parcelas: null })
const route = useRoute()
const formulario = ref(modelo())
const lista = ref([])
const ocorrencias = ref([])
const carregando = ref(false)
const salvando = ref(false)
const erro = ref('')
const mensagem = ref('')
watch(erro, v => { if (v) notify.error(v) })
watch(mensagem, v => { if (v) notify.success(v) })
const edicao = ref(null)
const hoje = new Date()
const ano = ref(hoje.getFullYear())
const mes = ref(hoje.getMonth())
const ativas = computed(() => lista.value.filter(item => item.ativa).length)
const vencimentoFinal = computed(() => {
  const quantidade = Number(formulario.value.numero_parcelas)
  if (!quantidade || !formulario.value.primeiro_vencimento || formulario.value.frequencia !== 'mensal') return ''
  const [anoInicial, mesInicial, diaInicial] = formulario.value.primeiro_vencimento.split('-').map(Number)
  const base = new Date(anoInicial, mesInicial - 1 + quantidade - 1, 1)
  const ultimo = Math.min(diaInicial, new Date(base.getFullYear(), base.getMonth()+1, 0).getDate())
  return [String(ultimo).padStart(2, '0'), String(base.getMonth()+1).padStart(2, '0'), base.getFullYear()].join('/')
})
const formatarMoeda = v => Number(v).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
const dataISO = dia => [ano.value, String(mes.value + 1).padStart(2, '0'), String(dia).padStart(2, '0')].join('-')
const periodo = computed(() => ({
  inicio: dataISO(1),
  fim: dataISO(new Date(ano.value, mes.value + 1, 0).getDate()),
}))
const tituloPeriodo = computed(() => new Date(ano.value, mes.value, 1).toLocaleDateString('pt-BR', {month: 'long', year: 'numeric'}))
const totais = computed(() => ocorrencias.value.reduce((s, o) => {
  s[o.tipo === 'receita' ? 'receitas' : 'despesas'] += Number(o.valor)
  return s
}, { receitas: 0, despesas: 0 }))

function normalizar(data) { return Array.isArray(data) ? data : (data.results || []) }
function erroAPI(error) {
  if (error.response?.status === 404) {
    return 'A API de contas recorrentes retornou 404. O servidor pode estar usando uma versão antiga do backend ou uma URL incorreta. Confira o deploy e VITE_API_URL.'
  }
  if (error.response?.status === 401) {
    return 'Sua sessão expirou. Entre novamente para acessar as contas recorrentes.'
  }
  const dado = error.response?.data
  if (typeof dado?.detail === 'string') return dado.detail
  if (dado && typeof dado === 'object') return Object.values(dado).flat().join(' ')
  return 'Não foi possível concluir a operação.'
}
async function carregar() {
  carregando.value = true
  erro.value = ''
  try {
    const [r, o] = await Promise.all([
      api.get('/api/recorrencias/'),
      api.get('/api/recorrencias/ocorrencias/', {params: periodo.value}),
    ])
    lista.value = normalizar(r.data)
    ocorrencias.value = normalizar(o.data)
  } catch (e) { erro.value = erroAPI(e) }
  finally { carregando.value = false }
}
function editar(item) {
  edicao.value = item.id
  formulario.value = {
    titulo: item.titulo, categoria: item.categoria, tipo: item.tipo,
    valor: item.valor, frequencia: item.frequencia,
    primeiro_vencimento: item.primeiro_vencimento, data_fim: item.data_fim, numero_parcelas: item.numero_parcelas,
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function cancelarEdicao() { edicao.value = null; formulario.value = modelo() }
async function salvar() {
  salvando.value = true
  erro.value = ''; mensagem.value = ''
  try {
    const payload = {...formulario.value, data_fim: formulario.value.numero_parcelas ? null : formulario.value.data_fim || null, numero_parcelas: formulario.value.numero_parcelas ? Number(formulario.value.numero_parcelas) : null}
    if (edicao.value) await api.patch('/api/recorrencias/' + edicao.value + '/', payload)
    else await api.post('/api/recorrencias/', payload)
    mensagem.value = edicao.value ? 'Recorrência atualizada.' : 'Recorrência cadastrada.'
    cancelarEdicao()
    await carregar()
  } catch (e) { erro.value = erroAPI(e) }
  finally { salvando.value = false }
}
async function alternar(item) {
  erro.value = ''
  try {
    await api.patch('/api/recorrencias/' + item.id + '/', {ativa: !item.ativa})
    await carregar()
  } catch (e) { erro.value = erroAPI(e) }
}
async function encerrar(item) {
  if (!(await confirmAction('Encerrar essa recorrência? Os pagamentos já confirmados serão preservados.'))) return
  erro.value = ''
  try {
    await api.delete('/api/recorrencias/' + item.id + '/')
    await carregar()
  } catch (e) { erro.value = erroAPI(e) }
}
async function mudarMes(direcao) {
  const data = new Date(ano.value, mes.value + direcao, 1)
  ano.value = data.getFullYear()
  mes.value = data.getMonth()
  await carregar()
}
onMounted(async () => {
  await carregar()
  if (route.query.editar) {
    const item = lista.value.find(r => String(r.id) === String(route.query.editar))
    if (item) editar(item)
    else notify.warning('Esta recorrência não está disponível para edição.')
  }
})
</script>

<template>
  <div class="layout">
    <SideBarComponent class="sidebar" />
    <div class="principal">
      
      <main class="conteudo entrada-pagina">
        <header><h1>Contas recorrentes</h1><p>Controle despesas e receitas que se repetem.</p></header>

        <form class="painel formulario" @submit.prevent="salvar">
          <h2>{{ edicao ? 'Editar recorrência' : 'Nova recorrência' }}</h2>
          <p v-if="edicao" class="nota">Depois de gerar vencimentos, os dados financeiros ficam bloqueados para preservar o histórico. Você ainda pode pausar ou definir uma data de término.</p>
          <label>Descrição <input v-model.trim="formulario.titulo" required maxlength="255" placeholder="Ex.: Internet" /></label>
          <label>Categoria <input v-model.trim="formulario.categoria" required maxlength="100" placeholder="Ex.: Moradia" /></label>
          <label>Tipo <select v-model="formulario.tipo"><option value="despesa">Despesa</option><option value="receita">Receita</option></select></label>
          <label>Valor (R$) <input v-model="formulario.valor" type="number" step="0.01" min="0.01" required /></label>
          <label>Frequência <select v-model="formulario.frequencia"><option value="mensal">Mensal</option><option value="semanal">Semanal</option><option value="anual">Anual</option></select></label>
          <label>Primeiro vencimento <input v-model="formulario.primeiro_vencimento" type="date" required /></label>
          <label>Último vencimento (opcional) <input v-model="formulario.data_fim" type="date" :disabled="!!formulario.numero_parcelas" /></label>
          <label v-if="formulario.frequencia==='mensal'">Quantidade de parcelas (opcional) <input v-model.number="formulario.numero_parcelas" type="number" min="1" max="360" step="1" placeholder="Ex.: 12" /></label>
          <p v-if="vencimentoFinal" class="nota">Última parcela prevista para {{ vencimentoFinal }}. Nenhuma cobrança será realizada pelo OPES.</p>
          <div class="acoes"><button :disabled="salvando" type="submit">{{ salvando ? 'Salvando...' : edicao ? 'Salvar alterações' : 'Cadastrar' }}</button>
            <button v-if="edicao" type="button" class="secundario" @click="cancelarEdicao">Cancelar</button></div>
        </form>

        <section class="painel">
          <h2>Minhas recorrências <span class="contagem">{{ ativas }} ativas</span></h2>
          <p v-if="carregando">Carregando...</p>
          <p v-else-if="!lista.length">Nenhuma recorrência cadastrada.</p>
          <article v-for="item in lista" :key="item.id" class="item">
            <div><strong>{{ item.titulo }}</strong><p>{{ item.categoria }} · {{ item.frequencia }} · início {{ item.primeiro_vencimento }} · {{ item.numero_parcelas ? item.numero_parcelas + ' parcelas' : 'sem parcelamento' }}</p>
              <span :class="['status', item.ativa ? 'ativo' : 'inativo']">{{ item.ativa ? 'Ativa' : 'Pausada / encerrada' }}</span></div>
            <div class="direita"><strong>{{ formatarMoeda(item.valor) }}</strong>
              <div class="botoes"><button type="button" class="secundario" @click="editar(item)">Editar</button>
                <button type="button" class="secundario" @click="alternar(item)">{{ item.ativa ? 'Pausar' : 'Reativar' }}</button>
                <button v-if="item.ativa" type="button" class="perigo" @click="encerrar(item)">Encerrar</button></div></div>
          </article>
        </section>

        <section class="painel">
          <div class="navegar"><h2>Vencimentos — {{ tituloPeriodo }}</h2>
            <div class="botoes"><button type="button" class="secundario" @click="mudarMes(-1)" aria-label="Mês anterior">‹</button>
            <button type="button" class="secundario" @click="mudarMes(1)" aria-label="Próximo mês">›</button></div></div>
          <p class="nota">Previstos: receitas {{ formatarMoeda(totais.receitas) }} · despesas {{ formatarMoeda(totais.despesas) }}. As contas são previsões; registre manualmente as movimentações na tela Transações.</p>
          <p v-if="!carregando && !ocorrencias.length">Nenhum vencimento neste mês.</p>
          <article v-for="item in ocorrencias" :key="item.id" class="item">
            <div><strong>{{ item.titulo }}</strong><p>{{ item.vencimento }} · {{ item.tipo }} · {{ item.categoria }} <span v-if="item.numero_parcelas">· parcela {{ item.parcela_atual }}/{{ item.numero_parcelas }}</span></p>
              <span :class="['status', item.status === 'confirmada' ? 'ativo' : 'inativo']">{{ item.status }}</span></div>
            <div class="direita"><strong>{{ formatarMoeda(item.valor) }}</strong>
              </div>
          </article>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout{display:flex;min-height:100vh;height:auto;overflow:visible;background:var(--opes-paper)}.principal{flex:1;min-width:0;min-height:100vh;height:auto;overflow:visible}.conteudo{max-width:1140px;margin:auto;padding:32px 24px 160px;color:var(--opes-ink)}h1{font-size:28px;margin:0 0 6px}h2{font-size:20px;margin:0 0 16px}header p,.nota,.item p{color:var(--opes-forest);font-size:14px}.nota{grid-column:1/-1;margin:0 0 12px}.painel{background:white;border:1px solid var(--opes-cream);border-radius:14px;padding:24px;margin-top:24px}.formulario{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px}.formulario h2{grid-column:1/-1}.acoes{grid-column:1/-1;display:flex;gap:8px}label{display:flex;flex-direction:column;gap:6px;font-size:14px}input,select{padding:12px;border:1px solid var(--opes-sand);border-radius:8px;background:white;min-width:0}button{background:var(--opes-forest);color:white;border:0;border-radius:8px;padding:10px 14px;cursor:pointer}button:disabled{opacity:.5;cursor:not-allowed}.secundario{background:var(--opes-cream);color:var(--opes-ink)}.perigo{background:var(--opes-cream);color:var(--opes-danger)}.item{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:16px 0;border-top:1px solid var(--opes-cream)}.item p{margin:6px 0}.direita{text-align:right}.botoes{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-top:10px}.status{font-size:12px;border-radius:20px;padding:3px 9px}.ativo{background:var(--opes-cream);color:var(--opes-forest)}.inativo{background:var(--opes-paper);color:var(--opes-forest)}.contagem{font-size:13px;font-weight:normal;color:var(--opes-forest)}.navegar{display:flex;align-items:center;justify-content:space-between}.navegar h2{text-transform:capitalize;margin:0}.alerta{padding:12px;border-radius:8px}.erro{color:var(--opes-danger);background:var(--opes-cream)}.sucesso{color:var(--opes-forest);background:var(--opes-cream)}@media(max-width:800px){.layout{display:block;min-height:100vh;height:auto}.conteudo{padding:20px 14px 140px;min-height:calc(100vh - 100px)}.item{align-items:flex-start;flex-direction:column}.direita{text-align:left}.botoes{justify-content:flex-start}}

.entrada-pagina { animation: entrada-pagina 0.6s ease-out both; }
@keyframes entrada-pagina { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>

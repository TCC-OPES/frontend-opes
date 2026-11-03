<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  UsersRound, UserRoundPlus, Wallet, ReceiptText, Plus, X,
  House, Crown, ArrowRight, RefreshCw, Users, ShieldCheck
} from '@lucide/vue'
import api from '@/services/api'
import { notify } from '@/services/toast'
import SideBarComponent from '@/components/SideBarComponent.vue'

const familias = ref([])
const selecionadaId = ref(null)
const carregando = ref(true)
const salvando = ref(false)
const modalAberto = ref(false)
const erro = ref('')
const erroFormulario = ref('')
const nomeNovaFamilia = ref('')

const moeda = valor => Number(valor || 0).toLocaleString('pt-BR', {
  style: 'currency', currency: 'BRL'
})
const lista = dados => Array.isArray(dados) ? dados : (dados?.results || [])

const familiaSelecionada = computed(() =>
  familias.value.find(f => String(f.id) === String(selecionadaId.value)) || null
)

// A API atual só entrega os campos básicos da família.
// Exibimos membros/despesas apenas quando esses dados existirem na resposta.
const membrosDisponiveis = computed(() => Array.isArray(familiaSelecionada.value?.membros))
const despesasDisponiveis = computed(() => Array.isArray(familiaSelecionada.value?.despesas))
const membros = computed(() => membrosDisponiveis.value ? familiaSelecionada.value.membros : [])
const despesas = computed(() => despesasDisponiveis.value ? familiaSelecionada.value.despesas : [])
const totalDespesas = computed(() => despesas.value.reduce((total, item) =>
  total + (Number(item.valor) || 0), 0))
const iniciais = nome => String(nome || '?').trim().split(/\s+/).slice(0, 2)
  .map(p => p[0]?.toUpperCase()).join('') || '?'
const nomeMembro = item => item.nome || item.usuario_nome || item.usuario?.name ||
  item.usuario?.nome || 'Membro'
const papelMembro = item => ({
  admin: 'Administrador', membro: 'Membro', dependente: 'Dependente'
})[item.papel] || 'Membro'
const nomePagador = despesa => despesa.pago_por_nome ||
  despesa.pago_por?.name || despesa.pago_por?.nome || 'Não informado'

async function carregarFamilias() {
  carregando.value = true
  erro.value = ''
  try {
    const resposta = await api.get('/api/familias/')
    familias.value = lista(resposta.data)
    if (!familias.value.some(f => String(f.id) === String(selecionadaId.value))) {
      selecionadaId.value = familias.value[0]?.id ?? null
    }
  } catch (e) {
    erro.value = 'Não foi possível carregar suas famílias.'
    notify.error(erro.value)
  } finally {
    carregando.value = false
  }
}
function abrirModal() {
  nomeNovaFamilia.value = ''
  erroFormulario.value = ''
  modalAberto.value = true
}
function fecharModal() {
  if (!salvando.value) modalAberto.value = false
}
async function criarFamilia() {
  if (salvando.value) return
  const nome = nomeNovaFamilia.value.trim()
  if (!nome) {
    erroFormulario.value = 'Informe o nome da família.'
    return
  }
  if (nome.length > 255) {
    erroFormulario.value = 'O nome deve ter até 255 caracteres.'
    return
  }
  salvando.value = true
  erroFormulario.value = ''
  try {
    const { data } = await api.post('/api/familias/', { nome })
    selecionadaId.value = data.id
    modalAberto.value = false
    notify.success('Família criada com sucesso!')
    await carregarFamilias()
  } catch (e) {
    erroFormulario.value = typeof e.response?.data?.nome?.[0] === 'string'
      ? e.response.data.nome[0]
      : 'Não foi possível criar a família. Tente novamente.'
  } finally {
    salvando.value = false
  }
}

onMounted(carregarFamilias)
</script>

<template>
  <div class="familia-layout">
    <SideBarComponent />
    <main class="familia-main">
      <div class="familia-content">
        <header class="pagina-header">
          <div class="titulo-grupo">
            <span class="sobrelinha">ORGANIZAÇÃO FINANCEIRA</span>
            <h1>Controle familiar</h1>
            <p>Um espaço para acompanhar e organizar as finanças da sua família.</p>
          </div>
          <button class="botao-principal criar-topo" type="button" @click="abrirModal">
            <Plus :size="18" /> Nova família
          </button>
        </header>

        <div v-if="erro" class="mensagem-erro" role="alert">
          <span>{{ erro }}</span>
          <button type="button" @click="carregarFamilias"><RefreshCw :size="16" /> Tentar novamente</button>
        </div>

        <template v-if="carregando">
          <div class="resumos" aria-label="Carregando informações">
            <div v-for="n in 3" :key="n" class="resumo-cartao carregando-cartao"></div>
          </div>
          <div class="painel vazio"><p>Carregando suas informações familiares...</p></div>
        </template>

        <template v-else-if="!erro">
          <section class="resumos" aria-label="Resumo familiar">
            <article class="resumo-cartao">
              <div class="resumo-topo"><span>Suas famílias</span><UsersRound :size="20" /></div>
              <strong>{{ familias.length }}</strong>
              <small>Grupos que você criou</small>
            </article>
            <article class="resumo-cartao">
              <div class="resumo-topo"><span>Membros da família</span><Users :size="20" /></div>
              <strong>{{ familiaSelecionada && membrosDisponiveis ? membros.length : '—' }}</strong>
              <small>{{ membrosDisponiveis ? 'Pessoas no grupo selecionado' : 'Dados ainda não disponíveis' }}</small>
            </article>
            <article class="resumo-cartao">
              <div class="resumo-topo"><span>Despesas compartilhadas</span><Wallet :size="20" /></div>
              <strong class="valor-destaque">{{ familiaSelecionada && despesasDisponiveis ? moeda(totalDespesas) : '—' }}</strong>
              <small>{{ despesasDisponiveis ? 'Total da família selecionada' : 'Dados ainda não disponíveis' }}</small>
            </article>
          </section>

          <section v-if="!familias.length" class="painel convite">
            <div class="icone-convite"><House :size="28" /></div>
            <h2>Comece criando sua família</h2>
            <p>Crie um grupo para organizar as informações financeiras de quem divide o dia a dia com você.</p>
            <button class="botao-principal" type="button" @click="abrirModal"><Plus :size="18" /> Criar primeira família</button>
          </section>

          <template v-else>
            <section class="painel painel-familias" aria-labelledby="minhas-familias">
              <div class="painel-cabecalho">
                <div>
                  <h2 id="minhas-familias">Minhas famílias</h2>
                  <p>Selecione um grupo para visualizar suas informações.</p>
                </div>
                <button class="botao-secundario" type="button" @click="abrirModal"><Plus :size="17" /> Criar família</button>
              </div>
              <div class="familias-grade">
                <button
                  v-for="familia in familias" :key="familia.id"
                  type="button" class="item-familia"
                  :class="{ selecionado: String(familia.id) === String(selecionadaId) }"
                  :aria-pressed="String(familia.id) === String(selecionadaId)"
                  @click="selecionadaId = familia.id"
                >
                  <span class="familia-avatar"><House :size="22" /></span>
                  <span class="familia-texto">
                    <strong>{{ familia.nome }}</strong>
                    <small><ShieldCheck :size="13" /> Grupo familiar</small>
                  </span>
                  <ArrowRight :size="19" class="seta-familia" />
                </button>
              </div>
            </section>

            <div class="detalhes-grade">
              <section class="painel membros-painel" aria-labelledby="titulo-membros">
                <div class="painel-cabecalho">
                  <div>
                    <h2 id="titulo-membros">Membros da família</h2>
                    <p>{{ familiaSelecionada?.nome }}</p>
                  </div>
                  <span class="indicador"><UsersRound :size="18" /></span>
                </div>
                <div v-if="membrosDisponiveis && membros.length" class="membros-grade">
                  <article v-for="(membro, i) in membros" :key="membro.id || i" class="membro-cartao">
                    <span class="membro-avatar">{{ iniciais(nomeMembro(membro)) }}</span>
                    <div class="membro-dados">
                      <strong>{{ nomeMembro(membro) }}</strong>
                      <small><Crown v-if="membro.papel === 'admin'" :size="13" /> {{ papelMembro(membro) }}</small>
                    </div>
                  </article>
                </div>
                <div v-else class="vazio-interno">
                  <div class="icone-vazio"><UserRoundPlus :size="23" /></div>
                  <h3>{{ membrosDisponiveis ? 'Nenhum membro cadastrado' : 'Membros em breve' }}</h3>
                  <p>{{ membrosDisponiveis ? 'Os integrantes desta família aparecerão aqui.' : 'O cadastro e a consulta de membros dependem da integração dessa funcionalidade no backend.' }}</p>
                </div>
              </section>

              <section class="painel despesas-painel" aria-labelledby="titulo-despesas">
                <div class="painel-cabecalho">
                  <div>
                    <h2 id="titulo-despesas">Despesas compartilhadas</h2>
                    <p>Organize os gastos do grupo em um só lugar.</p>
                  </div>
                  <span class="indicador"><ReceiptText :size="18" /></span>
                </div>
                <div v-if="despesasDisponiveis && despesas.length" class="lista-despesas">
                  <article v-for="(despesa, i) in despesas" :key="despesa.id || i" class="despesa-item">
                    <span class="icone-despesa"><ReceiptText :size="19" /></span>
                    <div class="despesa-info">
                      <strong>{{ despesa.titulo }}</strong>
                      <small>{{ despesa.categoria || 'Sem categoria' }} · Pago por: {{ nomePagador(despesa) }}</small>
                    </div>
                    <strong class="despesa-valor">{{ moeda(despesa.valor) }}</strong>
                  </article>
                </div>
                <div v-else class="vazio-interno">
                  <div class="icone-vazio"><ReceiptText :size="23" /></div>
                  <h3>{{ despesasDisponiveis ? 'Sem despesas compartilhadas' : 'Despesas em breve' }}</h3>
                  <p>{{ despesasDisponiveis ? 'Quando existirem gastos registrados, eles aparecerão aqui.' : 'A visualização e o cadastro de despesas compartilhadas dependem de endpoints adicionais no backend.' }}</p>
                </div>
              </section>
            </div>
          </template>
        </template>
      </div>
    </main>

    <div v-if="modalAberto" class="modal-fundo" @click.self="fecharModal">
      <section class="modal-familia" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-familia" @keydown.esc="fecharModal">
        <div class="modal-cabecalho">
          <div>
            <h2 id="titulo-modal-familia">Criar família</h2>
            <p>Escolha um nome para seu novo grupo familiar.</p>
          </div>
          <button class="fechar-modal" type="button" aria-label="Fechar" @click="fecharModal"><X :size="20" /></button>
        </div>
        <form @submit.prevent="criarFamilia">
          <label for="nome-familia">Nome da família</label>
          <input id="nome-familia" v-model="nomeNovaFamilia" type="text" maxlength="255" placeholder="Ex.: Família Silva" required autofocus />
          <p v-if="erroFormulario" class="erro-formulario" role="alert">{{ erroFormulario }}</p>
          <div class="modal-acoes">
            <button type="button" class="botao-cancelar" :disabled="salvando" @click="fecharModal">Cancelar</button>
            <button type="submit" class="botao-principal" :disabled="salvando">
              {{ salvando ? 'Criando...' : 'Criar família' }}
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped>
.familia-layout{display:flex;min-height:100dvh;background:var(--opes-cream);color:var(--opes-ink)}
.familia-main{min-width:0;flex:1}
.familia-content{max-width:1480px;margin:auto;padding:44px 32px 110px}
.pagina-header{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:26px}
.sobrelinha{font-size:11px;font-weight:800;letter-spacing:1.45px;color:var(--opes-caramel-dark)}
.titulo-grupo h1{font-size:30px;margin:6px 0 7px;line-height:1.2;font-weight:800;color:var(--opes-ink)}
.titulo-grupo p{margin:0;color:var(--opes-muted);font-size:14px}
.botao-principal,.botao-secundario,.botao-cancelar{display:inline-flex;align-items:center;justify-content:center;gap:9px;border-radius:10px;padding:12px 17px;font-size:13px;font-weight:750;cursor:pointer;white-space:nowrap;transition:filter .2s ease,transform .2s ease}
.botao-principal{background:var(--opes-forest)!important;color:var(--opes-paper)!important;border:1px solid var(--opes-forest)!important}
.botao-principal:hover,.botao-secundario:hover{filter:brightness(.94)}
.botao-secundario{background:var(--opes-forest-soft)!important;border:1px solid var(--opes-border)!important;color:var(--opes-ink)!important}
.botao-cancelar{background:var(--opes-cream)!important;color:var(--opes-ink)!important;border:1px solid var(--opes-border)!important}
.resumos{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-bottom:24px}
.resumo-cartao{min-height:140px;min-width:0;background:var(--opes-paper);border:1px solid var(--opes-border);border-radius:16px;padding:22px 24px;display:flex;flex-direction:column}
.resumo-topo{display:flex;align-items:center;justify-content:space-between;color:var(--opes-muted);font-size:13px;gap:8px}
.resumo-topo svg{color:var(--opes-forest)}
.resumo-cartao>strong{font-size:29px;font-weight:800;line-height:1.3;margin:16px 0 5px;color:var(--opes-ink)}
.resumo-cartao .valor-destaque{color:var(--opes-forest)}
.resumo-cartao small{color:var(--opes-muted);font-size:11px}
.painel{background:var(--opes-paper);border:1px solid var(--opes-border);border-radius:17px;padding:25px;min-width:0}
.painel-cabecalho{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:23px}
.painel-cabecalho h2{font-size:18px;color:var(--opes-ink);margin:0 0 5px;font-weight:750}
.painel-cabecalho p{font-size:12px;color:var(--opes-muted);margin:0}
.painel-familias{margin-bottom:23px}
.familias-grade{display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:12px}
.item-familia{display:flex;align-items:center;gap:13px;text-align:left;background:var(--opes-cream)!important;color:var(--opes-ink)!important;border:1px solid var(--opes-border)!important;border-radius:13px;padding:15px!important;min-width:0;transition:border-color .2s,background-color .2s}
.item-familia:hover,.item-familia.selecionado{border-color:var(--opes-forest)!important;background:var(--opes-forest-soft)!important}
.familia-avatar{width:44px;height:44px;flex-shrink:0;display:grid;place-items:center;background:var(--opes-forest);color:var(--opes-paper);border-radius:12px}
.familia-texto{display:flex;flex-direction:column;gap:5px;min-width:0;flex:1}
.familia-texto strong{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:13px}
.familia-texto small{display:flex;align-items:center;gap:5px;color:var(--opes-muted);font-size:11px}
.seta-familia{flex-shrink:0;color:var(--opes-muted)}
.detalhes-grade{display:grid;grid-template-columns:1fr 1.2fr;gap:22px;align-items:stretch}
.indicador{display:grid;place-items:center;width:38px;height:38px;flex-shrink:0;border-radius:10px;background:var(--opes-forest-soft);color:var(--opes-forest)}
.vazio-interno{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:215px;padding:18px 15px;text-align:center;background:var(--opes-cream);border:1px dashed var(--opes-border);border-radius:13px}
.icone-vazio,.icone-convite{display:grid;place-items:center;width:49px;height:49px;background:var(--opes-forest-soft);color:var(--opes-forest);border-radius:13px;margin-bottom:13px}
.vazio-interno h3,.convite h2{font-size:15px;color:var(--opes-ink);margin:0 0 7px}
.vazio-interno p,.convite p{font-size:12px;line-height:1.6;color:var(--opes-muted);max-width:320px;margin:0}
.convite{display:flex;flex-direction:column;align-items:center;text-align:center;padding:70px 24px}
.convite h2{font-size:22px}
.convite p{max-width:430px;font-size:14px;margin:0 0 25px}
.membros-grade{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}
.membro-cartao{display:flex;align-items:center;gap:12px;background:var(--opes-cream);border:1px solid var(--opes-border);border-radius:12px;padding:16px;min-width:0}
.membro-avatar{width:40px;height:40px;display:grid;place-items:center;flex-shrink:0;border-radius:50%;background:var(--opes-forest);color:var(--opes-paper);font-size:13px;font-weight:750}
.membro-dados{min-width:0;display:flex;flex-direction:column;gap:5px}
.membro-dados strong{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.membro-dados small{font-size:11px;color:var(--opes-muted);display:flex;align-items:center;gap:5px}
.membro-dados small svg{color:var(--opes-caramel)}
.lista-despesas{display:flex;flex-direction:column;gap:9px}
.despesa-item{display:flex;align-items:center;gap:12px;padding:15px;background:var(--opes-cream);border-radius:12px;min-width:0}
.icone-despesa{width:38px;height:38px;display:grid;place-items:center;border-radius:10px;background:var(--opes-forest-soft);color:var(--opes-forest);flex-shrink:0}
.despesa-info{display:flex;flex:1;flex-direction:column;gap:5px;min-width:0}
.despesa-info strong{font-size:13px}
.despesa-info small{font-size:11px;color:var(--opes-muted)}
.despesa-valor{color:var(--opes-caramel-dark);font-size:14px;white-space:nowrap}
.mensagem-erro{border:1px solid var(--opes-danger);border-radius:12px;color:var(--opes-danger);padding:14px 18px;margin-bottom:20px;display:flex;justify-content:space-between;gap:15px}
.mensagem-erro button{display:inline-flex;align-items:center;gap:6px;border:none;background:transparent!important;color:inherit!important;font-weight:750}
.carregando-cartao{opacity:.45;animation:pulsar 1.2s ease-in-out infinite alternate}
@keyframes pulsar{to{opacity:.8}}
.modal-fundo{position:fixed;inset:0;display:grid;place-items:center;padding:18px;background:rgba(5,18,12,.72);z-index:3000;backdrop-filter:blur(3px)}
.modal-familia{width:100%;max-width:460px;max-height:90dvh;overflow-y:auto;background:var(--opes-paper);border:1px solid var(--opes-border);border-radius:18px;padding:24px;color:var(--opes-ink)}
.modal-cabecalho{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:23px}
.modal-cabecalho h2{font-size:20px;margin:0 0 5px}
.modal-cabecalho p{font-size:13px;color:var(--opes-muted);margin:0}
.fechar-modal{display:grid;place-items:center;background:transparent!important;border:0;color:var(--opes-ink)!important;padding:5px}
.modal-familia label{font-size:12px;font-weight:700;display:block;margin-bottom:9px}
.modal-familia input{width:100%;padding:12px 14px;border:1px solid var(--opes-border);border-radius:9px;background:var(--opes-cream);color:var(--opes-ink)}
.modal-acoes{display:flex;justify-content:flex-end;gap:10px;margin-top:24px}
.erro-formulario{font-size:12px;color:var(--opes-danger);margin:10px 0 0}
@media(max-width:1150px){.detalhes-grade{grid-template-columns:1fr}}
@media(max-width:1023px){.familia-content{padding:30px 20px 130px}}
@media(max-width:720px){.pagina-header{align-items:flex-start;flex-direction:column}.resumos{grid-template-columns:1fr;gap:11px}.resumo-cartao{min-height:120px;padding:18px}.familia-content{padding:24px 14px 130px}.painel{padding:18px}.painel-cabecalho{align-items:flex-start;flex-wrap:wrap}.criar-topo{width:100%}}
@media(max-width:420px){.modal-acoes{flex-direction:column-reverse}.modal-acoes button{width:100%}.despesa-item{flex-wrap:wrap}.despesa-valor{margin-left:50px}}
@media(prefers-reduced-motion:reduce){.carregando-cartao{animation:none}}
</style>

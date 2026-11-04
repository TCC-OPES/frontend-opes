<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import {
  UsersRound, UserRoundPlus, Wallet, ReceiptText, Plus, X,
  House, Crown, ArrowRight, RefreshCw, Users, ShieldCheck, Mail, Trash2, Check, Ban
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
const minhaContaId = ref(null)
const meusConvites = ref([])
const convitesEnviados = ref([])
const modalConviteAberto = ref(false)
const emailConvite = ref('')
const papelConvite = ref('membro')
const erroConvite = ref('')
const enviandoConvite = ref(false)
const carregandoConvites = ref(false)
const processandoConvite = ref(null)
const removendoMembro = ref(null)
const cancelandoConvite = ref(null)
const erroConvites = ref('')
const erroEnviados = ref('')

const moeda = valor => Number(valor || 0).toLocaleString('pt-BR', {
  style: 'currency', currency: 'BRL'
})
const lista = dados => Array.isArray(dados) ? dados : (dados?.results || [])

const familiaSelecionada = computed(() =>
  familias.value.find(f => String(f.id) === String(selecionadaId.value)) || null
)

// Os dados de membros e despesas vêm das famílias acessíveis ao usuário.
const membrosDisponiveis = computed(() => Array.isArray(familiaSelecionada.value?.membros))
const despesasDisponiveis = computed(() => Array.isArray(familiaSelecionada.value?.despesas))
const membros = computed(() => membrosDisponiveis.value ? familiaSelecionada.value.membros : [])
const despesas = computed(() => despesasDisponiveis.value ? familiaSelecionada.value.despesas : [])
const meuPapel = computed(() => {
  if (!familiaSelecionada.value || minhaContaId.value == null) return null
  if (String(familiaSelecionada.value.criador) === String(minhaContaId.value)) return 'admin'
  return membros.value.find(m => String(m.usuario) === String(minhaContaId.value))?.papel || null
})
const souAdmin = computed(() => meuPapel.value === 'admin')
const meuMembro = membro => String(membro.usuario) === String(minhaContaId.value)
const podeRemover = membro => minhaContaId.value != null &&
  String(membro.usuario) !== String(familiaSelecionada.value?.criador) &&
  (souAdmin.value || meuMembro(membro))
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

function mensagemApi(e, fallback) {
  const dados = e.response?.data
  if (typeof dados?.detail === 'string') return dados.detail
  if (typeof dados?.erro === 'string') return dados.erro
  if (typeof dados?.email?.[0] === 'string') return dados.email[0]
  if (typeof dados?.papel?.[0] === 'string') return dados.papel[0]
  return fallback
}
async function carregarMinhaConta() {
  try {
    const { data } = await api.get('/api/me/')
    minhaContaId.value = (data.data || data).id ?? null
  } catch {
    minhaContaId.value = null
  }
}
async function carregarMeusConvites() {
  carregandoConvites.value = true
  erroConvites.value = ''
  try {
    const { data } = await api.get('/api/familias/convites/')
    meusConvites.value = lista(data)
  } catch (e) {
    erroConvites.value = mensagemApi(e, 'Não foi possível consultar seus convites. Confira se o backend de famílias está atualizado.')
  } finally {
    carregandoConvites.value = false
  }
}
async function carregarConvitesEnviados() {
  convitesEnviados.value = []
  erroEnviados.value = ''
  if (!souAdmin.value || !selecionadaId.value) return
  try {
    const { data } = await api.get('/api/familias/' + selecionadaId.value + '/convites/')
    convitesEnviados.value = lista(data)
  } catch (e) {
    erroEnviados.value = mensagemApi(e, 'Não foi possível consultar os convites enviados.')
  }
}
function abrirModalConvite() {
  emailConvite.value = ''
  papelConvite.value = 'membro'
  erroConvite.value = ''
  modalConviteAberto.value = true
}
function fecharModalConvite() {
  if (!enviandoConvite.value) modalConviteAberto.value = false
}
async function enviarConvite() {
  if (enviandoConvite.value || !souAdmin.value) return
  const email = emailConvite.value.trim()
  if (!email) { erroConvite.value = 'Informe o e-mail da pessoa.'; return }
  enviandoConvite.value = true
  erroConvite.value = ''
  try {
    await api.post('/api/familias/' + selecionadaId.value + '/membros/', {
      email, papel: papelConvite.value
    })
    modalConviteAberto.value = false
    notify.success('Convite enviado! A pessoa poderá aceitar na página Família.')
    await carregarConvitesEnviados()
  } catch (e) {
    erroConvite.value = mensagemApi(e, 'Não foi possível enviar o convite.')
  } finally {
    enviandoConvite.value = false
  }
}
async function responderConvite(convite, acao) {
  if (processandoConvite.value != null) return
  processandoConvite.value = convite.id
  try {
    await api.post('/api/familias/convites/' + convite.id + '/responder/', { acao })
    notify.success(acao === 'aceitar' ? 'Você entrou na família!' : 'Convite recusado.')
    await Promise.all([carregarFamilias(), carregarMeusConvites()])
  } catch (e) {
    notify.error(mensagemApi(e, 'Não foi possível responder ao convite.'))
  } finally {
    processandoConvite.value = null
  }
}
async function removerMembro(membro) {
  if (!podeRemover(membro) || removendoMembro.value != null) return
  const sair = meuMembro(membro)
  if (!window.confirm(sair ? 'Deseja sair desta família?' : 'Remover este membro da família?')) return
  removendoMembro.value = membro.id
  try {
    await api.delete('/api/familias/' + selecionadaId.value + '/membros/' + membro.id + '/')
    notify.success(sair ? 'Você saiu da família.' : 'Membro removido.')
    await carregarFamilias()
  } catch (e) {
    notify.error(mensagemApi(e, 'Não foi possível remover o membro.'))
  } finally {
    removendoMembro.value = null
  }
}
async function cancelarConvite(convite) {
  if (!souAdmin.value || cancelandoConvite.value != null) return
  if (!window.confirm('Cancelar convite pendente para ' + convite.usuario_email + '?')) return
  cancelandoConvite.value = convite.id
  try {
    await api.delete('/api/familias/' + selecionadaId.value + '/convites/' + convite.id + '/')
    notify.success('Convite cancelado.')
    await carregarConvitesEnviados()
  } catch (e) {
    notify.error(mensagemApi(e, 'Não foi possível cancelar o convite.'))
  } finally {
    cancelandoConvite.value = null
  }
}
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

watch([selecionadaId, souAdmin], carregarConvitesEnviados)
onMounted(async () => {
  await carregarMinhaConta()
  await Promise.all([carregarFamilias(), carregarMeusConvites()])
})
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
          <section class="painel painel-convites" aria-labelledby="meus-convites">
            <div class="painel-cabecalho">
              <div><h2 id="meus-convites">Convites recebidos</h2><p>Participe de famílias que convidaram você pelo e-mail da sua conta.</p></div>
              <button class="botao-secundario" type="button" :disabled="carregandoConvites" @click="carregarMeusConvites">
                <RefreshCw :size="16" /> Atualizar
              </button>
            </div>
            <p v-if="carregandoConvites" class="texto-apoio">Consultando seus convites...</p>
            <div v-else-if="erroConvites" class="aviso-pequeno" role="alert">
              {{ erroConvites }} <button class="botao-secundario" type="button" @click="carregarMeusConvites">Tentar novamente</button>
            </div>
            <div v-else-if="meusConvites.length" class="lista-convites">
              <article v-for="convite in meusConvites" :key="convite.id" class="convite-item">
                <span class="icone-despesa"><Mail :size="19" /></span>
                <div class="despesa-info">
                  <strong>{{ convite.familia_nome }}</strong>
                  <small>Convidado por {{ convite.convidado_por_nome || 'um administrador' }} · {{ papelMembro(convite) }}</small>
                </div>
                <div class="acoes-convite">
                  <button class="botao-principal" type="button" :disabled="processandoConvite !== null" @click="responderConvite(convite, 'aceitar')"><Check :size="15" /> Aceitar</button>
                  <button class="botao-cancelar" type="button" :disabled="processandoConvite !== null" @click="responderConvite(convite, 'recusar')"><Ban :size="15" /> Recusar</button>
                </div>
              </article>
            </div>
            <p v-else class="texto-apoio">Nenhum convite pendente no momento.</p>
          </section>
          <section class="resumos" aria-label="Resumo familiar">
            <article class="resumo-cartao">
              <div class="resumo-topo"><span>Suas famílias</span><UsersRound :size="20" /></div>
              <strong>{{ familias.length }}</strong>
              <small>Grupos criados ou dos quais você participa</small>
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
                  <button v-if="souAdmin" class="botao-principal" type="button" @click="abrirModalConvite">
                    <UserRoundPlus :size="17" /> Convidar por e-mail
                  </button>
                  <span v-else class="indicador"><UsersRound :size="18" /></span>
                </div>
                <div v-if="membrosDisponiveis && membros.length" class="membros-grade">
                  <article v-for="(membro, i) in membros" :key="membro.id || i" class="membro-cartao">
                    <span class="membro-avatar">{{ iniciais(nomeMembro(membro)) }}</span>
                    <div class="membro-dados">
                      <strong>{{ nomeMembro(membro) }}</strong>
                      <small><Crown v-if="membro.papel === 'admin'" :size="13" /> {{ papelMembro(membro) }}</small>
                      <small v-if="membro.email">{{ membro.email }}</small>
                    </div>
                    <button v-if="podeRemover(membro)" type="button" class="icone-acao" :disabled="removendoMembro !== null"
                      :title="meuMembro(membro) ? 'Sair da família' : 'Remover membro'"
                      :aria-label="meuMembro(membro) ? 'Sair da família' : 'Remover ' + nomeMembro(membro)"
                      @click="removerMembro(membro)"><Trash2 :size="17" /></button>
                  </article>
                </div>
                <div v-else class="vazio-interno">
                  <div class="icone-vazio"><UserRoundPlus :size="23" /></div>
                  <h3>{{ membrosDisponiveis ? 'Nenhum membro cadastrado' : 'Membros não disponíveis' }}</h3>
                  <p>{{ membrosDisponiveis ? 'Os integrantes desta família aparecerão aqui.' : 'Confira se o backend da funcionalidade Família está atualizado.' }}</p>
                </div>
                <div v-if="souAdmin" class="convites-enviados">
                  <div class="painel-cabecalho">
                    <div><h3>Convites enviados</h3><p>Aguardando a resposta de outras pessoas.</p></div>
                  </div>
                  <p v-if="erroEnviados" class="aviso-pequeno" role="alert">{{ erroEnviados }}</p>
                  <div v-else-if="convitesEnviados.length" class="lista-convites">
                    <article v-for="convite in convitesEnviados" :key="convite.id" class="convite-item">
                      <span class="icone-despesa"><Mail :size="18" /></span>
                      <div class="despesa-info"><strong>{{ convite.usuario_nome || convite.usuario_email }}</strong><small>{{ convite.usuario_email }} · {{ papelMembro(convite) }} · Pendente</small></div>
                      <button class="icone-acao" type="button" :disabled="cancelandoConvite !== null" title="Cancelar convite" aria-label="Cancelar convite" @click="cancelarConvite(convite)"><X :size="17" /></button>
                    </article>
                  </div>
                  <p v-else class="texto-apoio">Nenhum convite aguardando resposta.</p>
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

    <div v-if="modalConviteAberto" class="modal-fundo" @click.self="fecharModalConvite">
      <section class="modal-familia" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-convite" @keydown.esc="fecharModalConvite">
        <div class="modal-cabecalho">
          <div><h2 id="titulo-modal-convite">Convidar para a família</h2><p>Informe o e-mail de uma conta já cadastrada no OPES.</p></div>
          <button class="fechar-modal" type="button" aria-label="Fechar" @click="fecharModalConvite"><X :size="20" /></button>
        </div>
        <form @submit.prevent="enviarConvite">
          <label for="email-convite">E-mail da pessoa</label>
          <input id="email-convite" v-model.trim="emailConvite" type="email" maxlength="255" placeholder="pessoa@exemplo.com" autocomplete="email" required autofocus />
          <label for="papel-convite" class="campo-segundo">Função na família</label>
          <select id="papel-convite" v-model="papelConvite" required>
            <option value="membro">Membro</option>
            <option value="dependente">Dependente</option>
          </select>
          <p class="texto-apoio">A pessoa somente entrará no grupo depois de aceitar o convite na página Família.</p>
          <p v-if="erroConvite" class="erro-formulario" role="alert">{{ erroConvite }}</p>
          <div class="modal-acoes">
            <button type="button" class="botao-cancelar" :disabled="enviandoConvite" @click="fecharModalConvite">Cancelar</button>
            <button type="submit" class="botao-principal" :disabled="enviandoConvite">{{ enviandoConvite ? 'Enviando...' : 'Enviar convite' }}</button>
          </div>
        </form>
      </section>
    </div>
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

.painel-convites{margin-bottom:22px}
.texto-apoio{color:var(--opes-muted);font-size:12px;line-height:1.6;margin:10px 0}
.lista-convites{display:flex;flex-direction:column;gap:10px}
.convite-item{display:flex;align-items:center;gap:12px;min-width:0;background:var(--opes-cream);border:1px solid var(--opes-border);border-radius:12px;padding:13px}
.acoes-convite{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.acoes-convite button{padding:9px 12px!important}
.convites-enviados{margin-top:23px;border-top:1px solid var(--opes-border);padding-top:20px}
.convites-enviados .painel-cabecalho{margin-bottom:12px}
.convites-enviados h3{font-size:14px;margin:0 0 6px}
.icone-acao{border:1px solid var(--opes-border)!important;background:var(--opes-paper)!important;color:var(--opes-danger)!important;border-radius:9px;padding:9px;display:grid;place-items:center;margin-left:auto;flex-shrink:0}
.icone-acao:hover{border-color:var(--opes-danger)!important}
.icone-acao:disabled{opacity:.45;cursor:not-allowed}
.aviso-pequeno{font-size:12px;color:var(--opes-danger);line-height:1.6}
.campo-segundo{margin-top:18px}
.modal-familia select{width:100%;padding:12px 14px;border:1px solid var(--opes-border);border-radius:9px;background:var(--opes-cream);color:var(--opes-ink)}
.membro-cartao .membro-dados{flex:1}
@media(max-width:700px){.convite-item{align-items:flex-start;flex-wrap:wrap}.acoes-convite{width:100%}.acoes-convite button{flex:1}}
</style>

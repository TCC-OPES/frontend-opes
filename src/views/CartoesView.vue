<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { notify } from '@/services/toast'
import { tema, alternarTema } from '@/services/tema'
import { useTransacoesStore } from '@/store/transacoes'

const router = useRouter()
const transacoesStore = useTransacoesStore()
const cartoes = ref([])
const carregando = ref(true)
const erro = ref('')
const modalAberto = ref(false)
const salvando = ref(false)
const excluindo = ref(false)
const cartaoEditando = ref(null)
const cartaoExcluindo = ref(null)
const erroFormulario = ref('')
const mostrarValores = ref(true)
const coresSugeridas = ['#14372D', '#295B83', '#6C4A73', '#935A39', '#374151', '#7D4655', '#006B63', '#A75530']
const formulario = reactive({ nome: '', banco: '', limite_total: '', valor_utilizado: '', vencimento: '', cor: '#14372D' })
const itensMenu = [
  { rotulo: 'Dashboard', icone: 'fa-chart-pie', rota: '/dashboard' },
  { rotulo: 'Transações', icone: 'fa-exchange-alt', rota: '/transacoes' },
  { rotulo: 'Cartões', icone: 'fa-credit-card', rota: '/cartoes' },
  { rotulo: 'Contas recorrentes', icone: 'fa-sync-alt', rota: '/recorrencias' },
  { rotulo: 'Calendário', icone: 'fa-calendar-alt', rota: '/calendario' },
  { rotulo: 'Metas', icone: 'fa-bullseye', rota: '/metas' },
  { rotulo: 'Investimentos', icone: 'fa-chart-line', rota: '/investimento' },
  { rotulo: 'Família', icone: 'fa-users', rota: '/familia' },
]
const nomeUsuario = ref('Usuário')
const fotoUsuario = ref('')
const moeda = valor => Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const valorExibido = valor => mostrarValores.value ? moeda(valor) : 'R$ •••••'
const totalLimite = computed(() => cartoes.value.reduce((acc, item) => acc + (Number(item.limite_total) || 0), 0))
const totalUtilizado = computed(() => cartoes.value.reduce((acc, item) => acc + (Number(item.valor_utilizado) || 0), 0))
const totalDisponivel = computed(() => Math.max(0, totalLimite.value - totalUtilizado.value))
const recentes = computed(() => [...transacoesStore.transacoes]
  .sort((a, b) => String(b.data || '').localeCompare(String(a.data || '')))
  .slice(0, 5))
function porcentagem(cartao) {
  const limite = Number(cartao.limite_total) || 0
  return limite > 0 ? Math.min(100, Math.max(0, (Number(cartao.valor_utilizado) || 0) / limite * 100)) : 0
}
function corCartao(valor) {
  return /^#[\da-fA-F]{6}$/.test(valor || '') ? valor : '#14372D'
}
function corLetra(valor) {
  const hex = corCartao(valor).slice(1)
  const rgb = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
  const canais = rgb.map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4)
  return canais[0] * .2126 + canais[1] * .7152 + canais[2] * .0722 > .38 ? '#142b22' : '#ffffff'
}
function dataBR(data) {
  const str = String(data || '')
  return /^\d{4}-\d{2}-\d{2}/.test(str) ? str.slice(0, 10).split('-').reverse().join('/') : (str || 'Não informado')
}
async function buscarCartoes() {
  carregando.value = true
  erro.value = ''
  try {
    const { data } = await api.get('/api/cartoes/')
    cartoes.value = Array.isArray(data) ? data : (data.results || [])
  } catch (e) {
    erro.value = 'Não foi possível carregar seus cartões.'
    notify.error(erro.value)
  } finally {
    carregando.value = false
  }
}
function abrirModal(cartao = null) {
  cartaoEditando.value = cartao
  Object.assign(formulario, {
    nome: cartao?.nome || '',
    banco: cartao?.banco || '',
    limite_total: cartao?.limite_total ?? '',
    valor_utilizado: cartao?.valor_utilizado ?? 0,
    vencimento: cartao ? dataBR(cartao.vencimento) : '',
    cor: corCartao(cartao?.cor),
  })
  erroFormulario.value = ''
  modalAberto.value = true
}
function fecharModal() {
  if (salvando.value) return
  modalAberto.value = false
  cartaoEditando.value = null
}
function erroDaApi(e, mensagem) {
  const dados = e.response?.data
  if (typeof dados?.detail === 'string') return dados.detail
  if (typeof dados?.erro === 'string') return dados.erro
  if (dados && typeof dados === 'object') {
    const textos = Object.entries(dados).flatMap(([campo, lista]) =>
      (Array.isArray(lista) ? lista : [lista]).map(t => campo + ': ' + String(t)))
    if (textos.length) return textos.join(' · ')
  }
  return mensagem
}
async function excluirCartao() {
  const cartao = cartaoExcluindo.value
  if (!cartao || excluindo.value) return
  excluindo.value = true
  try {
    await api.delete('/api/cartoes/' + cartao.id + '/')
    cartoes.value = cartoes.value.filter(item => item.id !== cartao.id)
    cartaoExcluindo.value = null
    notify.success('Cartão excluído com sucesso!')
  } catch (e) {
    notify.error(erroDaApi(e, 'Não foi possível excluir o cartão.'))
  } finally {
    excluindo.value = false
  }
}
async function salvarCartao() {
  if (salvando.value) return
  erroFormulario.value = ''
  const payload = {
    nome: formulario.nome.trim(),
    banco: formulario.banco.trim(),
    limite_total: Number(formulario.limite_total),
    valor_utilizado: Number(formulario.valor_utilizado || 0),
    vencimento: formulario.vencimento.trim(),
    cor: formulario.cor,
  }
  if (!Number.isFinite(payload.limite_total) || payload.limite_total < 0 ||
      !Number.isFinite(payload.valor_utilizado) || payload.valor_utilizado < 0) {
    erroFormulario.value = 'Informe valores válidos, maiores ou iguais a zero.'
    return
  }
  if (payload.valor_utilizado > payload.limite_total) {
    erroFormulario.value = 'O valor utilizado não pode superar o limite total.'
    return
  }
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(payload.vencimento)) {
    erroFormulario.value = 'Informe o vencimento no formato DD/MM/AAAA.'
    return
  }
  salvando.value = true
  try {
    const atual = cartaoEditando.value
    const { data } = atual
      ? await api.patch('/api/cartoes/' + atual.id + '/', payload)
      : await api.post('/api/cartoes/', payload)
    if (atual) {
      cartoes.value = cartoes.value.map(item => item.id === atual.id ? data : item)
    } else if (data?.id) {
      cartoes.value = [data, ...cartoes.value]
    } else {
      await buscarCartoes()
    }
    modalAberto.value = false
    cartaoEditando.value = null
    notify.success(atual ? 'Cartão atualizado com sucesso!' : 'Cartão cadastrado com sucesso!')
  } catch (e) {
    erroFormulario.value = erroDaApi(e, 'Não foi possível salvar o cartão. Confira os campos.')
  } finally {
    salvando.value = false
  }
}

onMounted(() => {
  try {
    const salvo = JSON.parse(localStorage.getItem('user') || '{}')
    const usuario = salvo.data || salvo
    nomeUsuario.value = (usuario.name || usuario.nome || 'Usuário').trim().split(' ')[0]
    fotoUsuario.value = usuario.foto || usuario.fotoUrl || usuario.avatar || ''
  } catch { /* Exibe nome padrão */ }
  buscarCartoes()
  transacoesStore.buscarTransacoes('todas')
})
</script>

<template>
  <div class="opes-cards-page">
    <aside class="opes-cards-sidebar">
      <div class="opes-cards-sidebar-top">
        <RouterLink to="/dashboard" class="opes-cards-brand" aria-label="Ir ao dashboard OPES">
          <img src="/icons/logo.png" alt="OPES" />
        </RouterLink>
        <nav class="opes-cards-menu" aria-label="Navegação principal">
          <RouterLink v-for="item in itensMenu" :key="item.rota" :to="item.rota"
            class="opes-cards-menu-item" :class="{ selected: $route.path === item.rota }">
            <i class="fas" :class="item.icone" aria-hidden="true"></i>
            <span>{{ item.rotulo }}</span>
          </RouterLink>
        </nav>
      </div>
      <div class="opes-cards-sidebar-bottom">
        <button class="opes-cards-theme" type="button" @click="alternarTema">
          <i class="fas" :class="tema === 'dark' ? 'fa-sun' : 'fa-moon'" aria-hidden="true"></i>
          {{ tema === 'dark' ? 'Modo claro' : 'Modo escuro' }}
        </button>
        <button class="opes-cards-profile" type="button" @click="router.push('/perfil')">
          <span class="opes-cards-avatar">
            <img v-if="fotoUsuario" :src="fotoUsuario" alt="" />
            <span v-else>{{ nomeUsuario[0] || 'U' }}</span>
          </span>
          <span class="opes-cards-profile-label"><strong>{{ nomeUsuario }}</strong><small>Ver perfil</small></span>
          <i class="fas fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
    </aside>

    <div class="opes-cards-main">
      <main class="opes-cards-content">
        <header class="opes-cards-heading">
          <div>
            <h1>Cartões</h1>
            <p>Gerencie seus cartões de crédito</p>
          </div>
          <div class="opes-cards-heading-actions">
            <button type="button" class="opes-cards-visibility" :aria-label="mostrarValores ? 'Ocultar valores' : 'Mostrar valores'"
              :title="mostrarValores ? 'Ocultar valores' : 'Mostrar valores'" @click="mostrarValores = !mostrarValores">
              <i class="fas" :class="mostrarValores ? 'fa-eye' : 'fa-eye-slash'"></i>
            </button>
            <button type="button" class="opes-cards-primary" @click="abrirModal()">
              <i class="fas fa-plus" aria-hidden="true"></i><span>Adicionar cartão</span>
            </button>
          </div>
        </header>

        <section class="opes-cards-summary" aria-label="Resumo dos cartões">
          <article class="opes-cards-summary-item">
            <div class="opes-cards-summary-top"><span>Limite total</span><i class="far fa-credit-card"></i></div>
            <strong>{{ valorExibido(totalLimite) }}</strong>
          </article>
          <article class="opes-cards-summary-item">
            <div class="opes-cards-summary-top"><span>Valor utilizado</span><i class="fas fa-chart-line"></i></div>
            <strong class="opes-cards-amber">{{ valorExibido(totalUtilizado) }}</strong>
          </article>
          <article class="opes-cards-summary-item">
            <div class="opes-cards-summary-top"><span>Disponível</span><i class="fas fa-lock"></i></div>
            <strong class="opes-cards-green">{{ valorExibido(totalDisponivel) }}</strong>
          </article>
        </section>

        <section aria-label="Seus cartões">
          <p v-if="carregando" class="opes-cards-empty">Carregando cartões...</p>
          <div v-else-if="erro" class="opes-cards-empty">
            <p>{{ erro }}</p>
            <button type="button" class="opes-cards-primary" @click="buscarCartoes">Tentar novamente</button>
          </div>
          <div v-else-if="cartoes.length" class="opes-cards-grid">
            <article v-for="cartao in cartoes" :key="cartao.id" class="opes-cards-card">
              <div class="opes-cards-face" :style="{ backgroundColor: corCartao(cartao.cor), color: corLetra(cartao.cor) }">
                <div class="opes-cards-card-top">
                  <div><span class="opes-cards-bank">{{ cartao.banco || 'Instituição financeira' }}</span>
                    <h2>{{ cartao.nome || 'Cartão de crédito' }}</h2></div>
                  <div class="opes-cards-card-actions">
                    <button type="button" title="Editar cartão" :aria-label="'Editar ' + cartao.nome" @click="abrirModal(cartao)">
                      <i class="fas fa-pen" aria-hidden="true"></i></button>
                    <button type="button" title="Excluir cartão" :aria-label="'Excluir ' + cartao.nome" @click="cartaoExcluindo = cartao">
                      <i class="fas fa-trash" aria-hidden="true"></i></button>
                  </div>
                </div>
                <div class="opes-cards-number">•••• &nbsp;•••• &nbsp;•••• &nbsp;{{ cartao.ultimos_digitos || '••••' }}</div>
                <div class="opes-cards-face-bottom">
                  <div><small>Vencimento</small><strong>{{ dataBR(cartao.vencimento) }}</strong></div>
                  <i class="far fa-credit-card" aria-hidden="true"></i>
                </div>
              </div>
              <div class="opes-cards-limit">
                <div class="opes-cards-limit-top"><span>Limite utilizado</span>
                  <strong>{{ porcentagem(cartao).toFixed(1).replace('.', ',') }}%</strong></div>
                <div class="opes-cards-track" role="progressbar" :aria-valuenow="Math.round(porcentagem(cartao))"
                  aria-valuemin="0" aria-valuemax="100" aria-label="Porcentagem do limite utilizado">
                  <div :style="{ width: porcentagem(cartao) + '%' }"></div>
                </div>
                <div class="opes-cards-limit-values">
                  <span>{{ valorExibido(cartao.valor_utilizado) }}</span>
                  <span>{{ valorExibido(cartao.limite_total) }}</span>
                </div>
              </div>
            </article>
          </div>
          <div v-else class="opes-cards-empty">
            <i class="far fa-credit-card"></i><h2>Nenhum cartão cadastrado</h2>
            <p>Adicione seu primeiro cartão para acompanhar seus limites.</p>
            <button type="button" class="opes-cards-primary" @click="abrirModal()">Adicionar cartão</button>
          </div>
        </section>

        <section class="opes-cards-recent" aria-labelledby="opes-cards-recent-title">
          <div class="opes-cards-recent-head">
            <div><h2 id="opes-cards-recent-title">Transações recentes</h2>
              <p>Últimas movimentações financeiras cadastradas</p></div>
            <RouterLink to="/transacoes">Ver todas <i class="fas fa-arrow-right" aria-hidden="true"></i></RouterLink>
          </div>
          <p v-if="transacoesStore.carregando" class="opes-cards-recent-empty">Carregando transações...</p>
          <p v-else-if="!recentes.length" class="opes-cards-recent-empty">Nenhuma transação encontrada.</p>
          <div v-else class="opes-cards-transactions">
            <div v-for="transacao in recentes" :key="transacao.id" class="opes-cards-transaction">
              <span class="opes-cards-transaction-icon"><i class="fas fa-exchange-alt" aria-hidden="true"></i></span>
              <div class="opes-cards-transaction-info">
                <strong>{{ transacao.titulo || 'Transação' }}</strong>
                <small>{{ transacao.categoria || 'Sem categoria' }} · {{ dataBR(transacao.data) }}</small>
              </div>
              <strong class="opes-cards-transaction-value" :class="{ expense: transacao.tipo === 'despesa' }">
                {{ mostrarValores ? (transacao.tipo === 'despesa' ? '− ' : '+ ') + moeda(transacao.valor) : 'R$ •••••' }}
              </strong>
            </div>
          </div>
          <small class="opes-cards-footnote">Transações gerais da conta, não necessariamente vinculadas aos cartões acima.</small>
        </section>
      </main>
    </div>

    <nav class="opes-cards-mobile-nav" aria-label="Navegação no celular">
      <RouterLink v-for="item in [itensMenu[0], itensMenu[1], itensMenu[2], itensMenu[5], itensMenu[6]]"
        :key="item.rota" :to="item.rota" :class="{ selected: $route.path === item.rota }">
        <i class="fas" :class="item.icone"></i><span>{{ item.rotulo }}</span>
      </RouterLink>
    </nav>

    <Teleport to="body">
      <div v-if="modalAberto" class="opes-cards-overlay" @click.self="fecharModal">
        <section class="opes-cards-modal" role="dialog" aria-modal="true" aria-labelledby="opes-cards-modal-title">
          <header><h2 id="opes-cards-modal-title">{{ cartaoEditando ? 'Editar cartão' : 'Adicionar cartão' }}</h2>
            <button class="opes-cards-close" type="button" aria-label="Fechar" @click="fecharModal">×</button></header>
          <p>{{ cartaoEditando ? 'Atualize os dados e personalize a cor.' : 'Cadastre seu cartão para acompanhar os limites.' }}</p>
          <form @submit.prevent="salvarCartao">
            <label>Nome do cartão<input v-model="formulario.nome" maxlength="100" placeholder="Ex.: Cartão Platinum" required /></label>
            <label>Banco / Instituição<input v-model="formulario.banco" maxlength="100" placeholder="Ex.: Banco do Brasil" required /></label>
            <div class="opes-cards-form-row">
              <label>Limite total (R$)<input v-model="formulario.limite_total" type="number" min="0" max="99999999.99" step="0.01" required /></label>
              <label>Vencimento<input v-model="formulario.vencimento" type="text" placeholder="15/04/2026" required /></label>
            </div>
            <label>Valor utilizado (R$)<input v-model="formulario.valor_utilizado" type="number" min="0" max="99999999.99" step="0.01" required /></label>
            <div class="opes-cards-color-field">
              <span class="opes-cards-field-title">Personalize a cor do cartão</span>
              <div class="opes-cards-palette" role="group" aria-label="Cores sugeridas">
                <button v-for="cor in coresSugeridas" :key="cor" type="button"
                  class="opes-cards-swatch" :class="{ escolhida: formulario.cor.toLowerCase() === cor.toLowerCase() }"
                  :style="{ backgroundColor: cor }" :aria-label="'Escolher cor ' + cor"
                  :aria-pressed="formulario.cor.toLowerCase() === cor.toLowerCase()"
                  @click="formulario.cor = cor">
                  <i v-if="formulario.cor.toLowerCase() === cor.toLowerCase()" class="fas fa-check" aria-hidden="true"></i>
                </button>
              </div>
              <label class="opes-cards-custom-color">Outra cor:
                <input v-model="formulario.cor" type="color" />
                <span>{{ formulario.cor }}</span>
              </label>
              <div class="opes-cards-preview" :style="{ backgroundColor: corCartao(formulario.cor), color: corLetra(formulario.cor) }">
                <span>{{ formulario.banco || 'Instituição financeira' }}</span>
                <strong>{{ formulario.nome || 'Prévia do cartão' }}</strong>
                <small>•••• •••• •••• ••••</small>
              </div>
            </div>
            <p v-if="erroFormulario" class="opes-cards-form-error" role="alert">{{ erroFormulario }}</p>
            <div class="opes-cards-modal-actions">
              <button type="button" class="opes-cards-secondary" @click="fecharModal">Cancelar</button>
              <button type="submit" class="opes-cards-primary" :disabled="salvando">{{ salvando ? 'Salvando...' : (cartaoEditando ? 'Salvar alterações' : 'Cadastrar cartão') }}</button>
            </div>
          </form>
        </section>
      </div>
    </Teleport>
    <Teleport to="body">
      <div v-if="cartaoExcluindo" class="opes-cards-overlay" @click.self="!excluindo && (cartaoExcluindo = null)">
        <section class="opes-cards-modal opes-cards-confirm" role="alertdialog" aria-modal="true"
          aria-labelledby="opes-cards-delete-title" aria-describedby="opes-cards-delete-description">
          <h2 id="opes-cards-delete-title">Excluir cartão?</h2>
          <p id="opes-cards-delete-description">Deseja excluir “{{ cartaoExcluindo.nome }}”? Essa ação remove o cartão do OPES e não pode ser desfeita.</p>
          <div class="opes-cards-modal-actions">
            <button type="button" class="opes-cards-secondary" :disabled="excluindo" @click="cartaoExcluindo = null">Cancelar</button>
            <button type="button" class="opes-cards-delete" :disabled="excluindo" @click="excluirCartao">
              {{ excluindo ? 'Excluindo...' : 'Excluir cartão' }}
            </button>
          </div>
        </section>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.opes-cards-page{--cp-bg:var(--opes-cream);--cp-surface:var(--opes-paper);--cp-forest:var(--opes-forest);--cp-text:var(--opes-ink);--cp-muted:var(--opes-muted);--cp-line:var(--opes-border);display:flex;min-height:100dvh;background:var(--cp-bg);color:var(--cp-text);font-family:'DM Sans',sans-serif}
.opes-cards-sidebar{width:234px;flex:0 0 234px;min-height:100dvh;background:var(--cp-surface);border-right:1px solid var(--cp-line);display:flex;flex-direction:column;justify-content:space-between;padding:20px 14px 14px;position:sticky;top:0;height:100dvh}
.opes-cards-brand{display:flex;align-items:center;padding:5px 16px 24px;height:80px}
.opes-cards-brand img{max-height:48px;max-width:100px;object-fit:contain}
.opes-cards-menu{display:flex;flex-direction:column;gap:4px;margin-top:8px}
.opes-cards-menu-item{display:flex;align-items:center;gap:13px;min-height:44px;padding:11px 15px;border-radius:9px;color:var(--cp-text);font-size:14px;font-weight:500;transition:background .15s}
.opes-cards-menu-item i{width:18px;text-align:center;font-size:15px}
.opes-cards-menu-item:hover{background:var(--opes-forest-soft)}
.opes-cards-menu-item.selected{background:#14372d;color:#fff}
.opes-cards-sidebar-bottom{display:flex;flex-direction:column;gap:10px}
.opes-cards-theme{width:100%;display:flex;align-items:center;gap:12px;padding:12px 16px;background:#14372d!important;color:white!important;border:0;border-radius:9px;font-size:13px;font-weight:700;text-align:left}
.opes-cards-profile{display:flex;align-items:center;gap:10px;border:1px solid var(--cp-line);background:var(--cp-bg)!important;color:var(--cp-text)!important;border-radius:11px;padding:10px;width:100%;text-align:left}
.opes-cards-avatar{display:grid;place-items:center;flex-shrink:0;width:36px;height:36px;border-radius:50%;background:#14372d;color:white;overflow:hidden;font-weight:700}
.opes-cards-avatar img{height:100%;width:100%;object-fit:cover}
.opes-cards-profile-label{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.opes-cards-profile-label strong{font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.opes-cards-profile-label small{font-size:11px;color:var(--cp-muted)}
.opes-cards-profile>i{font-size:12px}
.opes-cards-main{flex:1;min-width:0}
.opes-cards-content{max-width:1480px;margin:0 auto;padding:44px 32px 110px}
.opes-cards-heading{display:flex;justify-content:space-between;align-items:center;gap:14px;margin-bottom:26px}
.opes-cards-heading h1{font-size:29px;line-height:1.2;margin:0 0 7px;font-weight:800}
.opes-cards-heading p{margin:0;font-size:14px;color:var(--cp-forest)}
.opes-cards-heading-actions{display:flex;gap:9px;align-items:center}
.opes-cards-primary{border:0;border-radius:10px;background:#14372d!important;color:white!important;padding:12px 17px;font-size:13px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;gap:9px;white-space:nowrap}
.opes-cards-visibility{border:1px solid var(--cp-line);border-radius:10px;width:40px;height:40px;background:var(--cp-surface)!important;color:var(--cp-text)!important}
.opes-cards-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:19px;margin-bottom:24px}
.opes-cards-summary-item{min-width:0;min-height:138px;display:flex;flex-direction:column;justify-content:space-between;background:var(--cp-surface);border:1px solid var(--cp-line);border-radius:15px;padding:24px}
.opes-cards-summary-top{display:flex;justify-content:space-between;gap:8px;font-size:13px;color:var(--cp-forest)}
.opes-cards-summary-top i{font-size:17px}
.opes-cards-summary-item>strong{font-size:clamp(19px,2.4vw,28px);overflow-wrap:anywhere;letter-spacing:-.025em}
.opes-cards-amber{color:var(--opes-caramel-dark)}
.opes-cards-green{color:var(--cp-forest)}
.opes-cards-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.opes-cards-card{border-radius:15px;overflow:hidden;background:var(--cp-surface);border:1px solid var(--cp-line);min-width:0;transition:transform .2s ease,box-shadow .2s ease}
.opes-cards-card:hover{transform:translateY(-3px);box-shadow:0 8px 20px #10251b15}
.opes-cards-face{min-height:228px;padding:24px;display:flex;flex-direction:column;justify-content:space-between}
.opes-cards-bank{display:block;font-size:12px;margin-bottom:6px;opacity:.9}
.opes-cards-face h2{font-size:17px;color:inherit!important;margin:0;font-weight:800}
.opes-cards-number{font-family:ui-monospace,Consolas,monospace;font-size:13px;font-weight:700;letter-spacing:.06em;white-space:nowrap}
.opes-cards-face-bottom{display:flex;justify-content:space-between;align-items:end}
.opes-cards-face-bottom small{display:block;font-size:11px;margin-bottom:6px}
.opes-cards-face-bottom strong{font-size:13px}
.opes-cards-face-bottom i{font-size:28px}
.opes-cards-limit{padding:24px}
.opes-cards-limit-top,.opes-cards-limit-values{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:12px}
.opes-cards-limit-top{color:var(--cp-muted)}
.opes-cards-limit-top strong{color:var(--cp-text)}
.opes-cards-track{margin:15px 0 12px;height:8px;border-radius:99px;background:var(--opes-sand);overflow:hidden}
.opes-cards-track>div{height:100%;border-radius:99px;background:#14372d;transition:width .25s ease}
.opes-cards-limit-values{color:var(--cp-text)}
.opes-cards-recent{margin-top:24px;background:var(--cp-surface);border:1px solid var(--cp-line);border-radius:15px;padding:26px}
.opes-cards-recent-head{display:flex;align-items:center;justify-content:space-between;gap:10px}
.opes-cards-recent-head h2{font-size:18px;margin:0 0 5px}
.opes-cards-recent-head p{font-size:12px;margin:0;color:var(--cp-muted)}
.opes-cards-recent-head a{white-space:nowrap;font-size:12px;font-weight:700;color:var(--cp-forest)}
.opes-cards-recent-empty{padding:30px 0;text-align:center;color:var(--cp-muted);font-size:13px}
.opes-cards-transaction{display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--cp-line);padding:15px 0}
.opes-cards-transaction-icon{width:39px;height:39px;display:grid;place-items:center;border-radius:10px;background:var(--opes-forest-soft);color:var(--cp-forest);flex-shrink:0}
.opes-cards-transaction-info{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}
.opes-cards-transaction-info strong{font-size:13px}
.opes-cards-transaction-info small{font-size:11px;color:var(--cp-muted)}
.opes-cards-transaction-value{font-size:13px;white-space:nowrap;color:var(--cp-forest)}
.opes-cards-transaction-value.expense{color:var(--opes-caramel-dark)}
.opes-cards-footnote{display:block;margin-top:14px;font-size:11px;color:var(--cp-muted)}
.opes-cards-empty{min-height:230px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:13px;padding:24px;text-align:center;border:1px solid var(--cp-line);border-radius:15px;background:var(--cp-surface);color:var(--cp-muted)}
.opes-cards-empty h2,.opes-cards-empty p{margin:0}
.opes-cards-empty>i{font-size:27px;color:var(--cp-forest)}
.opes-cards-mobile-nav{display:none}
.opes-cards-overlay{position:fixed;inset:0;z-index:3500;display:flex;align-items:center;justify-content:center;padding:16px;background:#07181191;backdrop-filter:blur(3px)}
.opes-cards-modal{width:100%;max-width:460px;max-height:90dvh;overflow-y:auto;border-radius:18px;background:var(--opes-paper);color:var(--opes-ink);border:1px solid var(--opes-border);padding:24px;box-shadow:0 20px 55px #06150d30}
.opes-cards-modal header{display:flex;align-items:center;justify-content:space-between}
.opes-cards-modal h2{font-size:21px;margin:0}
.opes-cards-modal>p{margin:8px 0 22px;color:var(--opes-muted);font-size:13px}
.opes-cards-close{border:0!important;background:transparent!important;color:var(--opes-ink)!important;font-size:26px;line-height:1}
.opes-cards-modal form{display:flex;flex-direction:column;gap:16px}
.opes-cards-modal label{display:flex;flex-direction:column;gap:7px;font-weight:700;font-size:12px}
.opes-cards-modal label>input{width:100%;padding:12px;border:1px solid var(--opes-border);border-radius:9px;font-weight:400;font-size:13px}
.opes-cards-form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.opes-cards-color{display:flex;align-items:center;gap:12px;font-size:12px;font-weight:400}
.opes-cards-color input{width:45px;height:38px;padding:3px;border:1px solid var(--opes-border);border-radius:8px;background:var(--opes-paper)}
.opes-cards-form-error{font-size:12px;color:var(--opes-danger);margin:0}
.opes-cards-modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:8px}
.opes-cards-secondary{padding:12px 17px;border:1px solid var(--opes-border)!important;border-radius:10px;background:var(--opes-cream)!important;color:var(--opes-ink)!important;font-weight:700}
@media(max-width:1160px){.opes-cards-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:1023px){.opes-cards-sidebar{display:none}.opes-cards-mobile-nav{display:flex;position:fixed;bottom:0;left:0;right:0;height:calc(70px + env(safe-area-inset-bottom));padding:6px 4px env(safe-area-inset-bottom);border-top:1px solid var(--cp-line);background:var(--cp-surface);z-index:1100;justify-content:space-around}.opes-cards-mobile-nav a{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;color:var(--cp-forest);font-size:10px}.opes-cards-mobile-nav a i{font-size:18px}.opes-cards-mobile-nav a.selected{font-weight:800}}
@media(max-width:650px){.opes-cards-content{padding:25px 14px 115px}.opes-cards-heading{align-items:flex-start;flex-wrap:wrap}.opes-cards-heading h1{font-size:24px}.opes-cards-summary{grid-template-columns:1fr;gap:12px}.opes-cards-summary-item{min-height:104px;padding:18px}.opes-cards-grid{grid-template-columns:1fr;gap:15px}.opes-cards-face{min-height:218px}.opes-cards-recent{padding:17px}.opes-cards-transaction-value{font-size:11px}.opes-cards-recent-head{align-items:flex-start}.opes-cards-form-row{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.opes-cards-page *{transition:none!important}}
.opes-cards-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
.opes-cards-card-top>div:first-child{min-width:0;overflow-wrap:anywhere}
.opes-cards-card-actions{display:flex;flex-shrink:0;gap:6px}
.opes-cards-card-actions button{width:29px;height:29px;display:grid;place-items:center;border:0!important;box-shadow:none!important;background:transparent!important;color:inherit!important;opacity:.85}
.opes-cards-card-actions button:hover{background:#ffffff25!important;opacity:1}
.opes-cards-delete{padding:12px 17px;border:0;border-radius:10px;background:var(--opes-danger)!important;color:white!important;font-weight:700}
.opes-cards-confirm>p{line-height:1.6;margin:14px 0 22px}
.opes-cards-color-field{display:flex;flex-direction:column;gap:12px}
.opes-cards-field-title{font-size:12px;font-weight:700;color:var(--opes-ink)}
.opes-cards-palette{display:flex;flex-wrap:wrap;gap:9px}
.opes-cards-swatch{border:2px solid transparent!important;width:35px;height:35px;border-radius:50%;color:white!important;display:grid;place-items:center;box-shadow:0 0 0 1px var(--opes-border)!important;transition:transform .2s}
.opes-cards-swatch.escolhida{outline:2px solid var(--opes-caramel)!important;outline-offset:2px}
.opes-cards-custom-color{display:flex!important;flex-direction:row!important;align-items:center;gap:10px!important}
.opes-cards-custom-color input{width:40px;height:35px;border:0;padding:0;background:none}
.opes-cards-preview{display:flex;flex-direction:column;justify-content:space-between;padding:17px 20px;border-radius:12px;min-height:120px}
.opes-cards-preview span{font-size:11px}
.opes-cards-preview strong{font-size:15px}
.opes-cards-preview small{letter-spacing:2px}
</style>
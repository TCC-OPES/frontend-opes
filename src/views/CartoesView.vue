<script setup>
import { computed, onMounted, ref } from 'vue'
import api from '@/services/api'
import { notify } from '@/services/toast'
import { useTransacoesStore } from '@/store/transacoes'
import SideBarComponent from '@/components/SideBarComponent.vue'
import CardResumo from '@/components/cartoes/CardResumo.vue'
import CartaoItem from '@/components/cartoes/CartaoItem.vue'
import NovoCartao from '@/components/cartoes/NovoCartao.vue'

const cartoes = ref([])
const showModal = ref(false)
const carregando = ref(true)
const transacoesStore = useTransacoesStore()

const recentes = computed(() =>
  [...transacoesStore.transacoes]
    .sort((a, b) => String(b.data || '').localeCompare(String(a.data || '')))
    .slice(0, 5)
)

function moeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function dataBR(data) {
  if (!data) return 'Data não informada'
  const texto = String(data)
  return /^\d{4}-\d{2}-\d{2}/.test(texto)
    ? texto.slice(0, 10).split('-').reverse().join('/')
    : texto
}

async function carregarCartoes() {
  carregando.value = true
  try {
    const { data } = await api.get('/api/cartoes/')
    cartoes.value = Array.isArray(data) ? data : (data.results || [])
  } catch {
    notify.error('Não foi possível carregar os cartões.')
  } finally {
    carregando.value = false
  }
}

function handleCartaoAdicionado(novoCartao) {
  if (novoCartao) cartoes.value.unshift(novoCartao)
  showModal.value = false
}

onMounted(() => {
  carregarCartoes()
  transacoesStore.buscarTransacoes('todas')
})
</script>

<template>
  <div class="cartoes-layout">
    <SideBarComponent />
    <div class="cartoes-main">
      <main class="cartoes-conteudo">
        <header class="pagina-topo">
          <div>
            <h1>Cartões</h1>
            <p>Gerencie seus cartões de crédito</p>
          </div>
          <button type="button" class="btn-adicionar" @click="showModal = true">
            <span aria-hidden="true">+</span> Adicionar cartão
          </button>
        </header>

        <CardResumo :cartoes="cartoes" />

        <section aria-labelledby="meus-cartoes">
          <div class="secao-cabecalho">
            <h2 id="meus-cartoes">Meus cartões</h2>
            <span>{{ cartoes.length }} {{ cartoes.length === 1 ? 'cartão' : 'cartões' }}</span>
          </div>
          <p v-if="carregando" class="estado">Carregando cartões...</p>
          <div v-else-if="cartoes.length" class="cartoes-grid">
            <CartaoItem v-for="cartao in cartoes" :key="cartao.id" :cartao="cartao" />
          </div>
          <div v-else class="estado vazio">
            <i class="far fa-credit-card" aria-hidden="true"></i>
            <p>Nenhum cartão cadastrado ainda.</p>
            <button type="button" class="btn-adicionar" @click="showModal = true">Adicionar meu primeiro cartão</button>
          </div>
        </section>

        <section class="recentes-painel" aria-labelledby="recentes-titulo">
          <div class="secao-cabecalho">
            <div>
              <h2 id="recentes-titulo">Transações recentes</h2>
              <p>Últimas movimentações financeiras registradas</p>
            </div>
            <RouterLink to="/transacoes" class="ver-todas">Ver todas <span aria-hidden="true">→</span></RouterLink>
          </div>
          <p v-if="transacoesStore.carregando" class="transacoes-vazio">Carregando transações...</p>
          <p v-else-if="!recentes.length" class="transacoes-vazio">Nenhuma transação encontrada.</p>
          <div v-else class="lista-recentes">
            <div v-for="transacao in recentes" :key="transacao.id" class="transacao-linha">
              <div class="transacao-icone" aria-hidden="true"><i class="fas fa-exchange-alt"></i></div>
              <div class="transacao-dados">
                <strong>{{ transacao.titulo || 'Transação' }}</strong>
                <small>{{ transacao.categoria || 'Sem categoria' }} · {{ dataBR(transacao.data) }}</small>
              </div>
              <strong class="transacao-valor" :class="{ despesa: transacao.tipo === 'despesa' }">
                {{ transacao.tipo === 'despesa' ? '−' : '+' }} {{ moeda(transacao.valor) }}
              </strong>
            </div>
          </div>
          <small class="nota-transacoes">Movimentações gerais da conta; não são necessariamente compras com cartão.</small>
        </section>
      </main>
    </div>
    <NovoCartao v-if="showModal" @close="showModal = false" @success="handleCartaoAdicionado" />
  </div>
</template>

<style scoped>
.cartoes-layout{display:flex;min-height:100dvh;background:var(--opes-cream)}
.cartoes-main{flex:1;min-width:0}
.cartoes-conteudo{max-width:1480px;margin:0 auto;padding:32px 28px 120px}
.pagina-topo{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:26px}
.pagina-topo h1{font-size:28px;margin:0 0 5px;font-weight:800}
.pagina-topo p,.secao-cabecalho p{font-size:14px;color:var(--opes-forest);margin:0}
.btn-adicionar{border:0;border-radius:10px;background:var(--opes-forest);color:var(--opes-paper);padding:11px 17px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;gap:9px}
.btn-adicionar span{font-size:21px;font-weight:400;line-height:1}
.secao-cabecalho{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:3px 0 16px}
.secao-cabecalho h2{font-size:18px;margin:0;font-weight:750}
.secao-cabecalho>span{font-size:13px;color:var(--opes-muted)}
.cartoes-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}
.estado{border:1px solid var(--opes-border);background:var(--opes-paper);border-radius:15px;padding:30px;text-align:center;color:var(--opes-muted)}
.estado.vazio{display:flex;align-items:center;flex-direction:column;gap:12px}
.estado.vazio i{font-size:30px;color:var(--opes-forest)}
.estado.vazio p{margin:0}
.recentes-painel{margin-top:24px;padding:24px;border:1px solid var(--opes-border);border-radius:15px;background:var(--opes-paper)}
.recentes-painel .secao-cabecalho{margin:0 0 18px}
.recentes-painel .secao-cabecalho p{font-size:12px;color:var(--opes-muted);margin-top:5px}
.ver-todas{color:var(--opes-forest);font-size:13px;font-weight:700;white-space:nowrap}
.transacoes-vazio{padding:30px 10px;text-align:center;color:var(--opes-muted)}
.lista-recentes{display:flex;flex-direction:column}
.transacao-linha{display:flex;align-items:center;gap:13px;padding:13px 0;border-top:1px solid var(--opes-border)}
.transacao-icone{width:40px;height:40px;flex-shrink:0;display:grid;place-items:center;border-radius:10px;background:var(--opes-forest-soft);color:var(--opes-forest)}
.transacao-dados{display:flex;flex-direction:column;gap:4px;min-width:0;flex:1}
.transacao-dados strong{font-size:14px;color:var(--opes-ink)}
.transacao-dados small{font-size:12px;color:var(--opes-muted)}
.transacao-valor{white-space:nowrap;font-size:14px;color:var(--opes-forest)}
.transacao-valor.despesa{color:var(--opes-caramel-dark)}
.nota-transacoes{display:block;margin-top:12px;color:var(--opes-muted);font-size:11px}
@media(max-width:1150px){.cartoes-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:720px){.cartoes-conteudo{padding:22px 14px 125px}.cartoes-grid{grid-template-columns:1fr;gap:14px}.pagina-topo h1{font-size:24px}.recentes-painel{padding:16px}.transacao-linha{gap:9px}.transacao-valor{font-size:12px}.secao-cabecalho{align-items:flex-start}}
</style>
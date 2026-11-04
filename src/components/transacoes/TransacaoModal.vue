<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import api from '@/services/api'
import { useTransacoesStore } from '@/store/transacoes'

const props = defineProps({ transacao: { type: Object, default: null } })
const emit = defineEmits(['fechar'])
const transacoesStore = useTransacoesStore()
const cartoes = ref([])
const erroCartoes = ref('')
const carregandoCartoes = ref(false)
const metodoCredito = computed(() => formulario.value.tipo === 'despesa' && formulario.value.metodo_pagamento === 'credito')
const cartaoSelecionado = computed(() => cartoes.value.find(c => c.id === Number(formulario.value.cartao)) || null)
const disponivel = computed(() => {
  const cartao = cartaoSelecionado.value
  if (!cartao) return 0
  const creditoAnterior = props.transacao?.tipo === 'despesa'
    && props.transacao?.metodo_pagamento === 'credito'
    && Number(props.transacao?.cartao) === cartao.id ? Number(props.transacao.valor) || 0 : 0
  return Math.max(0, Number(cartao.limite_total) - Number(cartao.valor_utilizado) + creditoAnterior)
})
const moeda = valor => Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
async function carregarCartoes() {
  carregandoCartoes.value = true
  erroCartoes.value = ''
  try {
    const { data } = await api.get('/api/cartoes/')
    cartoes.value = Array.isArray(data) ? data : (data.results || [])
  } catch {
    erroCartoes.value = 'Não foi possível carregar os cartões.'
  } finally {
    carregandoCartoes.value = false
  }
}
onMounted(carregarCartoes)



const formulario = ref({
  titulo: props.transacao?.titulo || '',
  categoria: props.transacao?.categoria || '',
  tipo: props.transacao?.tipo || 'receita',
  valor: props.transacao?.valor || '',
  data: props.transacao?.data?.slice(0, 10) || new Date().toLocaleDateString('sv-SE'),
  metodo_pagamento: props.transacao?.metodo_pagamento || 'outro',
  cartao: props.transacao?.cartao || ''
})

const carregandoSalvar = ref(false)
const erroFormulario = ref('')
watch(() => formulario.value.tipo, tipo => {
  if (tipo !== 'despesa' && formulario.value.metodo_pagamento === 'credito') {
    formulario.value.metodo_pagamento = 'outro'
  }
})
watch(() => [formulario.value.tipo, formulario.value.metodo_pagamento], () => {
  if (!metodoCredito.value) formulario.value.cartao = ''
})

async function submeterFormulario() {
  if (carregandoSalvar.value) return
  erroFormulario.value = ''
  if (metodoCredito.value) {
    if (!formulario.value.cartao || !cartaoSelecionado.value) {
      erroFormulario.value = 'Selecione o cartão utilizado na compra.'
      return
    }
    if (Number(formulario.value.valor) > disponivel.value) {
      erroFormulario.value = 'O valor ultrapassa o limite disponível deste cartão.'
      return
    }
  }
  carregandoSalvar.value = true
  const dados = { ...formulario.value, cartao: metodoCredito.value ? Number(formulario.value.cartao) : null }
  try {
    const sucesso = props.transacao
      ? await transacoesStore.editarTransacao(props.transacao.id, dados)
      : await transacoesStore.criarTransacao(dados)

    if (sucesso) emit('fechar')
  } finally {
    carregandoSalvar.value = false
  }
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ transacao ? 'Editar Transação' : 'Nova Transação' }}</h2>
        <button type="button" class="btn-fechar" aria-label="Fechar formulário" @click="emit('fechar')">&times;</button>
      </div>

      <form @submit.prevent="submeterFormulario" class="formulario">
        <div class="grupo-input">
          <label>Título</label>
          <input type="text" v-model="formulario.titulo" placeholder="Ex: Supermercado Central" required />
        </div>

        <div class="grupo-input">
          <label>Categoria</label>
          <input type="text" v-model="formulario.categoria" placeholder="Ex: Alimentação" required />
        </div>

        <div class="grupo-input">
          <label>Tipo</label>
          <select v-model="formulario.tipo">
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
          </select>
        </div>

        <div class="grupo-input">
          <label for="metodo-pagamento">Método de pagamento</label>
          <select id="metodo-pagamento" v-model="formulario.metodo_pagamento">
            <option value="pix">Pix</option>
            <option value="dinheiro">Dinheiro</option>
            <option value="debito">Cartão de débito</option>
            <option value="credito" :disabled="formulario.tipo !== 'despesa'">Cartão de crédito</option>
            <option value="outro">Outro / não informado</option>
          </select>
        </div>
        <div v-if="metodoCredito" class="grupo-input">
          <label for="cartao-transacao">Cartão utilizado</label>
          <select id="cartao-transacao" v-model="formulario.cartao" required :disabled="carregandoCartoes || !!erroCartoes">
            <option value="" disabled>Selecione seu cartão</option>
            <option v-for="cartao in cartoes" :key="cartao.id" :value="cartao.id">
              {{ cartao.banco }} — {{ cartao.nome }}
            </option>
          </select>
          <small v-if="carregandoCartoes">Carregando cartões...</small>
          <small v-else-if="erroCartoes" class="mensagem-erro">{{ erroCartoes }}</small>
          <small v-else-if="!cartoes.length">Cadastre um cartão na página Cartões para usar este método.</small>
          <small v-else-if="cartaoSelecionado">Limite disponível: <strong>{{ moeda(disponivel) }}</strong></small>
          <small class="aviso-limite">O valor da compra será somado ao limite utilizado do cartão.</small>
        </div>
        <div class="grupo-input">
          <label>Valor (R$)</label>
          <input type="number" step="0.01" min="0.01" v-model="formulario.valor" placeholder="0.00" required />
        </div>

        <div class="grupo-input">
          <label>Data</label>
          <input type="date" v-model="formulario.data" required />
        </div>

        <p v-if="erroFormulario" class="mensagem-erro" role="alert">{{ erroFormulario }}</p>
        <div class="modal-footer">
          <button class="btn-secundario" type="button" @click="emit('fechar')">Cancelar</button>
          <button class="btn-primario" type="submit" :disabled="carregandoSalvar || (metodoCredito && (!cartaoSelecionado || carregandoCartoes || !!erroCartoes))">
            {{ carregandoSalvar ? 'Salvando...' : (transacao ? 'Salvar alterações' : 'Salvar Transação') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2500;
  padding: 16px;
  overflow-y: auto;
}

.modal-content {
  background: var(--opes-paper);
  color: var(--opes-ink);
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  max-width: 450px;
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  font-size: 20px;
  color: var(--opes-ink);
}

.btn-fechar {
  appearance: none;
  background: transparent !important;
  border: 0 !important;
  box-shadow: none !important;
  padding: 0 !important;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  color: var(--opes-ink) !important;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.grupo-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.grupo-input label {
  font-size: 14px;
  font-weight: 600;
  color: var(--opes-ink);
}

.grupo-input input, .grupo-input select {
  padding: 10px 14px;
  border: 1px solid var(--opes-sand);
  border-radius: 10px;
  font-size: 15px;
  outline: none;
}

.grupo-input input:focus, .grupo-input select:focus {
  border-color: var(--opes-forest);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.btn-secundario {
  background: var(--opes-paper);
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  color: var(--opes-forest);
  cursor: pointer;
}

.btn-primario {
  background: var(--opes-forest);
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  color: white;
  cursor: pointer;
}
.mensagem-erro{color:var(--opes-danger);font-size:12px;margin:0}
.grupo-input small{color:var(--opes-muted);font-size:12px}
.grupo-input small.aviso-limite{color:var(--opes-forest);line-height:1.5}
@media(max-width:540px){.modal-content{padding:20px 16px}.modal-footer{flex-wrap:wrap}.modal-footer button{flex:1}}
</style>

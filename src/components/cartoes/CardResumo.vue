<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// --- URL BASE DA API ---
const API_URL = 'https://opes.class.fabricadesoftware.ifc.edu.br'

// --- ESTADOS REATIVOS ---
const cartoes = ref([])
const carregando = ref(true)
const erroFetch = ref('')
const exibeModal = ref(false)
const modoEdicao = ref(false)
const nomeOriginalCartao = ref(null) // Guarda exclusivamente o NOME do cartão sendo editado

// Formulário do Modal
const form = reactive({
  nome: '',
  banco: '',
  limite_total: '',
  valor_utilizado: '',
  vencimento: '',
  cor: '#006B2B'
})
const enviando = ref(false)
const erroModal = ref('')

// --- REQUISIÇÕES API ---
const buscarCartoes = async () => {
  carregando.value = true
  erroFetch.value = ''
  try {
    const token = localStorage.getItem('token') || localStorage.getItem('access')
    const res = await fetch(`${API_URL}/api/cartoes/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error('Erro ao carregar lista de cartões.')
    }

    const data = await res.json()
    cartoes.value = data
  } catch (err) {
    erroFetch.value = err.message || 'Erro de conexão com o servidor.'
  } finally {
    carregando.value = false
  }
}

const submitForm = async () => {
  enviando.value = true
  erroModal.value = ''

  try {
    const token = localStorage.getItem('token') || localStorage.getItem('access')
    
    const payload = {
      nome: form.nome,
      banco: form.banco,
      limite_total: parseFloat(form.limite_total) || 0,
      valor_utilizado: parseFloat(form.valor_utilizado) || 0,
      vencimento: form.vencimento,
      cor: form.cor
    }

    // MONTA A URL USANDO EXCLUSIVAMENTE O NOME DO CARTÃO
    let url = `${API_URL}/api/cartoes/`
    let method = 'POST'

    if (modoEdicao.value && nomeOriginalCartao.value) {
      const nomeFormatadoURL = encodeURIComponent(nomeOriginalCartao.value)
      url = `${API_URL}/api/cartoes/${nomeFormatadoURL}/`
      method = 'PUT'
    }

    const res = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      const mensagens = Object.entries(errorData)
        .map(([campo, msgs]) => `${campo}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
        .join(' | ')

      throw new Error(mensagens || `Erro ${res.status}`)
    }

    await buscarCartoes()
    fecharModal()
  } catch (err) {
    erroModal.value = err.message || 'Erro inesperado.'
  } finally {
    enviando.value = false
  }
}

onMounted(() => {
  buscarCartoes()
})

// --- CÁLCULOS COMPUTADOS ---
const totalLimite = computed(() => {
  return cartoes.value.reduce((acc, card) => acc + (Number(card.limite_total) || 0), 0)
})

const totalUtilizado = computed(() => {
  return cartoes.value.reduce((acc, card) => acc + (Number(card.valor_utilizado) || 0), 0)
})

const totalDisponivel = computed(() => {
  return totalLimite.value - totalUtilizado.value
})

// --- FUNÇÕES AUXILIARES ---
const formatCurrency = (value) => {
  return (Number(value) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(',00', '')
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const [year, month, day] = dateString.split('-')
  if (year && month && day) {
    return `${day}/${month}/${year}`
  }
  return dateString
}

const calcularPorcentagem = (utilizado, limite) => {
  const lim = Number(limite) || 0
  const uti = Number(utilizado) || 0
  if (lim === 0) return 0
  return Math.min(100, (uti / lim) * 100)
}

const abrirModalCriacao = () => {
  modoEdicao.value = false
  nomeOriginalCartao.value = null
  form.nome = ''
  form.banco = ''
  form.limite_total = ''
  form.valor_utilizado = '0'
  form.vencimento = ''
  form.cor = '#006B2B'
  erroModal.value = ''
  exibeModal.value = true
}

const abrirModalEdicao = (cartao) => {
  modoEdicao.value = true
  
  // USA EXCLUSIVAMENTE O NOME COMO IDENTIFICADOR
  nomeOriginalCartao.value = cartao.nome 
  
  form.nome = cartao.nome || ''
  form.banco = cartao.banco || ''
  form.limite_total = cartao.limite_total || ''
  form.valor_utilizado = cartao.valor_utilizado || 0
  form.vencimento = cartao.vencimento || ''
  form.cor = cartao.cor || '#006B2B'
  erroModal.value = ''
  exibeModal.value = true
}

const fecharModal = () => {
  exibeModal.value = false
}
</script>

<template>
  <div class="cards-page-container">
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-info">
          <span class="metric-label">Limite Total</span>
          <p class="metric-value text-dark">{{ formatCurrency(totalLimite) }}</p>
        </div>
        <span class="metric-icon text-gray">$</span>
      </div>

      <div class="metric-card">
        <div class="metric-info">
          <span class="metric-label">Valor Utilizado</span>
          <p class="metric-value text-blue">{{ formatCurrency(totalUtilizado) }}</p>
        </div>
        <span class="metric-icon text-blue">↗</span>
      </div>

      <div class="metric-card">
        <div class="metric-info">
          <span class="metric-label">Disponível</span>
          <p class="metric-value text-green">{{ formatCurrency(totalDisponivel) }}</p>
        </div>
        <span class="metric-icon text-green">🔒</span>
      </div>
    </div>

    <!-- Feedback de Carregamento / Erro -->
    <div v-if="carregando" class="state-message">Carregando cartões...</div>
    <div v-else-if="erroFetch" class="state-message error-message">{{ erroFetch }}</div>

    <!-- Lista Dinâmica de Cartões -->
    <div v-else-if="cartoes.length > 0" class="cards-grid">
      <div 
        v-for="cartao in cartoes" 
        :key="cartao.nome" 
        class="card-wrapper"
      >
        <!-- Bloco do Cartão Físico -->
        <div 
          class="card-item"
          :style="{ backgroundColor: cartao.cor || '#006B2B' }"
        >
          <div class="card-header">
            <div>
              <span class="card-bank">{{ cartao.banco }}</span>
              <h3 class="card-name">{{ cartao.nome }}</h3>
            </div>
            <!-- Botão de Editar Cartão -->
            <button @click="abrirModalEdicao(cartao)" class="edit-card-btn" title="Editar Cartão">
              ✏️
            </button>
          </div>

          <div class="card-number">
            •••• •••• •••• {{ cartao.ultimos_digitos || (cartao.numero ? cartao.numero.slice(-4) : '****') }}
          </div>

          <div class="card-footer">
            <div>
              <span class="footer-label">Data de Vencimento</span>
              <span class="footer-value">{{ formatDate(cartao.vencimento) }}</span>
            </div>

            <div class="chip-icon">
              <div class="chip-line"></div>
            </div>
          </div>
        </div>

        <!-- Barra de Progresso e Percentual -->
        <div class="card-usage-details">
          <div class="usage-info">
            <span class="usage-label">Limite utilizado: {{ formatCurrency(cartao.valor_utilizado) }}</span>
            <span class="usage-percent">
              {{ calcularPorcentagem(cartao.valor_utilizado, cartao.limite_total).toFixed(1) }}%
            </span>
          </div>

          <div class="progress-bar-bg">
            <div 
              class="progress-bar-fill" 
              :style="{ 
                width: `${calcularPorcentagem(cartao.valor_utilizado, cartao.limite_total)}%`,
                backgroundColor: cartao.cor || '#006B2B' 
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado Vazio -->
    <div v-else class="state-message">
      Nenhum cartão cadastrado ainda. Clique no botão "+" para adicionar um novo.
    </div>

    <!-- Botão Flutuante (FAB) -->
    <button @click="abrirModalCriacao" class="fab-button" title="Novo Cartão">
      +
    </button>

    <!-- Modal de Cadastro / Edição -->
    <div v-if="exibeModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">{{ modoEdicao ? 'Editar Cartão' : 'Novo Cartão de Crédito' }}</h2>
          <button @click="fecharModal" class="close-btn">✕</button>
        </div>

        <div v-if="erroModal" class="error-alert">
          {{ erroModal }}
        </div>

        <form @submit.prevent="submitForm" class="modal-form">
          <div class="form-group">
            <label class="form-label">Nome do Cartão</label>
            <input
              v-model="form.nome"
              type="text"
              placeholder="Ex: Cartão Platinum"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Banco / Instituição</label>
            <input
              v-model="form.banco"
              type="text"
              placeholder="Ex: Banco do Brasil"
              required
              class="form-input"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Limite Total (R$)</label>
              <input
                v-model="form.limite_total"
                type="number"
                step="0.01"
                placeholder="5000"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Valor Já Utilizado (R$)</label>
              <input
                v-model="form.valor_utilizado"
                type="number"
                step="0.01"
                placeholder="0.00"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Vencimento</label>
              <input
                v-model="form.vencimento"
                type="date"
                required
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Cor do Cartão</label>
              <div class="color-picker-wrapper">
                <input
                  v-model="form.cor"
                  type="color"
                  class="color-input"
                />
                <span class="color-value">{{ form.cor }}</span>
              </div>
            </div>
          </div>

          <div class="modal-actions">
            <button
              type="button"
              @click="fecharModal"
              class="btn-cancel"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="enviando"
              class="btn-submit"
            >
              {{ enviando ? 'Salvando...' : (modoEdicao ? 'Atualizar Cartão' : 'Salvar Cartão') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards-page-container {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  position: relative;
  min-height: 100vh;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.eye-toggle-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Métricas */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.metric-card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.metric-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.metric-value {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 800;
  margin-top: 0.75rem;
  letter-spacing: -0.025em;
}

.text-dark { color: #111827; }
.text-blue { color: #1e56fb; }
.text-green { color: #00875a; }
.text-gray { color: #9ca3af; }

.metric-icon {
  font-size: 1.25rem;
  font-weight: 300;
}

/* Grid dos Cartões */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.card-wrapper {
  background-color: #ffffff;
  border-radius: 1rem;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Estilo do Card Físico */
.card-item {
  height: 13rem;
  border-radius: 0.875rem;
  padding: 1.25rem;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0.25rem 0.25rem 0 0.25rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.card-item:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.edit-card-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  transition: background 0.2s;
}

.edit-card-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}

.card-bank {
  font-size: 0.75rem;
  opacity: 0.9;
  display: block;
  font-weight: 400;
  letter-spacing: 0.025em;
}

.card-name {
  font-weight: 700;
  font-size: 1.25rem;
  margin-top: 0.25rem;
  letter-spacing: -0.025em;
}

.card-number {
  letter-spacing: 0.25em;
  font-size: 1.125rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  opacity: 0.9;
  margin-top: auto;
  margin-bottom: auto;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.footer-label {
  font-size: 0.6875rem;
  opacity: 0.8;
  display: block;
  font-weight: 400;
  margin-bottom: 0.125rem;
  text-transform: uppercase;
}

.footer-value {
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.025em;
}

.chip-icon {
  width: 2.25rem;
  height: 1.5rem;
  border: 2px solid #ffffff;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chip-line {
  width: 100%;
  height: 0.25rem;
  background-color: #ffffff;
  opacity: 0.4;
}

/* Detalhes de Uso do Cartão */
.card-usage-details {
  padding: 1rem 1.25rem;
}

.usage-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  margin-bottom: 0.375rem;
}

.usage-label { color: #6b7280; font-weight: 500; }
.usage-percent { color: #111827; font-weight: 700; }

.progress-bar-bg {
  width: 100%;
  height: 6px;
  background-color: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 9999px;
  transition: width 0.3s ease;
}

/* Estado Mensagem */
.state-message {
  text-align: center;
  padding: 3rem 1rem;
  background-color: #ffffff;
  border-radius: 1rem;
  color: #6b7280;
  border: 1px dashed #e5e7eb;
}

.error-message {
  color: #dc2626;
  border-color: #fecaca;
  background-color: #fef2f2;
}

/* Botão Flutuante (FAB) */
.fab-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #00875a;
  color: white;
  border: none;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  z-index: 10;
}

.fab-button:hover {
  transform: scale(1.05);
  background-color: #006b2b;
}

/* Estilos do Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 50;
}

.modal-container {
  background-color: #ffffff;
  border-radius: 1rem;
  max-width: 28rem;
  width: 100%;
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid #f3f4f6;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.close-btn {
  color: #9ca3af;
  font-size: 1.125rem;
  font-weight: 700;
  background: none;
  border: none;
  cursor: pointer;
}

.error-alert {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #fef2f2;
  color: #dc2626;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.375rem;
}

.form-input {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: transparent;
  box-shadow: 0 0 0 2px #00875a;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.color-input {
  width: 3rem;
  height: 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  padding: 0.25rem;
  background-color: #ffffff;
}

.color-value {
  font-size: 0.75rem;
  color: #6b7280;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.75rem;
}

.btn-cancel {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  background-color: transparent;
  cursor: pointer;
}

.btn-submit {
  flex: 1;
  padding: 0.75rem;
  background-color: #00875a;
  color: #ffffff;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
<script setup>
import { notify } from '@/services/toast'
import { reactive, ref } from 'vue'

const emit = defineEmits(['close', 'success'])

const form = reactive({
  nome: '',
  banco: '',
  limite: '',
  data_vencimento: '',
  cor: '#006B2B'
})

const enviando = ref(false)
const erro = ref('')

const submitForm = async () => {
  enviando.value = true
  erro.value = ''

  try {

    const token = localStorage.getItem('token') || localStorage.getItem('access')

    const res = await fetch('/api/cartoes/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...form,
        limite: parseFloat(form.limite)
      })
    })

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('Sessão expirada ou usuário não autenticado.')
      }
      throw new Error('Erro ao salvar o cartão no servidor.')
    }

    const novoCartao = await res.json()
    emit('success', novoCartao)
  } catch (err) {
    erro.value = err.message || 'Erro inesperado.'
    notify.error(erro.value)
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">Novo Cartão de Crédito</h2>
        <button @click="$emit('close')" class="close-btn">✕</button>
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
            <label class="form-label">Limite (R$)</label>
            <input
              v-model="form.limite"
              type="number"
              step="0.01"
              placeholder="5000"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Vencimento</label>
            <input
              v-model="form.data_vencimento"
              type="text"
              placeholder="15/04/2026"
              required
              class="form-input"
            />
          </div>
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

        <div class="modal-actions">
          <button
            type="button"
            @click="$emit('close')"
            class="btn-cancel"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="enviando"
            class="btn-submit"
          >
            {{ enviando ? 'Salvando...' : 'Salvar no Backend' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
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
  background-color: var(--opes-paper);
  border-radius: 1rem;
  max-width: 28rem;
  width: 100%;
  padding: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid var(--opes-cream);
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
  color: var(--opes-ink);
}

.close-btn {
  color: var(--opes-muted);
  font-size: 1.125rem;
  font-weight: 700;
  background: none;
  border: none;
  cursor: pointer;
}

.close-btn:hover {
  color: var(--opes-forest);
}

.error-alert {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: var(--opes-paper);
  color: var(--opes-danger);
  font-size: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--opes-cream);
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
  color: var(--opes-ink);
  margin-bottom: 0.375rem;
}

.form-input {
  width: 100%;
  border: 1px solid var(--opes-cream);
  border-radius: 0.75rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: transparent;
  box-shadow: 0 0 0 2px var(--opes-forest);
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.color-input {
  width: 3rem;
  height: 2.5rem;
  border: 1px solid var(--opes-cream);
  border-radius: 0.75rem;
  cursor: pointer;
  padding: 0.25rem;
  background-color: var(--opes-paper);
}

.color-value {
  font-size: 0.75rem;
  color: var(--opes-forest);
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
  border: 1px solid var(--opes-cream);
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--opes-ink);
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel:hover {
  background-color: var(--opes-paper);
}

.btn-submit {
  flex: 1;
  padding: 0.75rem;
  background-color: var(--opes-forest);
  color: var(--opes-paper);
  border: none;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: var(--opes-forest);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

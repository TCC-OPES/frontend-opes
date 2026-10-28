
<script setup>
import { reactive, computed, ref } from 'vue'
import { useCartoesStore } from '@/store/cartoes'

const emit = defineEmits(['close', 'success'])
const cartoesStore = useCartoesStore()

const salvando = ref(false)

const form = reactive({
  nome: '',
  banco: '',
  limite_total: '',
  vencimento: '',
  cor: '#14372D'
})

// Ajusta automaticamente a cor do texto
const corTexto = computed(() => {
  const hex = form.cor.replace('#', '')

  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255

  const linearizar = (valor) =>
    valor <= 0.04045
      ? valor / 12.92
      : ((valor + 0.055) / 1.055) ** 2.4

  const luminancia =
    0.2126 * linearizar(r) +
    0.7152 * linearizar(g) +
    0.0722 * linearizar(b)

  return luminancia > 0.179 ? '#14372D' : '#FFFFFF'
})

// Envia os dados para o backend
const submitForm = async () => {
  if (salvando.value) return

  salvando.value = true

  try {
    const novoCartao = await cartoesStore.adicionarCartao({
      ...form,
      limite_total: Number(form.limite_total)
    })

    emit('success', novoCartao)
    emit('close')
  } catch (err) {
    // A mensagem de erro é exibida pela store
    console.error('Erro ao cadastrar cartão:', err)
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div
      class="modal-container"
      role="dialog"
      aria-modal="true"
      aria-labelledby="novo-cartao-titulo"
    >
      <!-- Cabeçalho -->
      <div class="modal-header">
        <h2 id="novo-cartao-titulo" class="modal-title">
          Novo Cartão de Crédito
        </h2>

        <button
          type="button"
          class="close-btn"
          aria-label="Fechar"
          @click="$emit('close')"
        >
          ✕
        </button>
      </div>

      <!-- Mensagem de erro -->
      <div
        v-if="cartoesStore.erro"
        class="error-alert"
        role="alert"
      >
        {{ cartoesStore.erro }}
      </div>

      <!-- Formulário -->
      <form class="modal-form" @submit.prevent="submitForm">
        <div class="form-group">
          <label class="form-label" for="nome-cartao">
            Nome do Cartão
          </label>

          <input
            id="nome-cartao"
            v-model.trim="form.nome"
            type="text"
            placeholder="Ex: Cartão Platinum"
            maxlength="100"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label class="form-label" for="banco-cartao">
            Banco / Instituição
          </label>

          <input
            id="banco-cartao"
            v-model.trim="form.banco"
            type="text"
            placeholder="Ex: Banco do Brasil"
            maxlength="100"
            required
            class="form-input"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label" for="limite-cartao">
              Limite (R$)
            </label>

            <input
              id="limite-cartao"
              v-model="form.limite_total"
              type="number"
              min="0.01"
              max="99999999.99"
              step="0.01"
              placeholder="5000"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="vencimento-cartao">
              Vencimento
            </label>

            <input
              id="vencimento-cartao"
              v-model="form.vencimento"
              type="date"
              required
              class="form-input"
            />
          </div>
        </div>

        <!-- Seletor de qualquer cor -->
        <div class="form-group">
          <label class="form-label" for="cor-cartao">
            Cor do Cartão
          </label>

          <div class="color-picker-wrapper">
            <input
              id="cor-cartao"
              v-model="form.cor"
              type="color"
              class="color-input"
            />

            <div class="color-info">
              <span class="color-title">
                Personalizar cor
              </span>

              <span class="color-value">
                {{ form.cor.toUpperCase() }}
              </span>
            </div>
          </div>

          <!-- Prévia em tempo real -->
          <div
            class="card-color-preview"
            :style="{
              backgroundColor: form.cor,
              color: corTexto
            }"
          >
            <div class="preview-header">
              <span>{{ form.banco || 'Seu Banco' }}</span>
              <span class="preview-symbol">◈</span>
            </div>

            <div class="preview-center">
              <strong>{{ form.nome || 'Nome do Cartão' }}</strong>
              <span>•••• •••• •••• ••••</span>
            </div>

            <div class="preview-footer">
              <span>OPES</span>
              <span>Cartão de Crédito</span>
            </div>
          </div>
        </div>

        <!-- Botões -->
        <div class="modal-actions">
          <button
            type="button"
            class="btn-cancel"
            :disabled="salvando"
            @click="$emit('close')"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="btn-submit"
            :disabled="salvando"
          >
            {{ salvando ? 'Salvando...' : 'Adicionar Cartão' }}
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
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
}

.modal-container {
  background: #F2EFEA;
  border-radius: 1.25rem;
  max-width: 30rem;
  width: 100%;
  max-height: 92vh;
  overflow-y: auto;
  padding: 1.5rem;
  box-sizing: border-box;
  box-shadow: 0 25px 50px rgba(20, 55, 45, 0.2);
  border: 1px solid #DBD5C9;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #14372D;
  margin: 0;
}

.close-btn {
  color: #14372D;
  font-size: 1.125rem;
  font-weight: 700;
  background: none;
  border: none;
  cursor: pointer;
}

.close-btn:hover {
  color: #B7835D;
}

.error-alert {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.8rem;
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #14372D;
}

.form-input {
  width: 100%;
  border: 1px solid #DBD5C9;
  border-radius: 0.75rem;
  padding: 0.8rem;
  font-size: 0.875rem;
  outline: none;
  background: #FFFFFF;
  color: #14372D;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  border-color: #B7835D;
  box-shadow: 0 0 0 3px rgba(183, 131, 93, 0.15);
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #FFFFFF;
  border: 1px solid #DBD5C9;
  border-radius: 0.75rem;
}

.color-input {
  width: 55px;
  height: 45px;
  padding: 3px;
  border: 1px solid #DBD5C9;
  border-radius: 0.5rem;
  background: #FFFFFF;
  cursor: pointer;
}

.color-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.color-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #14372D;
}

.color-value {
  font-size: 0.75rem;
  color: #B7835D;
  font-family: monospace;
}

.card-color-preview {
  min-height: 160px;
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  gap: 1rem;
  transition: background-color 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-header,
.preview-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
}

.preview-header {
  font-weight: 600;
}

.preview-symbol {
  font-size: 1.5rem;
}

.preview-center {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-center strong {
  font-size: 1.1rem;
}

.preview-center span {
  font-size: 0.95rem;
  letter-spacing: 0.15em;
}

.preview-footer {
  opacity: 0.85;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 0.75rem;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 0.85rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-cancel {
  border: 1px solid #DBD5C9;
  background: #DBD5C9;
  color: #14372D;
}

.btn-cancel:hover {
  background: #ccc5b8;
}

.btn-submit {
  background: #14372D;
  color: #FFFFFF;
  border: none;
}

.btn-submit:hover {
  background: #245445;
}

.btn-cancel:disabled,
.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .modal-container {
    padding: 1.25rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .card-color-preview {
    min-height: 145px;
  }
}
</style>

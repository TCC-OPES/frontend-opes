<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h2>Nova Transação</h2>
        <button class="btn-close" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="amount-input-container">
          <span>R$</span>
          <input type="text" v-model="amount" placeholder="0,00" required />
        </div>

        <div class="type-toggle">
          <button
            type="button"
            :class="['btn-type expense', { active: type === 'expense' }]"
            @click="type = 'expense'"
          >Despesa</button>
          <button
            type="button"
            :class="['btn-type income', { active: type === 'income' }]"
            @click="type = 'income'"
          >Receita</button>
        </div>

        <div class="form-group">
          <label>Categoria</label>
          <select v-model="category" required>
            <option value="">Selecione uma categoria</option>
            <option value="Alimentação">Alimentação</option>
            <option value="Transporte">Transporte</option>
            <option value="Lazer">Lazer</option>
          </select>
        </div>

        <div class="form-group">
          <label>Carteira / Método</label>
          <select v-model="wallet" required>
            <option value="">Selecione a carteira</option>
            <option value="Carteira Principal">Carteira Principal</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
          </select>
        </div>

        <div class="form-group">
          <label>Data</label>
          <input type="date" v-model="date" required />
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <input type="text" v-model="description" placeholder="Ex: Supermercado Central" />
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Salvando...' : 'Adicionar Transação' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { createTransaction } from '../../../api/transactions';

const emit = defineEmits(['close', 'added']);

const amount = ref('0,00');
const type = ref('expense');
const category = ref('');
const wallet = ref('');
const date = ref(new Date().toISOString().split('T')[0]);
const description = ref('');
const loading = ref(false);

const handleSubmit = async () => {
  loading.value = true;
  const cleanAmount = parseFloat(amount.value.replace('.', '').replace(',', '.'));

  const payload = {
    amount: cleanAmount,
    type: type.value,
    category: category.value,
    wallet: wallet.value,
    date: date.value,
    description: description.value
  };

  try {
    const newTx = await createTransaction(payload);
    emit('added', newTx); // Avisa o pai que adicionou com sucesso
    emit('close');        // Fecha o modal
  } catch (error) {
    alert('Erro ao salvar transação');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* --- OVERLAY (Fundo Escurecido que cobre a tela toda) --- */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(2px); /* Efeito opcional de desfoque leve no fundo */
}

/* --- CONTAINER DO MODAL --- */
.modal-container {
    background-color: #ffffff;
    width: 100%;
    max-width: 440px;
    padding: 30px;
    border-radius: 24px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
}

/* --- CABEÇALHO DO MODAL --- */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.modal-header h2 {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
}

.btn-close {
    background: none;
    border: none;
    font-size: 28px;
    color: #999999;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    transition: color 0.2s ease;
}

.btn-close:hover {
    color: #333333;
}

/* --- CAMPO DE VALOR EM DESTAQUE --- */
.amount-input-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 28px;
}

.amount-input-container span {
    font-size: 24px;
    font-weight: 700;
    color: #333333;
}

.amount-input-container input {
    border: none;
    font-size: 38px;
    font-weight: 700;
    width: 100%;
    max-width: 200px;
    outline: none;
    color: #333333;
}

.amount-input-container input::placeholder {
    color: #cccccc;
}

/* --- ALTERNADOR (TOGGLE) DE TIPO --- */
.type-toggle {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
}

.btn-type {
    flex: 1;
    padding: 14px;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    background-color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.2s ease;
}

/* Estados ativos específicos para Despesa e Receita */
.btn-type.expense.active {
    background-color: #fef2f2;
    color: #dc2626;
    border-color: #fca5a5;
}

.btn-type.income.active {
    background-color: #f0fdf4;
    color: #16a34a;
    border-color: #86efac;
}

/* --- CAMPOS DO FORMULÁRIO (SELECTS E INPUTS) --- */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;
}

.form-group label {
    font-size: 13px;
    font-weight: 600;
    color: #475569;
}

.form-group select,
.form-group input[type="date"],
.form-group input[type="text"] {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    font-size: 14px;
    color: #333333;
    background-color: #ffffff;
    outline: none;
    transition: border-color 0.2s ease;
}

.form-group select:focus,
.form-group input:focus {
    border-color: #006400; /* Destaque ao clicar no campo */
}

/* --- BOTÃO DE SALVAR --- */
.btn-submit {
    width: 100%;
    padding: 16px;
    background-color: #006400; /* Verde escuro do botão principal */
    color: #ffffff;
    border: none;
    border-radius: 14px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
    transition: background-color 0.2s ease;
}

.btn-submit:hover {
    background-color: #004d00;
}

.btn-submit:disabled {
    background-color: #cbd5e1;
    color: #94a3b8;
    cursor: not-allowed;
}
</style>

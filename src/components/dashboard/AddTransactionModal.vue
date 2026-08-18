<template>
  <div>
    <!-- Botão Flutuante (FAB) -->
    <button
      @click="isOpen = true"
      class="fab-btn"
      aria-label="Adicionar transação"
    >
      <i class="fa-solid fa-plus"></i>
    </button>

    <!-- Modal Overlay -->
    <div v-if="isOpen" class="modal-backdrop">
      <div class="modal-content">
        
        <!-- Cabeçalho -->
        <div class="modal-header">
          <h2>Nova Transação</h2>
          <button @click="isOpen = false" class="close-btn">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Formulário -->
        <form @submit.prevent="handleSubmit" class="modal-form">
          
          <!-- Tipo de Transação -->
          <div class="form-group">
            <label>Tipo de Transação</label>
            <div class="grid-2">
              <button
                type="button"
                @click="type = 'despesa'"
                :class="['btn-option', { active: type === 'despesa' }]"
              >
                <i class="fa-solid fa-chart-line-down rotate-45"></i>
                Despesa
              </button>

              <button
                type="button"
                @click="type = 'receita'"
                :class="['btn-option', { active: type === 'receita' }]"
              >
                <i class="fa-solid fa-chart-line"></i>
                Receita
              </button>
            </div>
          </div>

          <!-- Descrição -->
          <div class="form-group">
            <label>Descrição</label>
            <input
              type="text"
              placeholder="Ex: Compra no supermercado"
              class="input-field"
            />
          </div>

          <!-- Valor -->
          <div class="form-group">
            <label>Valor (R$)</label>
            <div class="input-icon-wrapper">
              <span class="currency-symbol">$</span>
              <input
                type="text"
                placeholder="0,00"
                class="input-field pl-currency"
              />
            </div>
          </div>

          <!-- Categorias -->
          <div class="form-group">
            <label>Categoria</label>
            <div class="grid-4">
              <button
                v-for="cat in categories"
                :key="cat.id"
                type="button"
                @click="category = cat.id"
                :class="['btn-category', { active: category === cat.id }]"
              >
                <i :class="['fa-solid', cat.icon]"></i>
                <span>{{ cat.label }}</span>
              </button>
            </div>
          </div>

          <!-- Data e Método -->
          <div class="grid-2">
            <div class="form-group">
              <label>Data</label>
              <div class="input-icon-wrapper">
                <input type="text" value="18/08/2026" class="input-field pl-icon" />
                <i class="fa-regular fa-calendar input-icon"></i>
              </div>
            </div>

            <div class="form-group">
              <label>Método de Pagamento</label>
              <div class="input-icon-wrapper">
                <select class="input-field pl-icon">
                  <option value="">Selecione</option>
                  <option value="cartao">Cartão de Crédito</option>
                  <option value="pix">PIX</option>
                  <option value="dinheiro">Dinheiro</option>
                </select>
                <i class="fa-regular fa-credit-card input-icon"></i>
              </div>
            </div>
          </div>

          <!-- Observações -->
          <div class="form-group">
            <label>Observações (opcional)</label>
            <div class="input-icon-wrapper">
              <textarea
                rows="3"
                placeholder="Adicione detalhes sobre esta transação..."
                class="input-field pl-icon resize-none"
              ></textarea>
              <i class="fa-regular fa-file-lines input-icon top-icon"></i>
            </div>
          </div>

          <!-- Botões -->
          <div class="grid-2 pt-2">
            <button type="button" @click="isOpen = false" class="btn-cancel">
              Cancelar
            </button>
            <button type="submit" class="btn-submit">
              Salvar Transação
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);
const type = ref('despesa');
const category = ref('');

const categories = [
  { id: 'alimentacao', label: 'Alimentação', icon: 'fa-cart-shopping' },
  { id: 'transporte', label: 'Transporte', icon: 'fa-car' },
  { id: 'lazer', label: 'Lazer', icon: 'fa-mug-hot' },
  { id: 'moradia', label: 'Moradia', icon: 'fa-house' },
  { id: 'compras', label: 'Compras', icon: 'fa-gift' },
  { id: 'saude', label: 'Saúde', icon: 'fa-heart' },
  { id: 'tecnologia', label: 'Tecnologia', icon: 'fa-mobile-screen-button' },
  { id: 'contas', label: 'Contas', icon: 'fa-bolt' },
];

const handleSubmit = () => {
  isOpen.value = false;
};
</script>

<style scoped>
/* CSS do Botão Flutuante e Estrutura do Modal */
.fab-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #059669 0%, #2563eb 100%);
  color: #ffffff;
  border: none;
  font-size: 1.25rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 99999;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.fab-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.4);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  padding: 16px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  color: #94a3b8;
  cursor: pointer;
}

.modal-form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.btn-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-option.active {
  border-color: #2563eb;
  background-color: #eff6ff;
  color: #2563eb;
}

.btn-category {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 4px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #475569;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-category.active {
  border-color: #2563eb;
  background-color: #eff6ff;
  color: #2563eb;
}

.input-field {
  width: 100%;
  padding: 10px 14px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
}

.input-field:focus {
  background-color: white;
  border-color: #2563eb;
}

.input-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  pointer-events: none;
}

.top-icon {
  top: 12px;
}

.currency-symbol {
  position: absolute;
  left: 14px;
  color: #94a3b8;
  font-weight: 600;
}

.pl-currency {
  padding-left: 28px;
}

.pl-icon {
  padding-left: 36px;
}

.resize-none {
  resize: none;
}

.btn-cancel {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #334155;
  font-weight: 600;
  cursor: pointer;
}

.btn-submit {
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #047857, #1d4ed8);
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.pt-2 {
  padding-top: 8px;
}

.rotate-45 {
  transform: rotate(45deg);
}
</style>
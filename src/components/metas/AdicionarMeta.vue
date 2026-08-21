<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

const emit = defineEmits(['fechar', 'salvar'])

const form = ref({
  nome: '',
  categoria: '',
  valorTotal: '',
  valorAtual: '',
  mensal: '',
  prazoData: '',
  descricao: ''
})

function submitForm() {
  if (!form.value.nome || !form.value.valorTotal) return
  emit('salvar', { ...form.value })
  emit('fechar')
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <h2>Adicionar Meta</h2>
        <button class="btn-close" @click="$emit('fechar')">
          <X class="icon-close" />
        </button>
      </div>

      <form @submit.prevent="submitForm" class="modal-form">
        <div class="form-group">
          <label>Nome da Meta</label>
          <input 
            v-model="form.nome" 
            type="text" 
            placeholder="Ex: Viagem para o Japão" 
            required
          />
        </div>

        <div class="form-group">
          <label>Categoria</label>
          <input 
            v-model="form.categoria" 
            type="text" 
            placeholder="Ex: Viagem, Veículo" 
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Valor Total (R$)</label>
            <input 
              v-model="form.valorTotal" 
              type="number" 
              placeholder="10000" 
              required
            />
          </div>
          <div class="form-group">
            <label>Já Guardado (R$)</label>
            <input 
              v-model="form.valorAtual" 
              type="number" 
              placeholder="2000" 
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Aporte Mensal (R$)</label>
            <input 
              v-model="form.mensal" 
              type="number" 
              placeholder="500" 
            />
          </div>
          <div class="form-group">
            <label>Data Limite</label>
            <input 
              v-model="form.prazoData" 
              type="text" 
              placeholder="Ex: Dezembro 2026" 
            />
          </div>
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <textarea 
            v-model="form.descricao" 
            placeholder="Breve descrição da meta..." 
            rows="2"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="$emit('fechar')">
            Cancelar
          </button>
          <button type="submit" class="btn-submit">
            Salvar Meta
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
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 50;
}

.modal-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-header h2 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
}

.btn-close:hover {
  color: #475569;
}

.icon-close {
  width: 20px;
  height: 20px;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-sizing: border-box;
  outline: none;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #059669;
}

.form-group textarea {
  resize: none;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
}

.btn-cancel {
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  background: none;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.btn-cancel:hover {
  background-color: #f1f5f9;
}

.btn-submit {
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  background-color: #006400;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.btn-submit:hover {
  background-color: #228b22;
}
</style>
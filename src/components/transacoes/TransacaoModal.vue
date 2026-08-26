<script setup>
import { ref } from 'vue'
import { useTransacoesStore } from '@/store/transacoes'

const emit = defineEmits(['fechar'])
const transacoesStore = useTransacoesStore()

// Objeto reativo mapeando exatamente os campos do Django
const formulario = ref({
  titulo: '',
  categoria: '',
  tipo: 'receita',
  valor: '',
  data: new Date().toISOString().split('T')[0] // Data de hoje formatada
})

const carregandoSalvar = ref(false)

async function submeterFormulario() {
  carregandoSalvar.value = true
  const sucesso = await transacoesStore.criarTransacao(formulario.value)
  carregandoSalvar.value = false

  if (sucesso) {
    emit('fechar') // Fecha a modal se deu certo
  }
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Nova Transação</h2>
        <button class="btn-fechar" @click="emit('fechar')">&times;</button>
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
          <label>Valor (R$)</label>
          <input type="number" step="0.01" v-model="formulario.valor" placeholder="0.00" required />
        </div>

        <div class="grupo-input">
          <label>Data</label>
          <input type="date" v-model="formulario.data" required />
        </div>

        <div class="modal-footer">
          <type class="btn-secundario" type="button" @click="emit('fechar')">Cancelar</type>
          <button class="btn-primario" type="submit" :disabled="carregandoSalvar">
            {{ carregandoSalvar ? 'Salvando...' : 'Salvar Transação' }}
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
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 100%;
  max-width: 450px;
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
  color: #0f172a;
}

.btn-fechar {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
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
  color: #334155;
}

.grupo-input input, .grupo-input select {
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
}

.grupo-input input:focus, .grupo-input select:focus {
  border-color: #16a34a;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.btn-secundario {
  background: #f1f5f9;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}

.btn-primario {
  background: #16a34a;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  color: white;
  cursor: pointer;
}
</style>

<script setup>
import { ref } from 'vue'
import { useTransacoesStore } from '@/store/transacoes'

const emit = defineEmits(['fechar'])
const transacoesStore = useTransacoesStore()


const formulario = ref({
  titulo: '',
  categoria: '',
  tipo: 'receita',
  valor: '',
  data: new Date().toLocaleDateString('sv-SE')
})

const carregandoSalvar = ref(false)

async function submeterFormulario() {
  carregandoSalvar.value = true
  const sucesso = await transacoesStore.criarTransacao(formulario.value)
  carregandoSalvar.value = false

  if (sucesso) {
    emit('fechar')
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
          <input type="number" step="0.01" min="0.01" v-model="formulario.valor" placeholder="0.00" required />
        </div>

        <div class="grupo-input">
          <label>Data</label>
          <input type="date" v-model="formulario.data" required />
        </div>

        <div class="modal-footer">
          <button class="btn-secundario" type="button" @click="emit('fechar')">Cancelar</button>
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
  color: var(--opes-ink);
}

.btn-fechar {
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--opes-forest);
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
</style>

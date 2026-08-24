<script setup>
import { ref } from 'vue'
import SideBarComponent from '../components/SideBarComponent.vue'
import HeaderComponent from '../components/HeaderComponent.vue'
import InvestimentoComponent from '../components/investimentos/InvestimentoComponent.vue'
import api from '../services/api'

const investimentoRef = ref(null)
const exibeModal = ref(false)
const salvando = ref(false)

const novoAtivo = ref({
  nome: '',
  valor: '',
  rendimento: '',
  cor: '#2563EB'
})

const abrirModal = () => {
  novoAtivo.value = { nome: '', valor: '', rendimento: '', cor: '#2563EB' }
  exibeModal.value = true
}

const fecharModal = () => {
  exibeModal.value = false
}

const salvarInvestimento = async () => {
  if (!novoAtivo.value.nome || !novoAtivo.value.valor) return

  try {
    salvando.value = true
    const payload = {
      nome: novoAtivo.value.nome,
      valor_investido: Number(novoAtivo.value.valor),
      rentabilidade: Number(novoAtivo.value.rendimento) || 0,
      cor: novoAtivo.value.cor
    }

    const { data } = await api.post('api/investimentos/', payload)

    if (investimentoRef.value) {
      investimentoRef.value.adicionarAtivoLocal(data)
    }

    fecharModal()
  } catch (erro) {
    console.error('Erro ao salvar investimento:', erro)
  } finally {
    salvando.value = false
  }
}
</script>

<template>
  <div class="app-layout">
    <SideBarComponent />

    <div class="main-wrapper">
      <HeaderComponent />

      <main class="main-content">
        <div class="conteudo-interno">
          <InvestimentoComponent ref="investimentoRef" />
        </div>
      </main>

      <button @click="abrirModal" class="fab-button" title="Novo Investimento">
        <i class="fas fa-plus"></i>
      </button>

      <div v-if="exibeModal" class="modal-overlay" @click.self="fecharModal">
        <div class="modal-content">
          <h3>Novo Investimento</h3>
          <form @submit.prevent="salvarInvestimento">
            <div class="form-group">
              <label>Nome do Ativo</label>
              <input v-model="novoAtivo.nome" type="text" placeholder="Ex: Tesouro Direto" required />
            </div>

            <div class="form-group">
              <label>Valor Investido (R$)</label>
              <input v-model.number="novoAtivo.valor" type="number" step="0.01" placeholder="1000.00" required />
            </div>

            <div class="form-group">
              <label>Rendimento (%)</label>
              <input v-model.number="novoAtivo.rendimento" type="number" step="0.1" placeholder="10.5" required />
            </div>

            <div class="form-group">
              <label>Cor de Exibição</label>
              <input v-model="novoAtivo.cor" type="color" class="input-color" />
            </div>

            <div class="modal-actions">
              <button type="button" @click="fecharModal" class="btn-secondary">Cancelar</button>
              <button type="submit" class="btn-primary" :disabled="salvando">
                {{ salvando ? 'Salvando...' : 'Adicionar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #ffffff;
  overflow: hidden;
  margin: 0;
  border: none;
}

.app-layout :deep(.desktop-sidebar) {
  display: none !important;
}

.main-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 1rem 100px 1rem;
  width: 100%;
  box-sizing: border-box;
  background-color: #f8fafc;
}

.conteudo-interno {
  position: relative;
  width: 100%;
}

.fab-button {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 48px;
  height: 48px;
  background-color: #0f766e;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 99;
  transition: transform 0.2s, background-color 0.2s;
}

.fab-button:hover {
  background-color: #0d9488;
  transform: scale(1.05);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: white;
  width: 100%;
  max-width: 440px;
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  margin: 0 0 1.25rem 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.form-group {
  margin-bottom: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-group label {
  font-size: 0.813rem;
  color: #475569;
  font-weight: 600;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.938rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #2563eb;
}

.input-color {
  height: 44px;
  padding: 0.25rem;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 0.875rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 0.938rem;
  cursor: pointer;
}

.btn-primary { background: #0f766e; color: white; }
.btn-secondary { background: #f1f5f9; color: #475569; }

@media (min-width: 640px) {
  .main-content {
    padding: 1.5rem 1.5rem 100px 1.5rem;
  }
}

@media (min-width: 1024px) {
  .app-layout {
    background-color: #f4f6f9;
  }
  .app-layout :deep(.desktop-sidebar) {
    display: flex !important;
  }
  .main-wrapper {
    height: 100vh;
    overflow: hidden;
    background-color: #f4f6f9;
  }
  .main-content {
    padding: 32px 40px;
    overflow-y: auto;
    background-color: #f4f6f9;
  }
  .fab-button {
    bottom: 20px;
  }
}
</style>

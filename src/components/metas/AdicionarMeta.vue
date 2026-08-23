<script setup>
import { ref, watch } from 'vue'
import { X } from '@lucide/vue'

const props = defineProps({
  metaParaEditar: {
    type: Object,
    default: null
  }
})

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

// O watch garante que o formulário preencha os dados no momento exato em que a prop chegar
watch(
  () => props.metaParaEditar,
  (novaMeta) => {
    if (novaMeta) {
      form.value = {
        nome: novaMeta.titulo || novaMeta.nome || '',
        categoria: novaMeta.categoria || '',
        valorTotal: novaMeta.valor_objetivo || novaMeta.valorTotal || '',
        valorAtual: novaMeta.valor_atual || novaMeta.valorAtual || '',
        mensal: novaMeta.valor_mensal || novaMeta.mensal || '',
        prazoData: novaMeta.data_limite || novaMeta.prazoData || '',
        descricao: novaMeta.descricao || ''
      }
    } else {
      // Limpa os campos se for uma nova meta
      form.value = {
        nome: '',
        categoria: '',
        valorTotal: '',
        valorAtual: '',
        mensal: '',
        prazoData: '',
        descricao: ''
      }
    }
  },
  { immediate: true }
)

function submitForm() {
  if (!form.value.nome || !form.value.valorTotal || !form.value.prazoData || !form.value.categoria) {
    return
  }

  const payload = {
    titulo: form.value.nome,
    categoria: form.value.categoria,
    valor_objetivo: Number(Number(form.value.valorTotal).toFixed(2)),
    valor_mensal: Number(Number(form.value.mensal || 0).toFixed(2)),
    data_limite: form.value.prazoData,
    valor_atual: Number(Number(form.value.valorAtual || 0).toFixed(2)),
    descricao: form.value.descricao
  }

  emit('salvar', payload)
  emit('fechar')
}
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <h2>{{ metaParaEditar ? 'Editar Meta' : 'Adicionar Meta' }}</h2>
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
          <select v-model="form.categoria" required class="select-input">
            <option value="" disabled>Selecione uma categoria</option>
            <option value="lazer">Lazer</option>
            <option value="veiculo">Veículo</option>
            <option value="seguranca">Segurança</option>
            <option value="educacao">Educação</option>
            <option value="moradia">Moradia</option>
            <option value="saude">Saúde</option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Valor Total (R$)</label>
            <input
              v-model="form.valorTotal"
              type="number"
              step="0.01"
              placeholder="10000"
              required
            />
          </div>
          <div class="form-group">
            <label>Já Guardado (R$)</label>
            <input
              v-model="form.valorAtual"
              type="number"
              step="0.01"
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
              step="0.01"
              placeholder="500"
              required
            />
          </div>
          <div class="form-group">
            <label>Data Limite</label>
            <input
              v-model="form.prazoData"
              type="date"
              required
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
            {{ metaParaEditar ? 'Atualizar Meta' : 'Salvar Meta' }}
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
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-sizing: border-box;
  outline: none;
  background-color: #ffffff;
  color: #1e293b;
}

.form-group input:focus,
.form-group select:focus,
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

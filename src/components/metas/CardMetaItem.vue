<script setup>
import { Target, Calendar, Pencil, Trash2 } from '@lucide/vue'

defineProps({
  meta: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['editar', 'deletar'])

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })
}

function formatarData(dataISO) {
  if (!dataISO) return 'Sem data'
  const [ano, mes, dia] = dataISO.split('-')
  return `${dia}/${mes}/${ano}`
}

function calcularPercentual(atual, total) {
  if (!total || Number(total) === 0) return '0.0'
  return ((Number(atual) / Number(total)) * 100).toFixed(1)
}
</script>

<template>
  <div class="goal-card">
    <div class="goal-header">
      <div class="header-left">
        <div class="icon-wrapper">
          <Target class="icon-target" />
        </div>
        <div class="goal-titles">
          <h3>{{ meta.titulo || meta.nome }}</h3>
          <span class="category">{{ meta.categoria || 'Geral' }}</span>
        </div>
      </div>

      <div class="actions">
        <button class="btn-action edit" @click="emit('editar', meta)" title="Editar Meta">
          <Pencil class="action-icon" />
        </button>
        <button class="btn-action delete" @click="emit('deletar', meta.id)" title="Excluir Meta">
          <Trash2 class="action-icon" />
        </button>
      </div>
    </div>

    <p class="goal-description">{{ meta.descricao }}</p>

    <div class="progress-container">
      <div class="progress-text">
        <span class="label">Progresso</span>
        <span class="percent">
          {{ calcularPercentual(meta.valor_atual || meta.valorAtual, meta.valor_objetivo || meta.valorTotal) }}%
        </span>
      </div>

      <div class="progress-bar-bg">
        <div
          class="progress-bar-fill"
          :style="{ width: `${Math.min(100, Number(calcularPercentual(meta.valor_atual || meta.valorAtual, meta.valor_objetivo || meta.valorTotal)))}%` }"
        ></div>
      </div>

      <div class="progress-values">
        <span>{{ formatarMoeda(meta.valor_atual || meta.valorAtual) }}</span>
        <span class="total">{{ formatarMoeda(meta.valor_objetivo || meta.valorTotal) }}</span>
      </div>
    </div>

    <div class="metrics-grid">
      <div class="metric">
        <span class="label">Faltam</span>
        <span class="val">
          {{ formatarMoeda(Math.max(0, Number(meta.valor_objetivo || meta.valorTotal || 0) - Number(meta.valor_atual || meta.valorAtual || 0))) }}
        </span>
      </div>
      <div class="metric">
        <span class="label">Mensal</span>
        <span class="val">{{ formatarMoeda(meta.valor_mensal || meta.mensal) }}</span>
      </div>
      <div class="metric">
        <span class="label">Status</span>
        <span class="val">Em andamento</span>
      </div>
    </div>

    <div class="date-footer">
      <Calendar class="icon-calendar" />
      <span>Prazo: {{ formatarData(meta.data_limite || meta.prazoData) }}</span>
    </div>
  </div>
</template>

<style scoped>
.goal-card {
  background-color: #ffffff;
  padding: 24px;
  border-radius: 20px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.goal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.icon-wrapper {
  padding: 12px;
  border-radius: 12px;
  background-color: #ecfdf5;
  color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-target {
  width: 24px;
  height: 24px;
}

.goal-titles h3 {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.goal-titles .category {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  text-transform: capitalize;
}

.actions {
  display: flex;
  gap: 4px;
}

.btn-action {
  background: transparent;
  border: none;
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.2s;
}

.btn-action.edit:hover {
  background-color: #f1f5f9;
  color: #2563eb;
}

.btn-action.delete:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

.action-icon {
  width: 16px;
  height: 16px;
}

.goal-description {
  font-size: 12px;
  color: #64748b;
  margin: 0;
}

.progress-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
}

.progress-text .label {
  color: #64748b;
}

.progress-text .percent {
  color: #059669;
}

.progress-bar-bg {
  width: 100%;
  background-color: #f1f5f9;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 999px;
  background-color: #059669;
  transition: width 0.3s ease;
}

.progress-values {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 700;
  color: #334155;
  padding-top: 4px;
}

.progress-values .total {
  color: #94a3b8;
  font-weight: 400;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding-top: 12px;
  border-top: 1px solid #f8fafc;
  font-size: 12px;
}

.metric .label {
  display: block;
  color: #94a3b8;
}

.metric .val {
  font-weight: 700;
  color: #1e293b;
}

.date-footer {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
  padding-top: 4px;
}

.icon-calendar {
  width: 14px;
  height: 14px;
}
</style>

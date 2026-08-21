<script setup>
import { Target, Calendar } from 'lucide-vue-next'

defineProps({
  meta: {
    type: Object,
    required: true
  }
})

function formatarMoeda(valor) {
  return (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function calcularPercentual(atual, total) {
  if (!total || total === 0) return '0.0'
  return ((atual / total) * 100).toFixed(1)
}
</script>

<template>
  <div class="goal-card">
    <div class="goal-header">
      <div class="icon-wrapper">
        <Target class="icon-target" />
      </div>
      <div class="goal-titles">
        <h3>{{ meta.nome }}</h3>
        <span class="category">{{ meta.categoria || 'Geral' }}</span>
      </div>
    </div>

    <p class="goal-description">{{ meta.descricao }}</p>

    <div class="progress-container">
      <div class="progress-text">
        <span class="label">Progresso</span>
        <span class="percent">
          {{ calcularPercentual(meta.valor_atual || meta.valorAtual, meta.valor_total || meta.valorTotal) }}%
        </span>
      </div>
      
      <div class="progress-bar-bg">
        <div 
          class="progress-bar-fill" 
          :style="{ width: `${Math.min(100, ( (meta.valor_atual || meta.valorAtual) / (meta.valor_total || meta.valorTotal) ) * 100)}%` }"
        ></div>
      </div>

      <div class="progress-values">
        <span>{{ formatarMoeda(meta.valor_atual || meta.valorAtual) }}</span>
        <span class="total">{{ formatarMoeda(meta.valor_total || meta.valorTotal) }}</span>
      </div>
    </div>

    <div class="metrics-grid">
      <div class="metric">
        <span class="label">Faltam</span>
        <span class="val">
          {{ formatarMoeda(Math.max(0, (meta.valor_total || meta.valorTotal) - (meta.valor_atual || meta.valorAtual))) }}
        </span>
      </div>
      <div class="metric">
        <span class="label">Mensal</span>
        <span class="val">{{ formatarMoeda(meta.mensal) }}</span>
      </div>
      <div class="metric">
        <span class="label">Prazo</span>
        <span class="val">{{ meta.prazo_meses || meta.prazoMeses || 12 }} meses</span>
      </div>
    </div>

    <div class="date-footer">
      <Calendar class="icon-calendar" />
      <span>Prazo: {{ meta.prazo_data || meta.prazoData || 'Sem data' }}</span>
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
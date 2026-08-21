<script setup>
import { Target, DollarSign, TrendingUp, CheckCircle } from 'lucide-vue-next'

defineProps({
  totalMetas: Number,
  valorTotal: Number,
  valorEconomizado: Number,
  progressoGeral: [Number, String]
})

function formatarK(valor) {
  return `R$ ${Math.round((valor || 0) / 1000)}k`
}
</script>

<template>
  <div class="summary-grid">
    <div class="summary-card">
      <div class="card-info">
        <span class="label">Total de Metas</span>
        <p class="value text-black">{{ totalMetas }}</p>
      </div>
      <Target class="icon text-gray" />
    </div>

    <div class="summary-card">
      <div class="card-info">
        <span class="label">Valor Total</span>
        <p class="value text-blue">{{ formatarK(valorTotal) }}</p>
      </div>
      <DollarSign class="icon text-blue" />
    </div>

    <div class="summary-card">
      <div class="card-info">
        <span class="label">Valor Economizado</span>
        <p class="value text-green">{{ formatarK(valorEconomizado) }}</p>
      </div>
      <TrendingUp class="icon text-green" />
    </div>

    <div class="summary-card">
      <div class="card-info">
        <span class="label">Progresso Geral</span>
        <p class="value text-green">{{ progressoGeral }}%</p>
      </div>
      <CheckCircle class="icon text-green" />
    </div>
  </div>
</template>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.summary-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.label {
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
}

.value {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.text-black { color: #0f172a; }
.text-blue { color: #2563eb; }
.text-green { color: #16a34a; }

.icon {
  width: 20px;
  height: 20px;
}

.text-gray { color: #94a3b8; }

@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
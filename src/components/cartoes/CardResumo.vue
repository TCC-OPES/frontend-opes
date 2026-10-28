<script setup>
import { computed } from 'vue'

const props = defineProps({
  cartoes: {
    type: Array,
    default: () => []
  }
})

const totalLimite = computed(() => {
  return props.cartoes.reduce((acc, card) => acc + (Number(card.limite) || 0), 0)
})

const totalUtilizado = computed(() => {
  return props.cartoes.reduce((acc, card) => acc + (Number(card.valor_utilizado) || 0), 0)
})

const totalDisponivel = computed(() => {
  return totalLimite.value - totalUtilizado.value
})

const formatCurrency = (value) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(',00', '')
}
</script>

<template>
  <div class="metrics-grid">
    
    <div class="metric-card">
      <div class="metric-info">
        <span class="metric-label">Limite Total</span>
        <p class="metric-value text-dark">
          {{ formatCurrency(totalLimite) }}
        </p>
      </div>
      <span class="metric-icon text-gray">$</span>
    </div>

    
    <div class="metric-card">
      <div class="metric-info">
        <span class="metric-label">Valor Utilizado</span>
        <p class="metric-value text-blue">
          {{ formatCurrency(totalUtilizado) }}
        </p>
      </div>
      <span class="metric-icon text-blue">↗</span>
    </div>

    
    <div class="metric-card">
      <div class="metric-info">
        <span class="metric-label">Disponível</span>
        <p class="metric-value text-green">
          {{ formatCurrency(totalDisponivel) }}
        </p>
      </div>
      <span class="metric-icon text-green">🔒</span>
    </div>
  </div>
</template>

<style scoped>
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.metric-card {
  background-color: var(--opes-paper);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--opes-cream);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.metric-label {
  font-size: 0.75rem;
  color: var(--opes-forest);
  font-weight: 500;
}

.metric-value {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 800;
  margin-top: 0.75rem;
  letter-spacing: -0.025em;
}

.text-dark {
  color: var(--opes-ink);
}

.text-blue {
  color: var(--opes-caramel);
}

.text-green {
  color: var(--opes-forest);
}

.text-gray {
  color: var(--opes-muted);
}

.metric-icon {
  font-size: 1.25rem;
  font-weight: 300;
}
</style>

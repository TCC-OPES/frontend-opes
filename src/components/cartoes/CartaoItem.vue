<script setup>
defineProps({
  cartao: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div
    class="card-item"
    :style="{ backgroundColor: cartao.cor || '#006B2B' }"
  >
    <div class="card-header">
      <span class="card-bank">{{ cartao.banco }}</span>
      <h3 class="card-name">{{ cartao.nome }}</h3>
    </div>

    <div class="card-number">
      •••• •••• •••• {{ cartao.ultimos_digitos || '****' }}
    </div>

    <div class="card-footer">
      <div>
        <span class="footer-label">Vencimento</span>
        <span class="footer-value">{{ cartao.data_vencimento }}</span>
      </div>

      <div class="chip-icon">
        <div class="chip-line"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-item {
  height: 14rem;
  border-radius: 1rem;
  padding: 1.5rem;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s ease;
}

.card-item:hover {
  transform: translateY(-2px);
}

.card-bank {
  font-size: 0.75rem;
  opacity: 0.9;
  display: block;
  font-weight: 400;
  letter-spacing: 0.025em;
}

.card-name {
  font-weight: 700;
  font-size: 1.25rem;
  margin-top: 0.25rem;
  letter-spacing: -0.025em;
}

.card-number {
  letter-spacing: 0.25em;
  font-size: 1.125rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  opacity: 0.9;
  margin-top: auto;
  margin-bottom: auto;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.footer-label {
  font-size: 0.6875rem;
  opacity: 0.8;
  display: block;
  font-weight: 400;
  margin-bottom: 0.125rem;
  text-transform: uppercase;
}

.footer-value {
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.025em;
}

.chip-icon {
  width: 2.25rem;
  height: 1.5rem;
  border: 2px solid #ffffff;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chip-line {
  width: 100%;
  height: 0.25rem;
  background-color: #ffffff;
  opacity: 0.4;
}
</style>

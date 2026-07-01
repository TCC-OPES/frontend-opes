<template>
  <div class="transaction-item">
    <div class="t-left">
      <div class="t-icon"><i class="fa-solid fa-cart-shopping"></i></div>
      <div>
        <div class="t-name">{{ transacao.description || transacao.category }}</div>
        <div class="t-meta">{{ transacao.category }} • {{ transacao.wallet }}</div>
      </div>
    </div>
    <div class="t-right">
      <div :class="['t-amount', transacao.type]">
        {{ transacao.type === 'expense' ? '-' : '+' }} R$ {{ transacao.amount.toFixed(2) }}
      </div>
      <div class="t-date">{{ transacao.date }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  transacao: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.transaction-item { display: flex; align-items: center; justify-content: space-between; padding: 16px; background-color: #f8fafd; border-radius: 14px; margin-bottom: 12px; }
.t-left { display: flex; align-items: center; gap: 16px; }
.t-amount.expense { color: #c5221f; }
.t-amount.income { color: #137333; }
</style>

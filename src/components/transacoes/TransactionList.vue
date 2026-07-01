<template>
  <div class="transactions-section">
    <div class="section-title">Histórico de Transações ({{ lista.length }})</div>

    <TransactionItem
      v-for="item in lista"
      :key="item.id || item._id"
      :transacao="item"
    />
  </div>
</template>

<script setup>
import TransactionItem from './TransactionItem.vue';

defineProps({
  lista: {
    type: Array,
    required: true
  }
});
</script>

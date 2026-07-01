<template>
  <div class="main-content">
    <div class="header">
      <h1>Transações</h1>
      <p>Gerencie todas as suas movimentações financeiras</p>
    </div>

    <button class="btn-action primary" @click="isModalOpen = true">
      + Nova Transação
    </button>

    <TransactionList :lista="transactions" />

    <NewTransaction
      v-if="isModalOpen"
      @close="isModalOpen = false"
      @added="handleNewTransaction"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getTransactions } from '../../../api/transactions';
import TransactionList from './TransactionList.vue';
import NewTransaction from './NewTransaction.vue';

const transactions = ref([]);
const isModalOpen = ref(false);

const fetchContent = async () => {
  try {
    transactions.value = await getTransactions();
  } catch (error) {
    console.error(error);
  }
};

// Adiciona o item retornado do back-end direto na lista local sem precisar recarregar
const handleNewTransaction = (newTx) => {
  transactions.value.unshift(newTx);
};

onMounted(() => {
  fetchContent();
});
</script>

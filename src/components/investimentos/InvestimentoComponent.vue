<script setup>

import { useRouter } from 'vue-router'

const router = useRouter()

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="investimento-layout">
    <SideBarComponent />

    <div class="main-container">
      <HeaderComponent />

      <div class="investimento-content">
        <h2>Investimentos</h2>
        <p>Aqui você pode gerenciar seus investimentos e acompanhar seu desempenho.</p>

        <div class="investimento-actions">
          <button @click="goToDashboard">Voltar para Dashboard</button>
        </div>

        <!-- Adicione aqui os componentes ou elementos relacionados aos investimentos -->
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

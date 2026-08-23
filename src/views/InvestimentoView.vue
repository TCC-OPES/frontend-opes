<script setup>
import InvestimentoComponent from '@/components/investimentos/InvestimentoComponent.vue'
import SideBarComponent from '@/components/SideBarComponent.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
</script>

<template>
  <div class="app-layout">
    <SideBarComponent />


    <div class="main-wrapper">
      <HeaderComponent />

      <main class="main-content">
        <InvestimentoComponent />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}


.main-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}
</style>

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
        <Transition name="fade-slide" appear>
          <div>
            <InvestimentoComponent />
          </div>
        </Transition>
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

/* Transição nativa do Vue para evitar conflito com elementos fixed/absolutos */
.fade-slide-enter-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>

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
  width: 100%;
  max-width: 100vw;
  background-color: #ffffff;
  overflow-x: hidden;
  margin: 0;
  border: none;
}

.app-layout :deep(.desktop-sidebar) {
  display: none !important;
}

.main-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  min-width: 0;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #ffffff;
}

.main-content {
  flex: 1;
  overflow-y: visible;
  padding: 1rem;
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
}

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

@media (min-width: 640px) {
  .main-content {
    padding: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .app-layout {
    background-color: #f8fafc;
  }
  .app-layout :deep(.desktop-sidebar) {
    display: flex !important;
  }
  .main-wrapper {
    height: 100vh;
    overflow-y: hidden;
    background-color: #f8fafc;
  }
  .main-content {
    padding: 2rem;
    overflow-y: auto;
    background-color: #f8fafc;
  }
}
</style>

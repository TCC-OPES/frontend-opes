<script setup>
import ToastHost from '@/components/ToastHost.vue'
</script>
<template>
  <div id="app-layout">
<main class="conteudo-principal">
      <router-view v-slot="{ Component, route }">
        <Transition name="opes-page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </router-view>
    </main>
    <ToastHost />
  </div>
</template>

<style>

html, body, #app { min-height: 100%; overflow-x: clip; }
#app-layout, .conteudo-principal { min-height: 100vh; height: auto; overflow: visible; }
@media (max-width: 1023px) {
  .conteudo-principal, #app-layout, .app-container {
    padding-bottom: 85px !important; 
    box-sizing: border-box;
  }
}

.opes-page-enter-active { transition: opacity .22s ease, transform .22s ease; }
.opes-page-leave-active { transition: opacity .12s ease; }
.opes-page-enter-from { opacity: 0; transform: translateY(10px); }
.opes-page-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .opes-page-enter-active, .opes-page-leave-active { transition: none; }
  .opes-page-enter-from, .opes-page-leave-to { transform: none; opacity: 1; }
}
</style>

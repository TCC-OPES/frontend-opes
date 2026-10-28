<script setup>
import ToastHost from '@/components/ToastHost.vue'
</script>
<template>
  <div id="app-layout">
<main class="conteudo-principal">
      <router-view />
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

@media (prefers-reduced-motion: no-preference) {
  .conteudo-principal > .layout,
  .conteudo-principal > .layout-app,
  .conteudo-principal > .dashboard-layout,
  .conteudo-principal > .main-wrapper {
    animation: opes-entrada .28s ease-out both;
  }
  @keyframes opes-entrada {
    from { opacity: .65; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
</style>

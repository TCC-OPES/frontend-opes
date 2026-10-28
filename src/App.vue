<script setup>
import ToastHost from '@/components/ToastHost.vue'
</script>
<template>
  <div id="app-layout">
    
    <SidebarComponent />

    
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
</style>

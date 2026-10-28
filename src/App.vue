<template>
  <div id="app-layout">
    <!-- Sidebar / Navegação -->
    <SidebarComponent />

    <!-- Onde as páginas são carregadas -->
    <main class="conteudo-principal">
      <router-view />
    </main>
  </div>
</template>

<style>
/* Adicione isso no seu estilo global ou no App.vue */
html, body, #app { min-height: 100%; overflow-x: hidden; }
#app-layout, .conteudo-principal { min-height: 100vh; height: auto; overflow: visible; }
@media (max-width: 1023px) {
  .conteudo-principal, #app-layout, .app-container {
    padding-bottom: 85px !important; /* Cria um respiro para a barra mobile não cobrir nada */
    box-sizing: border-box;
  }
}
</style>

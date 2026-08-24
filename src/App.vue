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
@media (max-width: 1023px) {
  .conteudo-principal, #app-layout, .app-container {
    padding-bottom: 85px !important; /* Cria um respiro para a barra mobile não cobrir nada */
    box-sizing: border-box;
  }
}
</style>

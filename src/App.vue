<template>
  <!-- Se for a tela de cadastro, renderiza direto sem o flex global e sem padding -->
  <router-view v-if="$route.path === '/cadastro'" />

  <!-- Para o resto do sistema, mantém o layout normal com a Sidebar -->
  <div v-else style="display: flex;">
    <Sidebar />
    <main style="flex-grow: 1; padding: 20px;">
      <router-view />
    </main>
  </div>
</template>

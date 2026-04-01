<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import CadastroView from './views/CadastroView.vue';

</script>

<template>
<nav>
  <router-link to="/">Home</router-link>
  <router-link to="/cadastro">Cadastro</router-link>
</nav>

<main>
  <router-view />
</main>
</template>

<style scoped>


</style>

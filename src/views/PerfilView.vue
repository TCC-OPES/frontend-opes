<script setup>
import PerfilComponent from '@/components/dashboard/PerfilComponent.vue';
</script>
<template>
<div class="entrada-pagina"><PerfilComponent /></div>
</template>

<style scoped>
.entrada-pagina { animation: entrada-pagina 0.6s ease-out both; }
@keyframes entrada-pagina { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>

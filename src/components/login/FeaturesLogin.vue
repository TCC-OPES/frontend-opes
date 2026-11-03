<script setup>
defineProps({
  icon: String,
  title: String,
  text: String
})
</script>

<template>
  <div class="card">
    <div class="icon">{{ icon }}</div>
    <h3>{{ title }}</h3>
    <p>{{ text }}</p>
  </div>
</template>

<style scoped>
.card {
  background: rgba(255,255,255,.45);
  padding: 30px 20px;
  border-radius: 24px;
  text-align: center;
}
</style>

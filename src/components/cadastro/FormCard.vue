<template>
  <div class="card">
    <slot />
  </div>
</template>
<style scoped>
.card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  text-align: center;
  width: 100%;
  max-width: 500px;
  margin: 0;
  padding: 24px;
}
</style>

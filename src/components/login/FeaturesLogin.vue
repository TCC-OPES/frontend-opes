<template>
  <div class="left">
    <img :src="phone" alt="celular" class="phone-img" />
  </div>
</template>

<script setup>
import phone from '../../img/icon.celular.renovado.png'
</script>

<style scoped>
.left {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.phone-img {
  width: 40vw;
  height: 40vw;
  object-fit: contain;
  padding-bottom: 2vw;
}
</style>



<script setup>
import FormLogin from '@/components/login/FormLogin.vue'
</script>

<template>
  <div class="page">
    <div class="lado-imagem">
      <img src="/icons/logo.png" alt="Ilustração" />
    </div>

    <div class="container-form">
      <FormLogin />
    </div>
  </div>
</template>

<style scoped>
:deep(html), :deep(body) {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden !important;
}

.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 100vh;
  max-height: 100vh;
  width: 100vw;
  overflow: hidden !important;
  padding: 16px;
  background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%);
  font-family: Arial, sans-serif;
}

.lado-imagem {
  display: none;
}

.container-form {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (min-width: 769px) {
  .page {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    padding: 0 40px;
    gap: 30px;
    align-items: center;
  }

  .lado-imagem {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  .lado-imagem img {
    width: 100%;
    max-width: 800px;
    max-height: 92vh;
    object-fit: contain;
  }

  .container-form {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }
}
</style>

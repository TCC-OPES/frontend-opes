<script setup>
import FormLogin from '@/components/login/FormLogin.vue'
import FeaturesLogin from '@/components/login/FeaturesLogin.vue'
</script>

<template>
  <div class="main-wrapper">

    <section class="login-side">
      <FormLogin />
    </section>

    <section class="side-illustration">
      <FeaturesLogin />
    </section>

  </div>
</template>

<style scoped>
.main-wrapper {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(
    135deg,
    rgba(224, 242, 241, 1) 0%,
    rgba(178, 223, 219, 1) 100%
  );
}

.login-side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.side-illustration {
  flex: 1;
  padding: 40px 120px 40px 40px;
  display: flex;
  justify-content: center;
}

@media (max-width: 1024px) {
  .side-illustration {
    display: none;
  }
}
</style>

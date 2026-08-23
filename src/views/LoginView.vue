<script setup>
import FormLogin from '@/components/login/FormLogin.vue'
import FeaturesLogin from '@/components/login/FeaturesLogin.vue'
</script>

<template>
  <div class="main-wrapper">
    <div class="mobile-logo-container">
      <img src="/public/icons/logo.png" alt="OPES Logo" class="logo-img" />
    </div>

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
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  background: linear-gradient(
    135deg,
    rgba(224, 242, 241, 1) 0%,
    rgba(178, 223, 219, 1) 100%
  );
  overflow-x: hidden;
  margin: 0;
  box-sizing: border-box;
}

.mobile-logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 36px 16px 16px 16px;
}

.logo-img {
  max-height: 70px;
  width: auto;
  object-fit: contain;
}

.login-side {
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
}

.side-illustration {
  display: none;
}

@media (min-width: 1024px) {
  .main-wrapper {
    flex-direction: row;
    height: 100vh;
    overflow: hidden;
  }

  .mobile-logo-container {
    display: none;
  }

  .login-side {
    flex: 1;
    padding: 40px;
    height: 100%;
    overflow-y: auto;
  }

  .side-illustration {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
  }
}
</style>

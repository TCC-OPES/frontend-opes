<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="landing-page">
    <header class="navbar">
      <div class="logo">
        <img src="/icons/logo.png" alt="logo">
        <span class="brand-name">OPES</span>
      </div>
      <nav>
        <RouterLink to="/login" class="btn-login">Entrar</RouterLink>
        <RouterLink to="/cadastro" class="btn-primary">Grátis</RouterLink>
      </nav>
    </header>

    <main class="hero">
      <div class="hero-content">
        <h1>Transforme sua <br> <span class="gradient-text">vida financeira</span></h1>
        <p>
          Controle total das suas finanças com análises inteligentes e segurança de nível bancário.
        </p>
        <div class="hero-btns">
          <RouterLink to="/cadastro" class="btn-primary large">Começar Grátis →</RouterLink>
          <RouterLink to="/login" class="btn-outline large">Fazer Login</RouterLink>
        </div>
      </div>

      <div class="hero-image">
        <div class="dashboard-mockup">
          <img src="/icons/logo.png" alt="Dashboard">
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.landing-page {
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #1a1a1a;
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  padding: 0 20px;
  background-image: radial-gradient(#e5e7eb 0.8px, transparent 0.8px);
  background-size: 24px 24px;
  overflow-x: hidden;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.logo img {
  height: 35px;
  width: auto;
}

.brand-name {
  font-weight: 800;
  font-size: 1.2rem;
  color: #0f172a;
}

nav {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn-login {
  text-decoration: none;
  color: #10b981;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-primary {
  background: linear-gradient(135deg, #059669 0%, #2563eb 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  white-space: nowrap;
}

.hero {
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 40px 0;
  gap: 40px;
}

.badge {
  background: #f0fdf4;
  color: #166534;
  padding: 6px 12px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 16px;
  display: inline-block;
}

h1 {
  font-size: 2.5rem;
  line-height: 1.1;
  font-weight: 800;
  margin-bottom: 16px;
  letter-spacing: -1px;
}

.gradient-text {
  background: linear-gradient(90deg, #10b981, #3b82f6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  font-size: 1rem;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 32px;
}

.hero-btns {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.large {
  padding: 16px;
  border-radius: 12px;
  font-size: 1rem;
}

.btn-outline {
  border: 2px solid #e2e8f0;
  color: #1e293b;
  text-decoration: none;
  font-weight: 700;
  text-align: center;
}

.hero-image {
  width: 100%;
}

.dashboard-mockup {
  background: white;
  padding: 10px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.dashboard-mockup img {
  width: 100%;
  border-radius: 8px;
  display: block;
}

@media (min-width: 968px) {
  .landing-page {
    padding: 0 80px;
  }

  .logo img {
    height: 45px;
  }

  .brand-name {
    font-size: 1.6rem;
  }

  .hero {
    flex-direction: row;
    text-align: left;
    padding: 80px 0;
    align-items: center;
  }

  .hero-content {
    flex: 1.2;
  }

  .hero-image {
    flex: 1;
  }

  h1 {
    font-size: 4.5rem;
  }

  .hero-btns {
    flex-direction: row;
  }

  p {
    font-size: 1.2rem;
    max-width: 500px;
  }
}
</style>

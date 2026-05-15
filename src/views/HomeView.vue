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
        <p>Controle total das suas finanças com análises inteligentes e segurança de nível bancário.</p>
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

    <section class="features-section">
      <div class="features-header">
        <h2>Recursos que fazem a diferença</h2>
        <p>Tudo que você precisa para ter controle total de suas finanças em uma única plataforma inteligente e segura.</p>
      </div>

      <ul class="features-grid">
        <li class="feature-card">
          <div class="icon-box grad-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z"/>
            </svg>
          </div>
          <h3>Análise Inteligente</h3>
          <p>Visualize seus gastos com gráficos interativos e relatórios detalhados.</p>
        </li>

        <li class="feature-card">
          <div class="icon-box grad-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
            </svg>
          </div>
          <h3>Metas Financeiras</h3>
          <p>Defina objetivos e acompanhe seu progresso em tempo real.</p>
        </li>

        <li class="feature-card">
          <div class="icon-box grad-purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h3>Segurança Total</h3>
          <p>Seus dados protegidos com criptografia de ponta a ponta.</p>
        </li>

        <li class="feature-card">
          <div class="icon-box grad-orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
          </div>
          <h3>Acesso Mobile</h3>
          <p>Gerencie suas finanças em qualquer lugar, a qualquer momento.</p>
        </li>

        <li class="feature-card">
          <div class="icon-box grad-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3>Controle Familiar</h3>
          <p>Compartilhe e gerencie finanças com toda a família.</p>
        </li>

        <li class="feature-card">
          <div class="icon-box grad-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
            </svg>
          </div>
          <h3>Investimentos</h3>
          <p>Acompanhe seus investimentos e maximize seus rendimentos.</p>
        </li>
      </ul>
    </section>
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
  min-height: 100vh;
  padding: 0 20px;
  background-image: radial-gradient(#e5e7eb 0.8px, transparent 0.8px);
  background-size: 24px 24px;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 20px;
  padding-bottom: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo img {
  height: 35px;
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
}

.btn-primary {
  background: linear-gradient(135deg, #059669 0%, #2563eb 100%);
  color: white;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
}

.hero {
  display: flex;
  flex-direction: column;
  text-align: center;
  padding-top: 60px;
  padding-bottom: 60px;
  gap: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  line-height: 1.1;
  font-weight: 800;
  margin-bottom: 20px;
}

.gradient-text {
  background: linear-gradient(90deg, #10b981, #3b82f6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 30px;
}

.hero-btns {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.large {
  padding-top: 18px;
  padding-bottom: 18px;
  border-radius: 12px;
  font-size: 1.1rem;
}

.btn-outline {
  border-width: 2px;
  border-style: solid;
  border-color: #e2e8f0;
  color: #1e293b;
  text-decoration: none;
  font-weight: 700;
  text-align: center;
}

.dashboard-mockup {
  background-color: white;
  padding: 15px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.dashboard-mockup img {
  width: 100%;
  border-radius: 10px;
}

.features-section {
  padding-top: 80px;
  padding-bottom: 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.features-header {
  text-align: center;
  margin-bottom: 60px;
}

.features-header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 15px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  list-style: none;
  padding: 0;
}

.feature-card {
  background-color: #ffffff;
  padding: 40px;
  border-radius: 24px;
  border-width: 1px;
  border-style: solid;
  border-color: #f1f5f9;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  transition-property: transform;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
}

.icon-box {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.icon-box svg {
  width: 32px;
  height: 32px;
}

.grad-green {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
}

.grad-blue {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
}

.grad-purple {
  background: linear-gradient(135deg, #d946ef 0%, #a855f7 100%);
}

.grad-orange {
  background: linear-gradient(135deg, #f97316 0%, #fbbf24 100%);
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 12px;
}

.feature-card p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 0;
  text-align: left;
}

@media (min-width: 968px) {
  .landing-page {
    padding-left: 80px;
    padding-right: 80px;
  }

  .hero {
    flex-direction: row;
    text-align: left;
    padding-top: 100px;
    padding-bottom: 100px;
    align-items: center;
  }

  h1 {
    font-size: 4.5rem;
  }

  .hero-btns {
    flex-direction: row;
  }

  .hero-content {
    flex: 1.2;
  }

  .hero-image {
    flex: 1;
  }

  .features-header h2 {
    font-size: 3.5rem;
  }
}
</style>

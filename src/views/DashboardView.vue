<template>
  <div class="dashboard-layout">

    <SideBarComponent />

    <div class="main-container">

      <HeaderComponent />

      <div class="dashboard-content">

        <section class="welcome-section">
          <h2>Bem-vindo de volta, João! 👋</h2>
          <p>Aqui está um resumo completo das suas finanças</p>
        </section>

        <section class="balance-gradient-card">
          <div class="balance-main">
            <p class="label">Saldo Total</p>
            <h1 class="amount">R$ 25.430,00</h1>
            <span class="trending-badge">
              <i class="fas fa-arrow-up"></i> +12.5% <small>vs mês passado</small>
            </span>
          </div>

          <div class="balance-summary-boxes">
            <div class="summary-box">
              <p><i class="fas fa-arrow-up icon-receita"></i> Receitas</p>
              <h3>R$ 11.000</h3>
            </div>
            <div class="summary-box">
              <p><i class="fas fa-arrow-down icon-despesa"></i> Despesas</p>
              <h3>R$ 6.400</h3>
            </div>
          </div>
        </section>

        <section class="analytics-grid">
          <div class="chart-card">
            <h3>Evolução Patrimonial</h3>
            <div class="chart-placeholder">[Gráfico de Linha entra aqui]</div>
          </div>
          <div class="chart-card">
            <h3>Gastos Semanais</h3>
            <div class="chart-placeholder">[Gráfico de Barras entra aqui]</div>
          </div>
        </section>

      </div>
    </div>

  </div>
</template>

<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue';
import SideBarComponent from '@/components/SideBarComponent.vue';
</script>

<style scoped>
/* --- BASE & LAYOUT (MOBILE FIRST) --- */
.dashboard-layout {
  display: flex;
  flex-direction: column; /* No mobile, os blocos ficam um embaixo do outro */
  width: 100%;
  min-height: 100vh;
  background-color: #f4f6f9;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  width: 100%;
}

.dashboard-content {
  flex: 1;
  padding: 20px; /* Espaçamento menor no mobile para não espremer o conteúdo */
}

/* --- COMPONENTES DA TELA --- */
.welcome-section {
  margin-top: 16px;
}
.welcome-section h2 {
  font-size: 1.5rem;
  color: #1e293b;
  font-weight: 700;
}
.welcome-section p {
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 4px;
}

/* Card Principal Gradiente (Mobile First) */
.balance-gradient-card {
  background: linear-gradient(135deg, #155e75 0%, #115e59 45%, #1d4ed8 100%);
  border-radius: 16px;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column; /* Empilha o saldo e os mini cards no mobile */
  gap: 20px;
  margin-top: 20px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.balance-main .label {
  font-size: 0.9rem;
  opacity: 0.85;
}
.balance-main .amount {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 6px 0;
  letter-spacing: -0.5px;
}
.trending-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.balance-summary-boxes {
  display: flex;
  gap: 12px;
  width: 100%;
}
.summary-box {
  background: rgba(255, 255, 255, 0.12);
  padding: 12px;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  flex: 1; /* Faz as duas caixinhas dividirem o espaço por igual */
}
.summary-box p {
  font-size: 0.8rem;
  opacity: 0.9;
  margin-bottom: 4px;
}
.summary-box h3 {
  font-size: 1.1rem;
  font-weight: 600;
}
.icon-receita { color: #34d399; }
.icon-despesa { color: #f87171; }

/* Grid de Gráficos (Mobile First = 1 coluna) */
.analytics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 20px;
}

.chart-card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
}
.chart-card h3 {
  font-size: 1rem;
  color: #1e293b;
  margin-bottom: 16px;
  font-weight: 600;
}
.chart-placeholder {
  height: 200px;
  background-color: #f8fafc;
  border: 2px dashed #e2e8f0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

/* --- MEDIA QUERIES (ADAPTAÇÃO PARA TELAS GRANDES / DESKTOP) --- */
@media (min-width: 768px) {
  .dashboard-layout {
    flex-direction: row; /* Sidebar do lado do conteúdo no Desktop */
  }

  .dashboard-content {
    padding: 0 40px 40px 40px; /* Mais espaçoso no PC */
  }

  .welcome-section h2 {
    font-size: 1.8rem;
  }

  .balance-gradient-card {
    flex-direction: row; /* Alinha saldo na esquerda e caixas na direita */
    padding: 32px;
  }

  .balance-main .amount {
    font-size: 2.6rem;
  }

  .balance-summary-boxes {
    width: auto;
    gap: 16px;
  }

  .summary-box {
    padding: 16px 24px;
    min-width: 140px;
  }

  .analytics-grid {
    grid-template-columns: 1.2fr 0.8fr;
    gap: 24px;
  }

  .chart-placeholder {
    height: 240px;
  }
}
</style>

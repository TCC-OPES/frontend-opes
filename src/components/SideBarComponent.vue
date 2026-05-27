<template>
  <aside class="sidebar">
    <div class="logo">
      <span class="logo-icon">$</span> FinControl
    </div>

    <nav class="menu">
      <a href="#" class="menu-item active">
        <i class="fas fa-chart-pie"></i> Dashboard
      </a>

      <a href="#" class="menu-item"><i class="fas fa-exchange-alt"></i> Transações</a>
      <a href="#" class="menu-item"><i class="fas fa-wallet"></i> Carteiras</a>
      <a href="#" class="menu-item"><i class="fas fa-credit-card"></i> Cartões</a>
      <a href="#" class="menu-item"><i class="fas fa-target"></i> Metas</a>
      <a href="#" class="menu-item"><i class="fas fa-chart-line"></i> Investimentos</a>
      <a href="#" class="menu-item"><i class="fas fa-users"></i> Família</a>
    </nav>

    <div class="user-profile">
      <div class="avatar">JD</div>
      <div class="user-info">
        <h4>João Silva</h4>
        <p>Ver perfil</p>
      </div>
      <i class="fas fa-chevron-right"></i>
    </div>
  </aside>
</template>

<script setup>
//importar o component do perfil quando for pra dev 
</script>

<style scoped>
.sidebar {
  width: 260px;
  background-color: #ffffff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid #e2e8f0;
  height: 100vh;
}

.logo {
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e293b;
}

.logo-icon {
  background-color: #1b7339;
  color: white;
  padding: 4px 10px;
  border-radius: 8px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 40px;
  flex-grow: 1;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #64748b;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
}

.menu-item:hover {
  background-color: #f1f5f9;
  color: #1e293b;
}

.menu-item.active {
  background-color: #0b5ed7;
  color: white;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 12px;
  cursor: pointer;
}

.avatar {
  background-color: #004d40;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.user-info h4 {
  font-size: 0.9rem;
  color: #1e293b;
}

.user-info p {
  font-size: 0.8rem;
  color: #94a3b8;
}
</style>

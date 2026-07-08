<template>
  <header class="topbar">
    <div class="search-bar">
      <i class="fas fa-search search-icon"></i>
      <input type="text" placeholder="Buscar transações, categorias...">
    </div>

    <div class="topbar-actions">
      <div class="date-filter">
        <i class="far fa-calendar-alt"></i>
        <span>Março 2026</span>
        <i class="fas fa-chevron-down arrow-icon"></i>
      </div>
      <div class="icon-btn">
        <i class="far fa-bell"></i>
        <span class="notification-dot"></span>
      </div>
      <div class="icon-btn">
        <i class="fas fa-cog"></i>
      </div>
    </div>
  </header>
</template>

<script setup>

</script>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  background-color: transparent;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f1f5f9;
  padding: 10px 16px;
  border-radius: 12px;
  width: 400px;
}

.search-icon {
  color: #94a3b8;
  margin-right: 8px;
}

.search-bar input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  color: #1e293b;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.arrow-icon {
  font-size: 0.8rem;
  color: #64748b;
}

.icon-btn {
  font-size: 1.2rem;
  color: #64748b;
  cursor: pointer;
  position: relative;
}

.notification-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  background-color: #0b5ed7;
  border-radius: 50%;
}
</style>

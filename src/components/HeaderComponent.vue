<template>
  <header class="topbar">
    <div class="search-bar">
      <i class="fas fa-search search-icon"></i>
      <input type="text" placeholder="Buscar...">
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
      <div class="icon-btn desktop-only">
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
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px;
  background-color: transparent;
  width: 100%;
  box-sizing: border-box;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f1f5f9;
  padding: 10px 14px;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
}

.search-icon {
  color: #94a3b8;
  margin-right: 8px;
  font-size: 0.9rem;
}

.search-bar input {
  border: none;
  background: transparent;
  outline: none;
  width: 100%;
  color: #1e293b;
  font-size: 0.9rem;
}

.topbar-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  flex: 1;
  justify-content: center;
  white-space: nowrap;
}

.arrow-icon {
  font-size: 0.7rem;
  color: #64748b;
}

.icon-btn {
  font-size: 1.1rem;
  color: #64748b;
  cursor: pointer;
  position: relative;
  background: white;
  border: 1px solid #e2e8f0;
  padding: 8px 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.desktop-only {
  display: none;
}

.notification-dot {
  position: absolute;
  top: 6px;
  right: 8px;
  width: 7px;
  height: 7px;
  background-color: #0b5ed7;
  border-radius: 50%;
}

@media (min-width: 640px) {
  .topbar {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
  }
  .search-bar {
    width: 280px;
  }
  .topbar-actions {
    width: auto;
    gap: 16px;
  }
  .date-filter {
    flex: unset;
    font-size: 0.85rem;
    padding: 10px 14px;
  }
  .icon-btn {
    padding: 10px 14px;
  }
}

@media (min-width: 1024px) {
  .topbar {
    padding: 16px 32px;
  }
  .search-bar {
    width: 400px;
  }
  .search-bar input::placeholder {
    content: "Buscar transações, categorias...";
  }
  .desktop-only {
    display: flex;
  }
  .date-filter {
    font-size: 0.9rem;
    padding: 10px 16px;
  }
  .icon-btn {
    padding: 0;
    border: none;
    background: transparent;
  }
  .notification-dot {
    top: 0;
    right: 0;
  }
}
</style>

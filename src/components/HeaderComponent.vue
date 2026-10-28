<template>
  <header class="topbar">
    <div class="topbar-actions">
      <div class="date-filter">
        <i class="far fa-calendar-alt"></i>
        <span>Março 2026</span>
        <i class="fas fa-chevron-down arrow-icon"></i>
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

@media (min-width: 640px) {
  .topbar {
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding: 16px 20px;
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
}

@media (min-width: 1024px) {
  .topbar {
    padding: 16px 32px;
  }
  .date-filter {
    font-size: 0.9rem;
    padding: 10px 16px;
  }
}
</style>

<template>
  <div class="dashboard-layout">
    <SideBarComponent />

    <div class="main-container">
      <HeaderComponent />

      <router-view />
    </div>
  </div>
  <PerfilComponent />
</template>

<script setup>
import HeaderComponent from '@/components/global/HeaderComponent.vue';
import SideBarComponent from '@/components/global/SideBarComponent.vue';
import PerfilComponent from '@/components/global/PerfilComponent.vue';
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #f4f6f9;
}
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
</style>

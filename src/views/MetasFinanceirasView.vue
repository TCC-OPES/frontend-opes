<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Target } from 'lucide-vue-next'
import { useMetasStore } from '@/store/metas'

import Sidebar from '@/components/SideBarComponent.vue'
import Header from '@/components/HeaderComponent.vue'

// Importação dos componentes da tela de metas
import MetasResumoCards from '@/components/metas/MetasResumoCard.vue'
import CardMetaItem from '@/components/metas/CardMetaItem.vue'
import AdicionarMeta from '@/components/metas/AdicionarMeta.vue'

const metasStore = useMetasStore()
const modalAberto = ref(false)

onMounted(() => {
  metasStore.carregarMetas()
})

async function salvarNovaMeta(dados) {
  await metasStore.adicionarMeta(dados)
}
</script>

<template>
  <div class="app-layout">
    <!-- Menu Lateral -->
    <Sidebar />

    <!-- Área de Conteúdo Principal -->
    <div class="main-wrapper">
      <!-- Cabeçalho Global / Topo -->
      <Header />

      <!-- Conteúdo Interno da Página -->
      <main class="metas-page">
        <div class="metas-container">
          
          <!-- Cabeçalho da Seção de Metas -->
          <div class="metas-header">
            <div>
              <h1>Metas Financeiras</h1>
              <p>Acompanhe o progresso dos seus objetivos financeiros</p>
            </div>
            
            <button @click="modalAberto = true" class="btn-add-meta">
              <Plus class="icon-plus" />
              Nova Meta
            </button>
          </div>

          <!-- Métricas do Topo -->
          <MetasResumoCards 
            :totalMetas="metasStore.totalMetas"
            :valorTotal="metasStore.valorTotalGeral"
            :valorEconomizado="metasStore.valorEconomizadoGeral"
            :progressoGeral="metasStore.progressoGeral"
          />

          <!-- Estado de Carregamento -->
          <div v-if="metasStore.carregando" class="loading-state">
            Carregando suas metas...
          </div>

          <!-- Estado Vazio (Nenhuma Meta) -->
          <div v-else-if="metasStore.metas.length === 0" class="empty-state">
            <div class="empty-icon-bg">
              <Target class="icon-target" />
            </div>
            <div>
              <h3>Nenhuma meta encontrada</h3>
              <p>Cadastre seu primeiro objetivo financeiro para acompanhar seu progresso.</p>
            </div>
            <button @click="modalAberto = true" class="btn-add-empty">
              Adicionar Meta
            </button>
          </div>

          <!-- Lista de Metas (Grid) -->
          <div v-else class="goals-grid">
            <CardMetaItem 
              v-for="meta in metasStore.metas" 
              :key="meta.id" 
              :meta="meta" 
            />
          </div>

        </div>
      </main>
    </div>

    <!-- Modal de Cadastro -->
    <AdicionarMeta 
      v-if="modalAberto" 
      @fechar="modalAberto = false" 
      @salvar="salvarNovaMeta" 
    />
  </div>
</template>

<style scoped>
/* Estrutura Base de Layout */
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Previne overflow de elementos filhos no flex */
}

/* Área Interna da View */
.metas-page {
  flex: 1;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1e293b;
  box-sizing: border-box;
}

.metas-container {
  max-width: 1150px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Cabeçalho da Seção */
.metas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metas-header h1 {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.metas-header p {
  font-size: 14px;
  color: #64748b;
  margin: 4px 0 0 0;
}

.btn-add-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #006400;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;
}

.btn-add-meta:hover {
  background-color: #228b22;
}

.icon-plus {
  width: 16px;
  height: 16px;
}

/* Estados */
.loading-state {
  text-align: center;
  padding: 40px 0;
  color: #94a3b8;
}

.empty-state {
  background-color: #ffffff;
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  border: 1px dashed #cbd5e1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon-bg {
  width: 48px;
  height: 48px;
  background-color: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.empty-state h3 {
  font-weight: 700;
  color: #334155;
  margin: 0;
}

.empty-state p {
  font-size: 12px;
  color: #94a3b8;
  margin: 4px 0 0 0;
}

.btn-add-empty {
  background-color: #006400;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
}

.btn-add-empty:hover {
  background-color: #228b22;
}

/* Grid de Metas */
.goals-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 768px) {
  .goals-grid {
    grid-template-columns: 1fr;
  }
}
</style>
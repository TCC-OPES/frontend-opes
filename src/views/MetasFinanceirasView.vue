<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { Plus, Target } from '@lucide/vue'
import { useMetasStore } from '@/store/metas'

import Sidebar from '@/components/SideBarComponent.vue'
import Header from '@/components/HeaderComponent.vue'

import MetasResumoCards from '@/components/metas/MetasResumoCard.vue'
import CardMetaItem from '@/components/metas/CardMetaItem.vue'
import AdicionarMeta from '@/components/metas/AdicionarMeta.vue'

const metasStore = useMetasStore()
const modalAberto = ref(false)
const metaEmEdicao = ref(null)
let observer = null

const iniciarObserver = () => {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('exibir')
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.animar').forEach((el) => observer.observe(el))
}

onMounted(async () => {
  await metasStore.carregarMetas()
  await nextTick()
  iniciarObserver()
})

watch(() => metasStore.metas, async () => {
  await nextTick()
  iniciarObserver()
}, { deep: true })

onUnmounted(() => {
  if (observer) observer.disconnect()
})

function abrirModalNovaMeta() {
  metaEmEdicao.value = null
  modalAberto.value = true
}

function abrirModalEdicao(meta) {
  metaEmEdicao.value = meta
  modalAberto.value = true
}

async function salvarMeta(dados) {
  if (metaEmEdicao.value) {
    await metasStore.editarMeta(metaEmEdicao.value.id, dados)
  } else {
    await metasStore.adicionarMeta(dados)
  }
}

async function deletarMeta(id) {
  if (confirm('Tem certeza que deseja excluir esta meta?')) {
    await metasStore.deletarMeta(id)
  }
}
</script>

<template>
  <div class="app-layout">
    <Sidebar />

    <div class="main-wrapper">
      <Header />

      <main class="metas-page">
        <div class="metas-container">

          <div class="metas-header animar">
            <div>
              <h1>Metas Financeiras</h1>
              <p>Acompanhe o progresso dos seus objetivos financeiros</p>
            </div>

            <button @click="abrirModalNovaMeta" class="btn-add-meta">
              <Plus class="icon-plus" />
              Nova Meta
            </button>
          </div>

          <div class="animar">
            <MetasResumoCards
              :totalMetas="metasStore.totalMetas"
              :valorTotal="metasStore.valorTotalGeral"
              :valorEconomizado="metasStore.valorEconomizadoGeral"
              :progressoGeral="metasStore.progressoGeral"
            />
          </div>

          <div v-if="metasStore.carregando" class="loading-state">
            Carregando suas metas...
          </div>

          <div v-else-if="metasStore.metas.length === 0" class="empty-state animar">
            <div class="empty-icon-bg">
              <Target class="icon-target" />
            </div>
            <div>
              <h3>Nenhuma meta encontrada</h3>
              <p>Cadastre seu primeiro objetivo financeiro para acompanhar seu progresso.</p>
            </div>
            <button @click="abrirModalNovaMeta" class="btn-add-empty">
              Adicionar Meta
            </button>
          </div>

          <div v-else class="goals-grid animar">
            <CardMetaItem
              v-for="meta in metasStore.metas"
              :key="meta.id"
              :meta="meta"
              @editar="abrirModalEdicao"
              @deletar="deletarMeta"
            />
          </div>

        </div>
      </main>
    </div>

    <AdicionarMeta
      v-if="modalAberto"
      :metaParaEditar="metaEmEdicao"
      @fechar="modalAberto = false"
      @salvar="salvarMeta"
    />
  </div>
</template>

<style scoped>
.animar {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out;
}

.animar.exibir {
  opacity: 1;
  transform: translateY(0);
}

.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  background-color: #ffffff;
  overflow-x: hidden;
  margin: 0;
  border: none;
}

.app-layout :deep(.desktop-sidebar) {
  display: none !important;
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 0;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #ffffff;
}

.metas-page {
  flex: 1;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1e293b;
  box-sizing: border-box;
  overflow-y: visible;
  background-color: #ffffff;
  width: 100%;
}

.metas-container {
  max-width: 1150px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
}

.metas-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.metas-header h1 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.metas-header p {
  font-size: 0.875rem;
  color: #64748b;
  margin: 2px 0 0 0;
}

.btn-add-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #006400;
  color: #ffffff;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;
  width: 100%;
}

.btn-add-meta:hover {
  background-color: #228b22;
}

.icon-plus {
  width: 16px;
  height: 16px;
}

.loading-state {
  text-align: center;
  padding: 40px 0;
  color: #94a3b8;
  font-size: 0.875rem;
}

.empty-state {
  background-color: #ffffff;
  padding: 24px 16px;
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
  font-size: 1rem;
  font-weight: 700;
  color: #334155;
  margin: 0;
}

.empty-state p {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 4px 0 0 0;
}

.btn-add-empty {
  background-color: #006400;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
}

.btn-add-empty:hover {
  background-color: #228b22;
}

.goals-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 640px) {
  .metas-page {
    padding: 24px;
  }
  .metas-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .btn-add-meta {
    width: auto;
  }
  .metas-header h1 {
    font-size: 1.6rem;
  }
}

@media (min-width: 1024px) {
  .app-layout {
    background-color: #f8fafc;
  }
  .app-layout :deep(.desktop-sidebar) {
    display: flex !important;
  }
  .main-wrapper {
    height: 100vh;
    overflow-y: hidden;
    background-color: #f8fafc;
  }
  .metas-page {
    padding: 32px 40px;
    overflow-y: auto;
    background-color: #f8fafc;
  }
  .metas-header h1 {
    font-size: 1.8rem;
  }
  .goals-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}
</style>

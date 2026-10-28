<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTransacoesStore } from '@/store/transacoes'
import SideBarComponent from '@/components/SideBarComponent.vue'
import TransacoesStats from '@/components/transacoes/TransacoesStats.vue'
import TransacoesLista from '@/components/transacoes/TransacoesLista.vue'
import TransacaoModal from '@/components/transacoes/TransacaoModal.vue'

const transacoesStore = useTransacoesStore()
const modalAberta = ref(false)
let observer = null

onMounted(async () => {
  await transacoesStore.buscarTransacoes('todas')

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('exibir')
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.animar').forEach((el) => observer.observe(el))
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div class="layout-app">
    
    <SideBarComponent class="sidebar" />

    
    <div class="main-wrapper">
      
      

      <main class="transacoes-container">
        <div class="header-pagina animar">
          <div>
            <h1>Transações</h1>
            <p>Gerencie todas as suas movimentações financeiras</p>
          </div>
        </div>


        <TransacoesStats
          class="animar"
          :resumo="transacoesStore.resumo"
        />

        <TransacoesLista
          class="animar"
          :transacoes="transacoesStore.transacoes"
          :carregando="transacoesStore.carregando"
          @filtrar="(tipo) => transacoesStore.buscarTransacoes(tipo)"
          @exportar="transacoesStore.exportarTransacoes"
          @abrir-modal="modalAberta = true"
        />

        
        <TransacaoModal
          v-if="modalAberta"
          @fechar="modalAberta = false"
        />
      </main>
    </div>
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


.layout-app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: var(--opes-paper);
  overflow: hidden;
  margin: 0;
}


.layout-app :deep(.desktop-sidebar) {
  display: none !important;
}

.main-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100vh;
  position: relative;
  overflow: hidden;
  width: 100%;
}


.transacoes-container {
  flex: 1;
  padding: 16px 16px 90px 16px;
  box-sizing: border-box;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow-y: auto;
}

.header-pagina {
  margin-bottom: 20px;
}

.header-pagina h1 {
  font-size: 24px;
  font-weight: bold;
  color: var(--opes-ink);
  margin-bottom: 4px;
}

.header-pagina p {
  color: var(--opes-forest);
  font-size: 13px;
}


@media (min-width: 1024px) {
  .layout-app {
    flex-direction: row; 
  }

  .layout-app :deep(.desktop-sidebar) {
    display: flex !important;
  }

  .main-wrapper {
    height: 100vh;
    overflow: hidden;
  }

  .transacoes-container {
    padding: 32px 40px;
  }

  .header-pagina h1 {
    font-size: 28px;
  }

  .header-pagina p {
    font-size: 14px;
  }
}
</style>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTransacoesStore } from '@/store/transacoes'
import SideBarComponent from '@/components/SideBarComponent.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
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
      <HeaderComponent />

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
  min-height: 100vh;
  background-color: #f8fafc;
}


.main-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
}

.transacoes-container {
  flex: 1;
  padding: 16px;
  box-sizing: border-box;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.header-pagina {
  margin-bottom: 20px;
}

.header-pagina h1 {
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 4px;
}

.header-pagina p {
  color: #64748b;
  font-size: 13px;
}


@media (min-width: 1024px) {
  .layout-app {
    flex-direction: row;
  }

  .main-wrapper {
    overflow-y: auto;
    height: 100vh;
  }

  .transacoes-container {
    padding: 30px;
  }

  .header-pagina h1 {
    font-size: 28px;
  }

  .header-pagina p {
    font-size: 14px;
  }
}
</style>

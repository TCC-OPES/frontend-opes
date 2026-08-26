<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineProps({
  transacoes: {
    type: Array,
    required: true,
    default: () => []
  },
  carregando: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['filtrar', 'exportar', 'abrir-modal'])
const filtroAtivo = ref('todas')
let observer = null

function mudarFiltro(tipo) {
  filtroAtivo.value = tipo
  emit('filtrar', tipo)
}

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(dataIso) {
  if (!dataIso) return ''
  const data = new Date(dataIso)
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

onMounted(() => {
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
  <div class="transacoes-lista-wrapper">
    <div class="barra-acoes animar">
      <div class="filtros-abas">
        <button :class="{ ativo: filtroAtivo === 'todas' }" @click="mudarFiltro('todas')">Todas</button>
        <button :class="{ ativo: filtroAtivo === 'receita' }" @click="mudarFiltro('receita')">Receitas</button>
        <button :class="{ ativo: filtroAtivo === 'despesa' }" @click="mudarFiltro('despesa')">Despesas</button>
      </div>

      <div class="botoes-direita">
        <button class="btn-acao" @click="emit('exportar')" title="Exportar">Exportar</button>
        <button class="btn-primario" @click="emit('abrir-modal')">Nova Transação</button>
      </div>
    </div>

    <div class="historico-secao animar">
      <h3>Histórico de Transações ({{ transacoes.length }})</h3>

      <div v-if="carregando" class="loading">Carregando transações do servidor...</div>
      <div v-else-if="transacoes.length === 0" class="vazio">Nenhuma transação encontrada.</div>

      <div v-else class="lista-transacoes">
        <div v-for="item in transacoes" :key="item.id" class="item-transacao">
          <div class="info-esquerda">
            <div class="icone-transacao" :class="item.tipo">
              <span>{{ item.tipo === 'receita' ? '↓' : '↑' }}</span>
            </div>
            <div>
              <strong>{{ item.titulo }}</strong>
              <small>{{ item.categoria }}</small>
            </div>
          </div>

          <div class="info-direita">
            <span :class="item.tipo === 'receita' ? 'texto-verde' : 'texto-vermelho'">
              {{ item.tipo === 'receita' ? '+' : '-' }} {{ formatarMoeda(item.valor) }}
            </span>
            <small>{{ formatarData(item.data) }}</small>
          </div>
        </div>
      </div>
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

.barra-acoes {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.filtros-abas {
  display: flex;
  background: #e2e8f0;
  padding: 4px;
  border-radius: 10px;
  gap: 4px;
  width: 100%;
}

.filtros-abas button {
  flex: 1;
  background: transparent;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  font-size: 13px;
  text-align: center;
}

.filtros-abas button.ativo {
  background: white;
  color: #0f172a;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.botoes-direita {
  display: flex;
  gap: 10px;
  width: 100%;
}

.btn-acao {
  flex: 1;
  background: white;
  border: 1px solid #cbd5e1;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  text-align: center;
}

.btn-primario {
  flex: 1.5;
  background: #16a34a;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  text-align: center;
}

.historico-secao h3 {
  font-size: 18px;
  color: #1e293b;
  margin-bottom: 16px;
}

.lista-transacoes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-transacao {
  background: white;
  padding: 16px 20px;
  border-radius: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
}

.info-esquerda {
  display: flex;
  align-items: center;
  gap: 14px;
}

.icone-transacao {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  font-weight: bold;
}

.info-esquerda strong {
  display: block;
  color: #0f172a;
  font-size: 15px;
}

.info-esquerda small, .info-direita small {
  color: #94a3b8;
  font-size: 13px;
}

.info-direita {
  text-align: right;
}

.info-direita span {
  display: block;
  font-weight: bold;
  font-size: 16px;
}

.texto-verde {
  color: #16a34a !important;
}

.texto-vermelho {
  color: #dc2626 !important;
}

.vazio, .loading {
  text-align: center;
  padding: 40px;
  color: #64748b;
  background: white;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
}

@media (min-width: 768px) {
  .barra-acoes {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .filtros-abas {
    width: auto;
  }
  .filtros-abas button {
    flex: initial;
  }
  .botoes-direita {
    width: auto;
  }
  .btn-acao, .btn-primario {
    flex: initial;
  }
}
</style>

<script setup>
defineProps({
  resumo: {
    type: Object,
    required: true,
    default: () => ({ totalTransacoes: 0, totalReceitas: 0, totalDespesas: 0 })
  }
})

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>

<template>
  <div class="cards-resumo">
    <div class="card-metrica">
      <span>Total Transações</span>
      <h2>{{ resumo.totalTransacoes }}</h2>
    </div>

    <div class="card-metrica receita">
      <span>Total Receitas</span>
      <h2 class="texto-verde">{{ formatarMoeda(resumo.totalReceitas) }}</h2>
    </div>

    <div class="card-metrica despesa">
      <span>Total Despesas</span>
      <h2 class="texto-vermelho">{{ formatarMoeda(resumo.totalDespesas) }}</h2>
    </div>
  </div>
</template>

<style scoped>
.cards-resumo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.card-metrica {
  background: var(--opes-paper);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid var(--opes-border);
}

.card-metrica span {
  font-size: 14px;
  color: var(--opes-forest);
}

.card-metrica h2 {
  font-size: 28px;
  margin: 10px 0 6px 0;
  color: var(--opes-ink);
}

.card-metrica small {
  font-size: 12px;
  color: var(--opes-muted);
}

.texto-verde { color: var(--opes-forest) !important; }
.texto-vermelho { color: var(--opes-danger) !important; }
</style>

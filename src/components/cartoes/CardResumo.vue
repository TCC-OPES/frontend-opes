<script setup>
import { computed } from 'vue'
const props = defineProps({ cartoes: { type: Array, default: () => [] } })
const totalLimite = computed(() => props.cartoes.reduce((s, c) => s + (Number(c.limite) || 0), 0))
const totalUtilizado = computed(() => props.cartoes.reduce((s, c) => s + (Number(c.valor_utilizado) || 0), 0))
const totalDisponivel = computed(() => Math.max(0, totalLimite.value - totalUtilizado.value))
const moeda = valor => Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
</script>

<template>
  <section class="metricas" aria-label="Resumo dos cartões">
    <div class="metrica">
      <div class="metrica-topo"><span>Limite total</span><i class="far fa-credit-card" aria-hidden="true"></i></div>
      <strong>{{ moeda(totalLimite) }}</strong>
    </div>
    <div class="metrica">
      <div class="metrica-topo"><span>Valor utilizado</span><i class="fas fa-chart-line" aria-hidden="true"></i></div>
      <strong class="utilizado">{{ moeda(totalUtilizado) }}</strong>
    </div>
    <div class="metrica">
      <div class="metrica-topo"><span>Disponível</span><i class="fas fa-lock" aria-hidden="true"></i></div>
      <strong class="disponivel">{{ moeda(totalDisponivel) }}</strong>
    </div>
  </section>
</template>

<style scoped>
.metricas{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px;margin-bottom:27px}
.metrica{min-width:0;background:var(--opes-paper);border:1px solid var(--opes-border);border-radius:15px;min-height:136px;padding:24px;display:flex;flex-direction:column;justify-content:space-between}
.metrica-topo{display:flex;justify-content:space-between;align-items:center;gap:12px;color:var(--opes-forest);font-size:13px}
.metrica-topo i{font-size:17px}
.metrica strong{font-size:clamp(19px,2.3vw,28px);color:var(--opes-ink);overflow-wrap:anywhere}
.metrica strong.utilizado{color:var(--opes-caramel-dark)}
.metrica strong.disponivel{color:var(--opes-forest)}
@media(max-width:900px){.metricas{grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}}
@media(max-width:520px){.metricas{grid-template-columns:1fr}.metrica{min-height:110px;padding:18px}}
</style>
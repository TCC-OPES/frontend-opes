<script setup>
import { computed } from 'vue'

const props = defineProps({
  cartao: { type: Object, required: true }
})

const limite = computed(() => Math.max(0, Number(props.cartao.limite) || 0))
const utilizado = computed(() => Math.max(0, Number(props.cartao.valor_utilizado) || 0))
const percentual = computed(() => limite.value ? Math.min(100, utilizado.value / limite.value * 100) : 0)
const cor = computed(() => /^#[0-9a-fA-F]{6}$/.test(props.cartao.cor || '') ? props.cartao.cor : '#14372d')
const corTexto = computed(() => {
  const hex = cor.value.slice(1)
  const [r, g, b] = [0, 2, 4].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
  const canais = [r, g, b].map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
  return 0.2126 * canais[0] + 0.7152 * canais[1] + 0.0722 * canais[2] > 0.4 ? '#14271e' : '#fffefa'
})
const vencimento = computed(() => {
  const valor = String(props.cartao.data_vencimento || '')
  return /^\d{4}-\d{2}-\d{2}/.test(valor) ? valor.slice(0, 10).split('-').reverse().join('/') : (valor || 'Não informado')
})
const moeda = valor => Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
</script>

<template>
  <article class="cartao-item">
    <div class="cartao-visual" :style="{ backgroundColor: cor, color: corTexto }">
      <div>
        <span class="banco">{{ cartao.banco || 'Instituição financeira' }}</span>
        <h3>{{ cartao.nome || 'Cartão' }}</h3>
      </div>
      <div class="numero">•••• •••• •••• {{ cartao.ultimos_digitos || '••••' }}</div>
      <div class="rodape-visual">
        <div><span class="rotulo">Vencimento</span><strong>{{ vencimento }}</strong></div>
        <i class="far fa-credit-card" aria-hidden="true"></i>
      </div>
    </div>
    <div class="cartao-info">
      <div class="info-linha"><span>Limite utilizado</span><strong>{{ percentual.toFixed(1).replace('.', ',') }}%</strong></div>
      <div class="trilha" role="progressbar" :aria-valuenow="Math.round(percentual)" aria-valuemin="0" aria-valuemax="100" aria-label="Porcentagem do limite utilizado">
        <div class="progresso" :style="{ width: percentual + '%' }"></div>
      </div>
      <div class="info-linha valores"><span>{{ moeda(utilizado) }}</span><span>{{ moeda(limite) }}</span></div>
    </div>
  </article>
</template>

<style scoped>
.cartao-item{min-width:0;background:var(--opes-paper);border:1px solid var(--opes-border);border-radius:15px;overflow:hidden;box-shadow:0 2px 5px rgba(16,38,28,.035);transition:transform .2s,box-shadow .2s}
.cartao-item:hover{transform:translateY(-3px);box-shadow:0 9px 22px rgba(16,38,28,.08)}
.cartao-visual{min-height:225px;padding:24px;display:flex;flex-direction:column;justify-content:space-between}
.banco{font-size:12px;display:block;opacity:.9;margin-bottom:7px}
.cartao-visual h3{font-size:17px;margin:0;color:inherit!important;font-weight:750}
.numero{font-size:14px;letter-spacing:.15em;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-weight:700}
.rodape-visual{display:flex;align-items:end;justify-content:space-between}
.rodape-visual .rotulo{display:block;font-size:11px;opacity:.85;margin-bottom:6px}
.rodape-visual strong{font-size:14px}
.rodape-visual i{font-size:27px}
.cartao-info{padding:23px 24px 20px}
.info-linha{display:flex;justify-content:space-between;gap:10px;align-items:center;font-size:12px;color:var(--opes-muted)}
.info-linha strong{color:var(--opes-ink)}
.trilha{height:8px;background:var(--opes-sand);border-radius:99px;margin:13px 0;overflow:hidden}
.progresso{height:100%;border-radius:inherit;background:var(--opes-forest);transition:width .3s}
.valores{font-size:12px;color:var(--opes-ink)}
@media(max-width:720px){.cartao-visual{min-height:210px}.cartao-info{padding:18px}}
</style>
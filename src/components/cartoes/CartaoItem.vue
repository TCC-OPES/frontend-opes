<script setup>

import { computed } from 'vue'



const props = defineProps({

cartao: {

type: Object,

required: true

}

})



const limite = computed(() => Number(props.cartao.limite || 0))

const utilizado = computed(() => Number(props.cartao.valor_utilizado || 0))

const percentual = computed(() => {

return limite.value > 0 ? Math.min(100, (utilizado.value / limite.value) * 100) : 0

})



const formatCurrency = (val) => {

return Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

}

</script>



<template>

<div class="card-container">

<!-- Visual do Cartão -->

<div

class="card-item"

:style="{ backgroundColor: cartao.cor || '#006B2B' }"

>

<div class="card-header">

<span class="card-bank">{{ cartao.banco }}</span>

<h3 class="card-name">{{ cartao.nome }}</h3>

</div>



<div class="card-number">

•••• •••• •••• {{ cartao.ultimos_digitos || '****' }}

</div>



<div class="card-footer">

<div>

<span class="footer-label">Vencimento</span>

<span class="footer-value">{{ cartao.data_vencimento }}</span>

</div>



<div class="chip-icon">

<div class="chip-line"></div>

</div>

</div>

</div>



<!-- Barra de Progresso do Limite -->

<div class="card-limit-info">

<div class="limit-header">

<span>Limite utilizado</span>

<span class="limit-percentage">{{ percentual.toFixed(1) }}%</span>

</div>



<div class="progress-bar-bg">

<div

class="progress-bar-fill"

:style="{ width: `${percentual}%` }"

></div>

</div>



<div class="limit-values">

<span>{{ formatCurrency(utilizado) }}</span>

<span>{{ formatCurrency(limite) }}</span>

</div>

</div>

</div>

</template>



<style scoped>

.card-container {

background-color: #ffffff;

border-radius: 1rem;

border: 1px solid #f1f5f9;

overflow: hidden;

box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

}



.card-item {

height: 12rem;

padding: 1.25rem;

color: #ffffff;

display: flex;

flex-direction: column;

justify-content: space-between;

position: relative;

}



.card-bank {

font-size: 0.75rem;

opacity: 0.9;

display: block;

}



.card-name {

font-weight: 700;

font-size: 1.125rem;

margin-top: 0.125rem;

}



.card-number {

letter-spacing: 0.2em;

font-size: 1rem;

font-family: monospace;

opacity: 0.9;

}



.card-footer {

display: flex;

justify-content: space-between;

align-items: flex-end;

}



.footer-label {

font-size: 0.625rem;

opacity: 0.8;

display: block;

text-transform: uppercase;

}



.footer-value {

font-size: 0.875rem;

font-weight: 600;

}



.chip-icon {

width: 2rem;

height: 1.25rem;

border: 2px solid #ffffff;

border-radius: 0.25rem;

display: flex;

align-items: center;

}



.chip-line {

width: 100%;

height: 0.2rem;

background-color: #ffffff;

opacity: 0.4;

}



.card-limit-info {

padding: 1rem;

display: flex;

flex-direction: column;

gap: 0.5rem;

}



.limit-header {

display: flex;

justify-content: space-between;

font-size: 0.75rem;

color: #64748b;

font-weight: 500;

}



.limit-percentage {

font-weight: 700;

color: #1e293b;

}



.progress-bar-bg {

width: 100%;

background-color: #f1f5f9;

height: 0.5rem;

border-radius: 999px;

overflow: hidden;

}



.progress-bar-fill {

background-color: #00875a;

height: 100%;

border-radius: 999px;

transition: width 0.3s ease;

}



.limit-values {

display: flex;

justify-content: space-between;

font-size: 0.75rem;

color: #94a3b8;

font-weight: 500;

}

</style>
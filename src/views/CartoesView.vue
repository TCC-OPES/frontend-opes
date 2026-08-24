<script setup>

import { ref, onMounted } from 'vue'

import CardResumo from '@/components/cartoes/CardResumo.vue'

import CartaoItem from '@/components/cartoes/CartaoItem.vue'

import NovoCartao from '@/components/cartoes/NovoCartao.vue'



const cartoes = ref([])

const showModal = ref(false)

const carregando = ref(true)



const API_URL = 'https://opes.class.fabricadesoftware.ifc.edu.br/api/cartoes/'



const fetchCartoes = async () => {

try {

const token = localStorage.getItem('token') || localStorage.getItem('access')

const res = await fetch(API_URL, {

headers: {

'Authorization': `Bearer ${token}`

}

})

if (res.ok) {

cartoes.value = await res.json()

} else {

console.error('Falha ao buscar cartões. Status:', res.status)

}

} catch (error) {

console.error('Erro ao carregar cartões:', error)

} finally {

carregando.value = false

}

}



const handleCartaoAdicionado = (novoCartao) => {

cartoes.value.push(novoCartao)

showModal.value = false

}



onMounted(() => {

fetchCartoes()

})

</script>



<template>

<div class="p-6 bg-gray-50 min-h-screen">

<!-- Cabeçalho -->

<div class="flex justify-between items-center mb-6">

<div>

<h1 class="text-2xl font-bold text-gray-800">Cartões</h1>

<p class="text-sm text-gray-500">Gerencie seus cartões de crédito</p>

</div>

<button

@click="showModal = true"

class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 shadow-sm"

>

<span>+</span> Adicionar Cartão

</button>

</div>



<!-- Resumo de Métricas -->

<CardResumo :cartoes="cartoes" />



<!-- Grid de Cartões -->

<div v-if="!carregando" class="grid grid-cols-1 md:grid-cols-3 gap-6">

<CartaoItem

v-for="cartao in cartoes"

:key="cartao.id"

:cartao="cartao"

/>



<!-- Botão Tracejado na Grade -->

<button

@click="showModal = true"

class="h-48 rounded-2xl border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/50 flex flex-col items-center justify-center text-gray-400 hover:text-emerald-600 transition group"

>

<div class="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-emerald-100 flex items-center justify-center text-xl font-bold transition mb-1">

+

</div>

<span class="font-medium text-sm">Adicionar Cartão</span>

</button>

</div>



<!-- Feedback de Carregamento -->

<div v-else class="text-center py-12 text-gray-500 text-sm">

Carregando cartões...

</div>



<!-- Modal de Cadastro -->

<NovoCartao

v-if="showModal"

@close="showModal = false"

@success="handleCartaoAdicionado"

/>

</div>

</template> 


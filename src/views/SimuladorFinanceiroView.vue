<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import SideBarComponent from '@/components/SideBarComponent.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'

const valor = ref('')
const parcelas = ref(1)
const dataCompra = ref(new Date().toISOString().slice(0,10))
const transacoes = ref([])
const ocorrencias = ref([])
const carregando = ref(false)
const erro = ref('')
const moeda = v => Number(v).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})
const valorValido = computed(()=>Number(valor.value)>0&&Number.isInteger(Number(parcelas.value))&&Number(parcelas.value)>0&&dataCompra.value)
const saldoAtual = computed(()=>transacoes.value.reduce((s,t)=>s+(t.tipo==='receita'?1:-1)*Number(t.valor),0))
function adicionarMes(data,i){
  const [a,m,d]=data.split('-').map(Number)
  const base=new Date(a,m-1+i,1)
  const dia=Math.min(d,new Date(base.getFullYear(),base.getMonth()+1,0).getDate())
  return [base.getFullYear(),String(base.getMonth()+1).padStart(2,'0'),String(dia).padStart(2,'0')].join('-')
}
const resultado = computed(()=>{
  if(!valorValido.value)return null
  const quantidade=Number(parcelas.value)
  const centavos=Math.round(Number(valor.value)*100)
  const minimo=Math.floor(centavos/quantidade)
  let saldo=saldoAtual.value
  const hoje=new Date().toLocaleDateString('en-CA')
  const projecao=[]
  const recorrenciasFuturas=ocorrencias.value.filter(e=>!e.confirmada_em && e.vencimento>=hoje)
  const fim=adicionarMes(dataCompra.value, quantidade-1)
  const eventos=[...recorrenciasFuturas.filter(e=>e.vencimento<=fim).map(e=>({
    data:e.vencimento,valor:(e.tipo==='receita'?1:-1)*Number(e.valor),titulo:e.titulo
  }))]
  for(let i=0;i<quantidade;i++)eventos.push({
    data:adicionarMes(dataCompra.value,i),
    valor:-(minimo+(i===quantidade-1?centavos%quantidade:0))/100,titulo:'Compra simulada'
  })
  eventos.sort((a,b)=>a.data.localeCompare(b.data))
  for(const e of eventos){saldo+=e.valor;projecao.push({...e,saldo})}
  return {saldo,projecao,parcela:centavos/quantidade/100}
})
async function carregar(){
  carregando.value=true;erro.value=''
  try{
    const [t,o]=await Promise.all([
      api.get('/api/transacoes/'),
      api.get('/api/recorrencias/ocorrencias/',{params:{
        inicio:new Date().toLocaleDateString('en-CA'),
        fim:new Date(Date.now()+365*86400000).toLocaleDateString('en-CA')
      }})
    ])
    transacoes.value=Array.isArray(t.data)?t.data:t.data.results||[]
    ocorrencias.value=Array.isArray(o.data)?o.data:o.data.results||[]
  }catch{erro.value='Não foi possível carregar a projeção. A FEAT-52 precisa estar integrada à API.'}
  finally{carregando.value=false}
}
onMounted(carregar)
</script>
<template>
<div class="layout"><SideBarComponent /><div class="principal"><HeaderComponent /><main class="conteudo">
  <h1>Posso comprar?</h1><p>Simule uma compra sem alterar suas transações ou seu saldo.</p>
  <p class="aviso">Estimativa baseada nas transações registradas e recorrências conhecidas. Não inclui movimentações não cadastradas, juros ou rendimentos.</p>
  <p v-if="erro" role="alert" class="erro">{{ erro }}</p><p v-if="carregando">Carregando dados financeiros...</p>
  <form class="painel" @submit.prevent>
    <h2>Simulação</h2>
    <label>Valor da compra (R$) <input v-model="valor" type="number" min="0.01" step="0.01" placeholder="Ex.: 1200" /></label>
    <label>Data da compra <input v-model="dataCompra" type="date" /></label>
    <label>Número de parcelas <input v-model="parcelas" type="number" min="1" max="120" step="1" /></label>
  </form>
  <section class="painel" v-if="resultado">
    <h2>Impacto estimado</h2>
    <div class="resumo"><div><span>Saldo atual calculado</span><strong>{{ moeda(saldoAtual) }}</strong></div>
      <div><span>Parcela média</span><strong>{{ moeda(resultado.parcela) }}</strong></div>
      <div><span>Saldo projetado ao fim</span><strong :class="{negativo:resultado.saldo<0}">{{ moeda(resultado.saldo) }}</strong></div></div>
    <p v-if="resultado.saldo<0" class="erro">A projeção indica saldo insuficiente. Considere reduzir ou adiar a compra.</p>
    <h3>Movimentações consideradas</h3>
    <div class="linha" v-for="(e,i) in resultado.projecao" :key="i">
      <span>{{ e.data }} · {{ e.titulo }}</span><span>{{ moeda(e.valor) }}</span><strong>{{ moeda(e.saldo) }}</strong>
    </div>
    <p v-if="!resultado.projecao.length">Nenhuma movimentação futura identificada.</p>
  </section>
</main></div></div>
</template>
<style scoped>
.layout{display:flex;min-height:100vh;background:#f8fafc}.principal{flex:1;min-width:0}.conteudo{max-width:1050px;margin:auto;padding:32px 24px 100px;color:#1e293b}h1{font-size:28px}h2{font-size:20px}h3{font-size:17px;margin:24px 0 14px}.painel{background:white;padding:24px;border:1px solid #e2e8f0;border-radius:14px;margin-top:20px;display:grid;gap:16px}.painel label{display:flex;flex-direction:column;gap:8px;max-width:420px}input{padding:12px;border:1px solid #cbd5e1;border-radius:8px}.aviso{background:#fef3c7;padding:14px;border-radius:8px;margin-top:20px}.erro,.negativo{color:#b91c1c}.resumo{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:16px}.resumo div{display:flex;flex-direction:column;gap:6px}.resumo span{color:#64748b}.resumo strong{font-size:22px}.linha{display:flex;justify-content:space-between;gap:12px;border-top:1px solid #e2e8f0;padding:12px 0;flex-wrap:wrap}@media(max-width:800px){.layout{display:block}.conteudo{padding:20px 16px 100px}}
</style>
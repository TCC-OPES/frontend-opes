<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import SideBarComponent from '@/components/SideBarComponent.vue'
import HeaderComponent from '@/components/HeaderComponent.vue'

const lista = ref([])
const loading = ref(false)
const erro = ref('')
const mensagem = ref('')
const formulario = ref({ titulo: '', categoria: '', tipo: 'despesa', valor: '', frequencia: 'mensal', primeiro_vencimento: '' })
const moeda = v => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const ativas = computed(() => lista.value.filter(x => x.ativa))

async function carregar() {
  loading.value = true
  erro.value = ''
  try {
    const { data } = await api.get('/api/recorrencias/')
    lista.value = Array.isArray(data) ? data : (data.results || [])
  } catch {
    erro.value = 'Não foi possível carregar as contas recorrentes.'
  } finally {
    loading.value = false
  }
}
async function salvar() {
  erro.value = ''
  mensagem.value = ''
  try {
    await api.post('/api/recorrencias/', formulario.value)
    mensagem.value = 'Conta recorrente cadastrada!'
    formulario.value = { titulo: '', categoria: '', tipo: 'despesa', valor: '', frequencia: 'mensal', primeiro_vencimento: '' }
    await carregar()
  } catch (e) {
    erro.value = JSON.stringify(e.response?.data || 'Erro ao cadastrar.')
  }
}
async function alternar(item) {
  try {
    await api.patch('/api/recorrencias/' + item.id + '/', { ativa: !item.ativa })
    await carregar()
  } catch {
    erro.value = 'Erro ao atualizar a recorrência.'
  }
}
onMounted(carregar)
</script>

<template>
  <div class="layout"><SideBarComponent /><div class="principal"><HeaderComponent />
    <main class="conteudo"><h1>Contas recorrentes</h1><p>Gerencie seus compromissos e recebimentos fixos.</p>
      <p v-if="erro" role="alert" class="erro">{{ erro }}</p><p v-if="mensagem" role="status" class="sucesso">{{ mensagem }}</p>
      <form class="painel formulario" @submit.prevent="salvar">
        <h2>Nova recorrência</h2>
        <label>Descrição <input v-model.trim="formulario.titulo" required maxlength="255" placeholder="Ex.: Internet" /></label>
        <label>Categoria <input v-model.trim="formulario.categoria" required maxlength="100" placeholder="Ex.: Moradia" /></label>
        <label>Tipo <select v-model="formulario.tipo"><option value="despesa">Despesa</option><option value="receita">Receita</option></select></label>
        <label>Valor (R$) <input v-model="formulario.valor" type="number" step="0.01" min="0.01" required /></label>
        <label>Frequência <select v-model="formulario.frequencia"><option value="mensal">Mensal</option><option value="semanal">Semanal</option><option value="anual">Anual</option></select></label>
        <label>Primeiro vencimento <input v-model="formulario.primeiro_vencimento" type="date" required /></label>
        <button type="submit">Cadastrar conta</button>
      </form>
      <section class="painel"><h2>Suas recorrências ({{ ativas.length }} ativas)</h2>
        <p v-if="loading">Carregando...</p><p v-else-if="!lista.length">Nenhuma conta recorrente cadastrada.</p>
        <div v-for="item in lista" :key="item.id" class="item">
          <div><strong>{{ item.titulo }}</strong><p>{{ item.categoria }} · {{ item.frequencia }} · início {{ item.primeiro_vencimento }}</p></div>
          <div><strong>{{ moeda(item.valor) }}</strong><p>{{ item.ativa ? 'Ativa' : 'Pausada' }}</p>
            <button type="button" @click="alternar(item)">{{ item.ativa ? 'Pausar' : 'Reativar' }}</button></div>
        </div>
      </section>
    </main></div></div>
</template>

<style scoped>
.layout{display:flex;min-height:100vh;background:#f8fafc}.principal{flex:1;min-width:0}.conteudo{max-width:1100px;margin:auto;padding:32px 24px 100px;color:#1e293b}h1{font-size:28px}h2{font-size:20px;margin-bottom:16px}.painel{background:white;border:1px solid #e2e8f0;border-radius:14px;padding:24px;margin-top:24px}.formulario{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}.formulario h2{grid-column:1/-1}label{display:flex;flex-direction:column;gap:6px;font-size:14px}input,select{padding:12px;border:1px solid #cbd5e1;border-radius:8px;background:white}button{background:#0f766e;color:white;border:0;border-radius:8px;padding:11px 16px;cursor:pointer}.item{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:16px 0;border-top:1px solid #e2e8f0}.item p{color:#64748b;margin:6px 0}.erro{color:#b91c1c}.sucesso{color:#047857}@media(max-width:800px){.layout{display:block}.conteudo{padding:20px 16px 100px}}
</style>
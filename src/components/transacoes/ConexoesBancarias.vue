<script setup>
import { onMounted, ref } from 'vue'
import { PluggyConnect } from 'pluggy-connect-sdk'
import api from '@/services/api'

const emit = defineEmits(['sincronizado'])
const conexoes = ref([])
const ocupada = ref(false)
const mensagem = ref('')
const erro = ref(false)

function avisar(texto, falha = false) {
  mensagem.value = texto
  erro.value = falha
}

async function carregarConexoes() {
  try {
    const { data } = await api.get('/api/openfinance/conexoes/')
    conexoes.value = data
  } catch {
    avisar('Não foi possível carregar suas contas conectadas.', true)
  }
}

async function sincronizar(itemId) {
  ocupada.value = true
  try {
    const { data } = await api.post('/api/openfinance/sincronizar/', { itemId })
    avisar(`${data.novas_transacoes} nova(s) transação(ões) importada(s).`)
    emit('sincronizado')
  } catch (error) {
    avisar(error.response?.data?.detail || 'Não foi possível sincronizar agora.', true)
  } finally {
    ocupada.value = false
  }
}

async function conectar(itemId = null) {
  ocupada.value = true
  avisar('')
  try {
    const { data } = await api.post('/api/openfinance/connect-token/', itemId ? { itemId } : {})
    const widget = new PluggyConnect({
      connectToken: data.accessToken,
      ...(itemId ? { updateItem: itemId } : {}),
      onSuccess: async ({ item }) => {
        ocupada.value = true
        try {
          await api.post('/api/openfinance/salvar-conexao/', { itemId: item.id })
          await carregarConexoes()
          await sincronizar(item.id)
        } catch (error) {
          avisar(error.response?.data?.detail || 'A conta foi conectada, mas não foi possível salvá-la.', true)
        } finally {
          ocupada.value = false
        }
      },
      onError: () => {
        avisar('A conexão com o banco não foi concluída. Tente novamente.', true)
        ocupada.value = false
      },
      onClose: () => { ocupada.value = false },
    })
    widget.init()
    ocupada.value = false
  } catch (error) {
    avisar(error.response?.data?.detail || 'Não foi possível abrir a conexão bancária.', true)
    ocupada.value = false
  }
}

onMounted(carregarConexoes)
</script>

<template>
  <section class="conexoes" aria-label="Contas bancárias">
    <div class="cabecalho">
      <div>
        <h2>Contas bancárias</h2>
        <p>Conecte uma instituição para ver as movimentações junto das suas transações.</p>
      </div>
      <button type="button" :disabled="ocupada" @click="conectar()">Conectar banco</button>
    </div>

    <p v-if="mensagem" class="mensagem" :class="{ erro }" role="status">{{ mensagem }}</p>

    <ul v-if="conexoes.length" class="lista">
      <li v-for="conexao in conexoes" :key="conexao.item_id">
        <span>{{ conexao.instituicao_nome || 'Instituição bancária' }}</span>
        <div class="acoes">
          <button type="button" :disabled="ocupada" @click="sincronizar(conexao.item_id)">Sincronizar</button>
          <button type="button" :disabled="ocupada" @click="conectar(conexao.item_id)">Reconectar</button>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.conexoes { background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; margin-bottom: 24px; }
.cabecalho, .lista li, .acoes { display: flex; align-items: center; gap: 12px; }
.cabecalho, .lista li { justify-content: space-between; }
h2 { margin: 0 0 4px; color: #1e293b; font-size: 18px; }
p { margin: 0; color: #64748b; font-size: 13px; }
button { background: #16a34a; color: white; border: 0; border-radius: 9px; padding: 10px 13px; cursor: pointer; font-weight: 600; }
button:disabled { opacity: .55; cursor: wait; }
.lista { padding: 0; margin: 16px 0 0; list-style: none; }
.lista li { border-top: 1px solid #e2e8f0; padding: 12px 0; color: #334155; }
.acoes button { background: #eff6f2; color: #166534; }
.mensagem { margin-top: 14px; color: #166534; }
.mensagem.erro { color: #b91c1c; }
@media (max-width: 620px) { .cabecalho, .lista li { align-items: stretch; flex-direction: column; } .acoes { flex-wrap: wrap; } }
</style>

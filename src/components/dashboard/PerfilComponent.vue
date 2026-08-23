<template>
  <div class="perfil-layout">
    <SideBarComponent />

    <main class="pagina-perfil">
      <section v-if="dadosUsuario" class="container-perfil">
        <header class="header-perfil animar">
          <div>
            <h1>Meu <span class="texto-gradiente">Perfil</span></h1>
            <p>Gerencie suas informações e preferências de conta.</p>
          </div>
          <button v-if="!editando" class="botao-principal" @click="iniciarEdicao">
            Editar Perfil
          </button>
          <div v-else class="acoes-edicao">
            <button class="botao-secundario" @click="cancelarEdicao" :disabled="salvando">
              Cancelar
            </button>
            <button class="botao-principal" @click="salvarPerfil" :disabled="salvando">
              {{ salvando ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </header>

        <div class="layout-grid">
          <aside class="coluna-lateral animar">
            <div class="cartao-perfil centro">
              <div class="avatar-container">
                <div class="avatar-circulo" @click="abrirSeletorArquivo">
                  <img v-if="dadosUsuario.fotoUrl" :src="dadosUsuario.fotoUrl" alt="Foto de Perfil" class="foto-renderizada" />
                  <span v-else>{{ obterIniciais(dadosUsuario.nome) }}</span>
                </div>
                <button class="btn-foto" @click="abrirSeletorArquivo" title="Alterar Foto">📷</button>
                <input type="file" ref="fileInput" style="display: none" accept="image/*" @change="aoSelecionarFoto" />
              </div>

              <h2>{{ dadosUsuario.nome || 'Usuário' }}</h2>
              <p class="email-texto">{{ dadosUsuario.email }}</p>
            </div>
          </aside>

          <section class="coluna-principal animar">
            <div class="cartao-perfil">
              <h3 class="titulo-secao">👤 Informações Pessoais</h3>
              <div class="grade-inputs">
                <div class="campo">
                  <label>Nome Completo</label>
                  <input type="text" v-model="formEdicao.nome" :disabled="!editando" placeholder="Seu nome">
                </div>
                <div class="campo">
                  <label>Email</label>
                  <input type="email" :value="dadosUsuario.email" disabled>
                </div>
                <div class="campo">
                  <label>Telefone</label>
                  <input type="text" v-model="formEdicao.telefone" @input="aplicarMascaraTelefone" :disabled="!editando" placeholder="(00) 00000-0000">
                </div>
                <div class="campo">
                  <label>CPF</label>
                  <input type="text" v-model="formEdicao.cpf" @input="aplicarMascaraCPF" :disabled="!editando" placeholder="000.000.000-00">
                </div>
                <div class="campo">
                  <label>Data de Nascimento</label>
                  <input type="date" v-model="formEdicao.nascimento" :disabled="!editando">
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section v-else class="carregando">
        <div class="spinner"></div>
        <p>Buscando seus dados...</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import api from '@/services/api.js'
import SideBarComponent from '@/components/SideBarComponent.vue'

const dadosUsuario = ref(null)
const fileInput = ref(null)
const editando = ref(false)
const salvando = ref(false)
let observer = null

const formEdicao = reactive({
  nome: '',
  telefone: '',
  cpf: '',
  nascimento: ''
})

const formatarCPF = (v = '') => {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

const formatarTelefone = (v = '') => {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d)(\d{4})$/, '$1-$2')
}

const obterIniciais = (nome) => {
  if (!nome) return '?'
  const partes = nome.trim().split(' ')
  return partes.length > 1
    ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
    : partes[0][0].toUpperCase()
}

const aplicarMascaraCPF = (e) => { formEdicao.cpf = formatarCPF(e.target.value) }
const aplicarMascaraTelefone = (e) => { formEdicao.telefone = formatarTelefone(e.target.value) }

const sincronizarEstadoLocal = (novosDados) => {
  dadosUsuario.value = {
    nome: novosDados.name || '',
    email: novosDados.email || '',
    telefone: novosDados.telefone || '',
    cpf: novosDados.cpf || '',
    nascimento: novosDados.nascimento || '',
    fotoUrl: novosDados.foto || ''
  }

  const local = localStorage.getItem('user')
  if (local) {
    try {
      const parsed = JSON.parse(local)
      if (parsed.data) parsed.data = { ...parsed.data, ...novosDados }
      else Object.assign(parsed, novosDados)
      localStorage.setItem('user', JSON.stringify(parsed))
    } catch (e) {
      console.error('Erro ao salvar no Storage', e)
    }
  }
}

const carregarPerfil = async () => {
  try {
    const { data } = await api.get('api/me/')
    sincronizarEstadoLocal(data.data || data)
    resetarForm()
  } catch (err) {
    console.error('Falha ao carregar perfil:', err)
  }
}

const resetarForm = () => {
  if (!dadosUsuario.value) return
  formEdicao.nome = dadosUsuario.value.nome
  formEdicao.telefone = formatarTelefone(dadosUsuario.value.telefone)
  formEdicao.cpf = formatarCPF(dadosUsuario.value.cpf)
  formEdicao.nascimento = dadosUsuario.value.nascimento
}

const iniciarEdicao = () => { resetarForm(); editando.value = true }
const cancelarEdicao = () => { resetarForm(); editando.value = false }

const salvarPerfil = async () => {
  salvando.value = true
  try {
    const payload = {
      name: formEdicao.nome,
      telefone: formEdicao.telefone.replace(/\D/g, ''),
      cpf: formEdicao.cpf.replace(/\D/g, ''),
      nascimento: formEdicao.nascimento
    }

    const { data } = await api.patch('api/me/', payload)
    sincronizarEstadoLocal(data.data || data)
    editando.value = false
    alert('Perfil atualizado com sucesso!')
  } catch (err) {
    console.error('Erro ao salvar perfil:', err)
    alert('Não foi possível salvar as alterações.')
  } finally {
    salvando.value = false
  }
}

const abrirSeletorArquivo = () => fileInput.value?.click()

const aoSelecionarFoto = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('foto', file)

  try {
    const { data } = await api.patch('api/me/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    sincronizarEstadoLocal(data.data || data)
    alert('Foto atualizada com sucesso!')
  } catch (err) {
    console.error('Erro ao subir foto:', err)
    alert('Erro ao enviar foto.')
  }
}

onMounted(async () => {
  await carregarPerfil()

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('exibir')
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.animar').forEach((el) => observer.observe(el))
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

.perfil-layout { display: flex; min-height: 100vh; width: 100%; }
.foto-renderizada { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }

.pagina-perfil {
  flex: 1;
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  color: #1e293b;
  background-color: #D1E1DB;
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 24px 24px;
  padding: 40px 20px 100px;
}

.container-perfil { max-width: 1100px; margin: 0 auto; }
.animar { opacity: 0; transform: translateY(20px); transition: all 0.6s ease-out; }
.animar.exibir { opacity: 1; transform: translateY(0); }

h1 { font-size: 2.2rem; font-weight: 800; margin-bottom: 8px; }
.texto-gradiente {
  background: linear-gradient(90deg, #10b981, #3b82f6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.botao-principal {
  background: linear-gradient(135deg, #059669 0%, #2563eb 100%);
  color: white; border: none; padding: 12px 24px; border-radius: 12px;
  font-weight: 700; cursor: pointer; transition: opacity 0.2s;
}
.botao-principal:disabled { opacity: 0.6; cursor: not-allowed; }
.botao-secundario {
  background: #e2e8f0; color: #475569; border: none; padding: 12px 24px;
  border-radius: 12px; font-weight: 700; cursor: pointer;
}
.acoes-edicao { display: flex; gap: 12px; }

.header-perfil { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
.layout-grid { display: grid; grid-template-columns: 320px 1fr; gap: 30px; }
.cartao-perfil { background: white; border-radius: 24px; padding: 30px; border: 1px solid #f1f5f9; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03); }
.centro { text-align: center; }

.avatar-container { position: relative; width: 110px; margin: 0 auto 20px; }
.avatar-circulo {
  width: 110px; height: 110px; background: linear-gradient(135deg, #059669, #10b981);
  color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 2rem; font-weight: 800; overflow: hidden; cursor: pointer;
}

.btn-foto {
  position: absolute; bottom: 0; right: 0; background: white; border: 1px solid #e2e8f0;
  border-radius: 50%; width: 32px; height: 32px; cursor: pointer; display: flex;
  align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.titulo-secao { margin-bottom: 25px; font-weight: 800; }
.grade-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.campo label { display: block; font-size: 0.85rem; font-weight: 600; color: #64748b; margin-bottom: 8px; }
.campo input {
  width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px;
  background: #f8fafc; color: #1e293b; font-family: inherit; transition: all 0.2s;
}
.campo input:not(:disabled) { background: #ffffff; border-color: #10b981; }

.carregando { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 80vh; }
.spinner {
  width: 40px; height: 40px; border: 4px solid #cbd5e1; border-top-color: #10b981;
  border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 850px) {
  .perfil-layout { flex-direction: column; }
  .pagina-perfil { padding: 20px 16px 100px; }
  .layout-grid, .grade-inputs { grid-template-columns: 1fr; }
  .header-perfil { flex-direction: column; text-align: center; gap: 20px; }
}
</style>

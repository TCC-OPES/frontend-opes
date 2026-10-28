<template>
  <div class="dashboard-layout">
    <SideBarComponent />

    <div class="main-container">
      <main class="dashboard-content">
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
                  <div class="avatar-circulo" @click="expandirFoto">
                    <img v-if="dadosUsuario.fotoUrl" :src="dadosUsuario.fotoUrl" alt="Foto de Perfil" class="foto-renderizada" />
                    <span v-else>{{ obterIniciais(dadosUsuario.nome) }}</span>
                  </div>

                  <button v-if="editando" class="btn-foto" @click="abrirSeletorArquivo" title="Alterar Foto">📷</button>
                  
                  <input 
                    type="file" 
                    ref="fileInput" 
                    style="display: none" 
                    accept="image/png, image/jpeg, image/jpg, image/webp" 
                    @change="aoSelecionarFoto" 
                  />
                </div>

                <h2>{{ dadosUsuario.nome || 'Usuário' }}</h2>
                <p class="email-texto">{{ dadosUsuario.email }}</p>
              </div>
            </aside>

            <section class="coluna-principal animar">
              <div class="cartao-perfil">
                <h3 class="titulo-secao">👤 Informações Pessoais</h3>
                <div class="grade-inputs">
                  <!-- EDITÁVEL: Nome -->
                  <div class="campo">
                    <label>Nome Completo</label>
                    <input type="text" v-model="formEdicao.nome" :disabled="!editando" placeholder="Seu nome">
                  </div>

                  <!-- BLOQUEADO PERMANENTEMENTE: Email -->
                  <div class="campo">
                    <label>Email</label>
                    <input type="email" :value="formEdicao.email" disabled placeholder="seu@email.com">
                  </div>

                  <!-- EDITÁVEL: Telefone -->
                  <div class="campo">
                    <label>Telefone</label>
                    <input type="text" v-model="formEdicao.telefone" @input="aplicarMascaraTelefone" :disabled="!editando" placeholder="(00) 00000-0000">
                  </div>

                  <!-- BLOQUEADO PERMANENTEMENTE: CPF -->
                  <div class="campo">
                    <label>CPF</label>
                    <input type="text" :value="formEdicao.cpf" disabled placeholder="000.000.000-00">
                  </div>

                  <!-- EDITÁVEL: Data de Nascimento -->
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

    <!-- Modal para foto expandida -->
    <div v-if="modalFotoAberta" class="modal-overlay" @click="fecharFotoExpandida">
      <div class="modal-conteudo" @click.stop>
        <button class="btn-fechar" @click="fecharFotoExpandida">✕</button>
        <img v-if="dadosUsuario?.fotoUrl" :src="dadosUsuario.fotoUrl" alt="Foto Ampliada" class="foto-expandida" />
        <div v-else class="avatar-expandido">
          {{ obterIniciais(dadosUsuario?.nome) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import SideBarComponent from '@/components/SideBarComponent.vue'
import api from '@/services/api.js'

const dadosUsuario = ref(null)
const fileInput = ref(null)
const editando = ref(false)
const salvando = ref(false)
const modalFotoAberta = ref(false)
let observer = null

const formEdicao = reactive({
  nome: '',
  email: '',
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

const aplicarMascaraTelefone = (e) => { formEdicao.telefone = formatarTelefone(e.target.value) }

const expandirFoto = () => { modalFotoAberta.value = true }
const fecharFotoExpandida = () => { modalFotoAberta.value = false }

const sincronizarEstadoLocal = (novosDados) => {
  dadosUsuario.value = {
    ...dadosUsuario.value,
    nome: novosDados.name || novosDados.nome || dadosUsuario.value?.nome || '',
    email: novosDados.email || dadosUsuario.value?.email || '',
    telefone: novosDados.telefone || dadosUsuario.value?.telefone || '',
    cpf: novosDados.cpf || dadosUsuario.value?.cpf || '',
    nascimento: novosDados.nascimento || dadosUsuario.value?.nascimento || '',
    fotoUrl: novosDados.foto || novosDados.fotoUrl || dadosUsuario.value?.fotoUrl || ''
  }

  const local = localStorage.getItem('user')
  if (local) {
    try {
      const parsed = JSON.parse(local)
      if (parsed.data) parsed.data = { ...parsed.data, ...dadosUsuario.value }
      else Object.assign(parsed, dadosUsuario.value)
      localStorage.setItem('user', JSON.stringify(parsed))
    } catch (e) {
      console.error('Erro ao salvar no Storage', e)
    }
  }
}

const carregarPerfil = async () => {
  // 1. Pega do cache local primeiro para carregamento instantâneo
  const local = localStorage.getItem('user')
  if (local) {
    try {
      const parsed = JSON.parse(local)
      const dadosLocais = parsed.data || parsed
      dadosUsuario.value = {
        nome: dadosLocais.name || dadosLocais.nome || '',
        email: dadosLocais.email || '',
        telefone: dadosLocais.telefone || '',
        cpf: dadosLocais.cpf || '',
        nascimento: dadosLocais.nascimento || '',
        fotoUrl: dadosLocais.foto || dadosLocais.fotoUrl || ''
      }
      resetarForm()
    } catch (e) {
      console.error('Erro ao carregar dados locais:', e)
    }
  }

  // 2. Atualiza via servidor
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
  formEdicao.email = dadosUsuario.value.email
  formEdicao.telefone = formatarTelefone(dadosUsuario.value.telefone)
  formEdicao.cpf = formatarCPF(dadosUsuario.value.cpf)
  formEdicao.nascimento = dadosUsuario.value.nascimento
}

const iniciarEdicao = () => { resetarForm(); editando.value = true }
const cancelarEdicao = () => { resetarForm(); editando.value = false }

const salvarPerfil = async () => {
  salvando.value = true
  try {
    // Apenas Nome, Telefone e Nascimento vão para a requisição
    const payload = {
      name: formEdicao.nome,
      telefone: formEdicao.telefone.replace(/\D/g, ''),
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

const abrirSeletorArquivo = () => {
  if (!editando.value) return
  fileInput.value?.click()
}

const aoSelecionarFoto = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const formData = new FormData()
  formData.append('foto', file)

  try {
    const { data } = await api.patch('api/user/foto/', formData, {
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

.animar {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out;
}

.animar.exibir {
  opacity: 1;
  transform: translateY(0);
}

.dashboard-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: #ffffff;
  overflow: hidden;
  margin: 0;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.dashboard-layout :deep(.desktop-sidebar) {
  display: none !important;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
}

.dashboard-content {
  flex: 1;
  padding: 16px 16px 90px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  background-color: #f4f6f9;
}

.container-perfil {
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.foto-renderizada {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

h1 {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: #1e293b;
}

.texto-gradiente {
  background: linear-gradient(90deg, #10b981, #3b82f6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header-perfil {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-perfil p {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

.botao-principal {
  background: linear-gradient(135deg, #059669 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.botao-principal:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.botao-secundario {
  background: #e2e8f0;
  color: #475569;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.acoes-edicao {
  display: flex;
  gap: 12px;
}

.layout-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 30px;
}

.cartao-perfil {
  background: white;
  border-radius: 24px;
  padding: 30px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
}

.centro {
  text-align: center;
}

.avatar-container {
  position: relative;
  width: 110px;
  margin: 0 auto 20px;
}

.avatar-circulo {
  width: 110px;
  height: 110px;
  background: linear-gradient(135deg, #059669, #10b981);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.avatar-circulo:hover {
  transform: scale(1.03);
}

.btn-foto {
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.cartao-perfil h2 {
  font-size: 1.25rem;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.email-texto {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
  word-break: break-all;
}

.titulo-secao {
  margin-top: 0;
  margin-bottom: 25px;
  font-weight: 800;
  color: #1e293b;
  font-size: 1.1rem;
}

.grade-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.campo label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px;
}

.campo input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  color: #1e293b;
  font-family: inherit;
  box-sizing: border-box;
  transition: all 0.2s;
}

.campo input:not(:disabled) {
  background: #ffffff;
  border-color: #10b981;
}

/* Modal Foto Expandida */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-conteudo {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.foto-expandida {
  max-width: 80vw;
  max-height: 80vh;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  object-fit: contain;
}

.avatar-expandido {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: linear-gradient(135deg, #059669, #10b981);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  font-weight: 800;
}

.btn-fechar {
  position: absolute;
  top: -15px;
  right: -15px;
  background: #ffffff;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  color: #1e293b;
}

.carregando {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #cbd5e1;
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 850px) {
  .layout-grid,
  .grade-inputs {
    grid-template-columns: 1fr;
  }
  .header-perfil {
    flex-direction: column;
    text-align: center;
    align-items: stretch;
  }
  .acoes-edicao {
    justify-content: center;
  }
}

@media (min-width: 1024px) {
  .dashboard-layout {
    background-color: #f4f6f9;
  }
  .dashboard-layout :deep(.desktop-sidebar) {
    display: flex !important;
  }
  .main-container {
    height: 100vh;
    overflow: hidden;
    background-color: #f4f6f9;
  }
  .dashboard-content {
    padding: 32px 40px;
    overflow-y: auto;
    background-color: #f4f6f9;
  }
}
</style>
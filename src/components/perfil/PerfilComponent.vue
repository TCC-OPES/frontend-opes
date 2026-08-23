<template>
  <main class="pagina-perfil">
    <section v-if="dadosUsuario" class="container-perfil">

      <header class="header-perfil animar">
        <router-link to="/dashboard" class="btn-voltar">
          <i class="fas fa-arrow-left"></i> Voltar ao Dashboard
        </router-link>

        <div class="titulo-bloco">
          <h1>Meu Perfil</h1>
          <p class="subtitulo">Gerencie suas informações e preferências de conta.</p>
        </div>
      </header>

      <div class="layout-perfil-grade">
        <PerfilCapa :usuario="dadosUsuario" @abrirSeletor="abrirSeletorArquivo" @editar="abrirModalEdicao" />

        <input type="file" ref="fileInput" style="display: none" accept="image/*" @change="aoSelecionarFoto" />

        <PerfilDados :usuario="dadosUsuario" :cpf="cpfFormatado" :telefone="telefoneFormatado" />
      </div>

    </section>

    <section v-else class="carregando">
      <div class="spinner"></div>
      <p>A carregar os dados...</p>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api.js'

import PerfilCapa from './PerfilCapa.vue'
import PerfilDados from './PerfilDados.vue'

const dadosUsuario = ref(null)
const fileInput = ref(null)
const observador = ref(null) // Reativado o estado do observador

const cpfFormatado = computed(() => {
  if (!dadosUsuario.value?.cpf) return ''
  let v = dadosUsuario.value.cpf.replace(/\D/g, '').slice(0, 11)
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  return v
})

const telefoneFormatado = computed(() => {
  if (!dadosUsuario.value?.telefone) return ''
  let v = dadosUsuario.value.telefone.replace(/\D/g, '').slice(0, 11)
  v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
  v = v.replace(/(\d)(\d{4})$/, '$1-$2')
  return v
})

const carregarPerfil = async () => {
  try {
    const resposta = await api.get('api/me/')
    const dadosDoBack = resposta.data.data

    dadosUsuario.value = {
      nome: dadosDoBack.name,
      email: dadosDoBack.email,
      telefone: dadosDoBack.telefone,
      cpf: dadosDoBack.cpf,
      nascimento: dadosDoBack.nascimento,
      localizacao: dadosDoBack.localizacao,
      fotoUrl: dadosDoBack.foto,
      bio: dadosDoBack.bio || ''
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error)
  }
}

const abrirSeletorArquivo = () => {
  fileInput.value.click()
}

const aoSelecionarFoto = async (event) => {
  const arquivo = event.target.files[0]
  if (!arquivo) return

  const formData = new FormData()
  formData.append('foto', arquivo)

  try {
    const resposta = await api.patch('api/user/foto/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    if (dadosUsuario.value) {
      dadosUsuario.value.fotoUrl = resposta.data.foto
    }
  } catch (error) {
    console.error('Erro ao salvar foto:', error)
  }
}

const abrirModalEdicao = () => {
  // Lógica de edição
}

onMounted(async () => {
  await carregarPerfil()

  // Ativação do observador de animação após o carregamento dos dados da API
  observador.value = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('exibir');
      }
    });
  }, { threshold: 0.1 });

  const elementosParaAnimar = document.querySelectorAll('.animar');
  elementosParaAnimar.forEach((el) => observador.value.observe(el));
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');

.pagina-perfil {
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 24px 16px;
}

.container-perfil {
  max-width: 800px;
  margin: 0 auto;
}

.header-perfil {
  margin-bottom: 24px;
}

.titulo-bloco {
  margin-top: 16px;
}

h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
}

.subtitulo {
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 4px;
}

.btn-voltar {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 8px 14px;
  border-radius: 6px;
  background-color: white;
  border: 1px solid #e2e8f0;
  transition: background-color 0.15s ease;
}

.btn-voltar:hover {
  background-color: #f1f5f9;
}

.layout-perfil-grade {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Regras CSS Globais de Animação Reativadas */
:deep(.animar) {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out;
}

:deep(.animar.exibir) {
  opacity: 1;
  transform: translateY(0);
}

.carregando {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: #64748b;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: #0284c7;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (min-width: 768px) {
  .pagina-perfil { padding: 40px; }
}
</style>

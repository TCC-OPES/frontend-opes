<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api.js'
const dadosUsuario = ref(null)
const observador = ref(null)
const fileInput = ref(null)

// Busca os dados reais do seu backend usando a rota correta /api/me/
const carregarPerfil = async () => {
  try {
    const resposta = await api.get('me/')

    // Acessa a chave "data" onde o seu backend envelopa a resposta
    const dadosDoBack = resposta.data.data

    dadosUsuario.value = {
      nome: dadosDoBack.nome,
      email: dadosDoBack.email,
      telefone: dadosDoBack.telefone,
      cpf: dadosDoBack.cpf,
      nascimento: dadosDoBack.nascimento,
      localizacao: dadosDoBack.localizacao,
      fotoUrl: dadosDoBack.foto_url
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error)
    if (error.response?.status === 401) {
      alert('Sua sessão expirou. Faça login novamente.')
    } else {
      alert('Não foi possível carregar os dados do perfil.')
    }
  }
}

const abrirSeletorArquivo = () => {
  fileInput.value.click()
}

// Envia a foto usando a rota correta /api/perfil/foto/
const aoSelecionarFoto = async (event) => {
  const arquivo = event.target.files[0]
  if (!arquivo) return

  const formData = new FormData()
  formData.append('foto', arquivo)

  try {
    const resposta = await api.post('perfil/foto/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (dadosUsuario.value) {
      dadosUsuario.value.fotoUrl = resposta.data.foto_url
    }
    alert('Foto de perfil atualizada com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar foto:', error)
    alert('Erro ao salvar a foto.')
  }
}

onMounted(async () => {
  await carregarPerfil()

  observador.value = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('exibir');
      }
    });
  }, { threshold: 0.1 });

  const elementosParaAnimar = document.querySelectorAll('.animar');
  elementosParaAnimar.forEach((el) => observador.value.observe(el));
});
</script>
<template>
  <main class="pagina-perfil">
    <section v-if="dadosUsuario" class="container-perfil">
      <header class="header-perfil animar">
        <div>
          <h1>Meu <span class="texto-gradiente">Perfil</span></h1>
          <p>Gerencie suas informações e preferências de conta.</p>
        </div>
        <button class="botao-principal">✏️ Editar Perfil</button>
      </header>

      <div class="layout-grid">
        <aside class="coluna-lateral animar">
          <div class="cartao-perfil centro">
            <div class="avatar-container">

              <div class="avatar-circulo" @click="abrirSeletorArquivo">
                <img v-if="dadosUsuario.fotoUrl" :src="dadosUsuario.fotoUrl" alt="Foto de Perfil"
                  class="foto-renderizada" />

                <span v-else>
                  {{dadosUsuario.nome ? dadosUsuario.nome.split(' ').map(n => n[0]).join('').toUpperCase() : ''}}
                </span>
              </div>

              <button class="btn-foto" @click="abrirSeletorArquivo">📷</button>

              <input type="file" ref="fileInput" style="display: none" accept="image/*" @change="aoSelecionarFoto" />
            </div>

            <h2>{{ dadosUsuario.nome }}</h2>
            <p class="email-texto">{{ dadosUsuario.email }}</p>
            <span class="badge-status">● Conta Ativa</span>
          </div>
        </aside>

        <section class="coluna-principal animar">
          <div class="cartao-perfil">
            <h3 class="titulo-secao">👤 Informações Pessoais</h3>
            <div class="grade-inputs">
              <div class="campo">
                <label>Nome Completo</label>
                <input type="text" :value="dadosUsuario.nome" disabled>
              </div>
              <div class="campo">
                <label>Email</label>
                <input type="text" :value="dadosUsuario.email" disabled>
              </div>
              <div class="campo">
                <label>Telefone</label>
                <input type="text" :value="dadosUsuario.telefone" disabled>
              </div>
              <div class="campo">
                <label>CPF</label>
                <input type="text" :value="dadosUsuario.cpf" disabled>
              </div>
              <div class="campo">
                <label>Data de Nascimento</label>
                <input type="text" :value="dadosUsuario.nascimento" disabled>
              </div>
              <div class="campo">
                <label>Localização</label>
                <input type="text" :value="dadosUsuario.localizacao" disabled>
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
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

.foto-renderizada {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.pagina-perfil {
  font-family: 'Plus Jakarta Sans', sans-serif;
  min-height: 100vh;
  color: #1e293b;
  background-color: #D1E1DB;
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 24px 24px;
  padding: 40px 20px;
}

.container-perfil {
  max-width: 1100px;
  margin: 0 auto;
}

.animar {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out;
}

.animar.exibir {
  opacity: 1;
  transform: translateY(0);
}

h1 {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 8px;
}

.texto-gradiente {
  background: linear-gradient(90deg, #10b981, #3b82f6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.botao-principal {
  background: linear-gradient(135deg, #059669 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

.header-perfil {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
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
  transition: 0.2s ease;
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
}

.titulo-secao {
  margin-bottom: 25px;
  font-weight: 800;
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
}

.badge-status {
  display: inline-block;
  margin-top: 15px;
  background: #ecfdf5;
  color: #10b981;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
}

.carregando {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
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
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 850px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }

  .grade-inputs {
    grid-template-columns: 1fr;
  }

  .header-perfil {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
}
</style>

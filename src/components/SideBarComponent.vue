<template>
  <aside class="sidebar-container">
    <div class="desktop-sidebar">
      <div class="logo">
        <img src="/icons/logo.png" alt="Logo OPES" class="logo-img" />
      </div>

      <nav class="menu">
        <router-link to="/dashboard" class="menu-item">
          <i class="fas fa-chart-pie"></i>
          <span>Dashboard</span>
        </router-link>
        <router-link to="/transacoes" class="menu-item">
          <i class="fas fa-exchange-alt"></i>
          <span>Transações</span>
        </router-link>
        <router-link to="/carteiras" class="menu-item">
          <i class="fas fa-wallet"></i>
          <span>Carteiras</span>
        </router-link>
        <router-link to="/cartoes" class="menu-item">
          <i class="fas fa-credit-card"></i>
          <span>Cartões</span>
        </router-link>
        <router-link to="/metas" class="menu-item">
          <i class="fas fa-bullseye"></i>
          <span>Metas</span>
        </router-link>
        <a
          href="#"
          class="menu-item"
          :class="{ active: router.currentRoute.value.path === '/investimento' }"
          @click.prevent="irParaInvestimentos"
        >
          <i class="fas fa-chart-line"></i>
          <span>Investimentos</span>
        </a>
        <router-link to="/familia" class="menu-item">
          <i class="fas fa-users"></i>
          <span>Família</span>
        </router-link>
      </nav>

      <button @click="irParaPerfil" class="user-profile-btn" aria-label="Acessar perfil">
        <div class="avatar">
          <img v-if="usuario.fotoUrl" :src="usuario.fotoUrl" alt="Foto de perfil" class="foto-sidebar" />
          <span v-else>{{ obterIniciais(usuario.nome) }}</span>
        </div>
        <div class="user-info">
          <h4>{{ usuario.nome }}</h4>
          <p>Ver perfil</p>
        </div>
        <i class="fas fa-chevron-right arrow-icon"></i>
      </button>
    </div>

    <nav class="mobile-bottom-nav">
      <router-link to="/dashboard" class="mobile-nav-item">
        <i class="fas fa-chart-pie"></i>
        <span>Home</span>
      </router-link>
      <router-link to="/transacoes" class="mobile-nav-item">
        <i class="fas fa-exchange-alt"></i>
        <span>Extrato</span>
      </router-link>
      <a
        href="#"
        class="mobile-nav-item"
        :class="{ active: router.currentRoute.value.path === '/investimento' }"
        @click.prevent="irParaInvestimentos"
      >
        <i class="fas fa-chart-line"></i>
        <span>Investir</span>
      </a>
      <router-link to="/metas" class="mobile-nav-item">
        <i class="fas fa-bullseye"></i>
        <span>Metas</span>
      </router-link>
      <router-link to="/familia" class="mobile-nav-item">
        <i class="fas fa-users"></i>
        <span>Família</span>
      </router-link>
      <button @click="irParaPerfil" class="mobile-nav-item mobile-profile-btn">
        <div class="avatar avatar-mobile">
          <img v-if="usuario.fotoUrl" :src="usuario.fotoUrl" alt="Foto de perfil" class="foto-sidebar" />
          <span v-else>{{ obterIniciais(usuario.nome) }}</span>
        </div>
        <span>Perfil</span>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const usuario = ref({ nome: 'Usuário', fotoUrl: '' })

onMounted(() => {
  const userLocal = localStorage.getItem('user')

  if (userLocal) {
    try {
      const parsedUser = JSON.parse(userLocal)
      const dadosUsuario = parsedUser.data || parsedUser
      const nomeCompleto = dadosUsuario.name || dadosUsuario.nome || 'Usuário'
      const primeiroNome = nomeCompleto !== 'Usuário' ? nomeCompleto.trim().split(' ')[0] : 'Usuário'

      usuario.value = {
        nome: primeiroNome,
        fotoUrl: dadosUsuario.foto || dadosUsuario.fotoUrl || dadosUsuario.avatar || ''
      }
    } catch (e) {
      console.error('Erro ao ler usuário do localStorage', e)
    }
  }
})

const obterIniciais = (nome) => {
  if (!nome || nome === 'Usuário') return '?'
  return nome.charAt(0).toUpperCase()
}

const irParaPerfil = () => {
  router.push('/perfil')
}

const irParaInvestimentos = () => {
  router.push('/investimento')
}
</script>

<style scoped>
.sidebar-container {
  z-index: 1000;
}

.desktop-sidebar {
  display: none;
}

.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65px;
  background-color: #ffffff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 4px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
  z-index: 999;
}

.mobile-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: #64748b;
  text-decoration: none;
  font-size: 0.65rem;
  font-weight: 500;
  background: none;
  border: none;
  padding: 6px 0;
  width: 16.66%;
  cursor: pointer;
  transition: color 0.2s ease;
}

.mobile-nav-item i {
  font-size: 1.05rem;
}

.mobile-nav-item.router-link-active,
.mobile-nav-item.active {
  color: #0f766e;
  font-weight: 700;
}

.mobile-profile-btn {
  padding: 0;
}

.avatar-mobile {
  width: 24px;
  height: 24px;
  font-size: 0.7rem;
}

.avatar {
  background-color: #0f766e;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
  overflow: hidden;
}

.foto-sidebar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (min-width: 1024px) {
  .mobile-bottom-nav {
    display: none;
  }

  .desktop-sidebar {
    width: 260px;
    background-color: #ffffff;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-right: 1px solid #e2e8f0;
    height: 100vh;
    position: sticky;
    top: 0;
  }

  .logo {
    display: flex;
    align-items: center;
  }

  .logo-img {
    height: 55px;
    width: auto;
  }

  .menu {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 40px;
    flex-grow: 1;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    color: #64748b;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s;
  }

  .menu-item:hover {
    background-color: #f1f5f9;
    color: #1e293b;
  }

  .menu-item.router-link-active,
  .menu-item.active {
    background-color: #0f766e;
    color: white;
  }

  .user-profile-btn {
    display: flex;
    align-items: center;
    text-align: left;
    gap: 12px;
    padding: 12px;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    width: 100%;
    transition: all 0.2s ease;
  }

  .user-profile-btn:hover {
    background-color: #f1f5f9;
    border-color: #cbd5e1;
  }

  .user-info {
    flex-grow: 1;
  }

  .user-info h4 {
    font-size: 0.9rem;
    color: #1e293b;
    margin: 0;
  }

  .user-info p {
    font-size: 0.8rem;
    color: #94a3b8;
    margin: 2px 0 0 0;
  }

  .arrow-icon {
    color: #64748b;
  }
}
</style>

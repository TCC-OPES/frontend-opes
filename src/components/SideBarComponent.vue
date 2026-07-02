<template>
  <aside class="sidebar">
    <div class="logo">
      <span class="logo-icon">$</span> OPES
    </div>

    <nav class="menu">
      <a href="#" class="menu-item active">
        <i class="fas fa-chart-pie"></i> Dashboard
      </a>

      <a href="#" class="menu-item"><i class="fas fa-exchange-alt"></i> Transações</a>
      <a href="#" class="menu-item"><i class="fas fa-wallet"></i> Carteiras</a>
      <a href="#" class="menu-item"><i class="fas fa-credit-card"></i> Cartões</a>
      <a href="#" class="menu-item"><i class="fas fa-target"></i> Metas</a>
      <a href="#" class="menu-item"><i class="fas fa-chart-line"></i> Investimentos</a>
      <a href="#" class="menu-item"><i class="fas fa-users"></i> Família</a>
    </nav>

    <button @click="irParaPerfil" class="user-profile-btn" aria-label="Acessar perfil">
      <div class="avatar">
        {{ obterIniciais(usuario.nome) }}
      </div>
      <div class="user-info">
        <h4>{{ usuario.nome || 'Carregando...' }}</h4>
        <p>Ver perfil</p>
      </div>
      <i class="fas fa-chevron-right arrow-icon"></i>
    </button>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue';


const usuario = ref({
  nome: '',
  email: ''
});

const buscarDadosUsuario = async () => {
  try {
    
    const resposta = await fetch('https://api.seu-sistema.com/usuario/perfil', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Geralmente rotas de perfil exigem autenticação:
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!resposta.ok) throw new Error('Erro ao buscar dados do usuário');

    const dados = await resposta.json();
    usuario.value = dados; // Atualiza o estado com o nome/dados reais do cadastro
  } catch (error) {
    console.error('Erro na requisição:', error);
    // Fallback caso a API falhe (opcional)
    usuario.value = { nome: 'Usuário', email: '' };
  }
};

// Executa a busca assim que o componente é renderizado na tela
onMounted(() => {
  buscarDadosUsuario();
});

// Função para gerar as iniciais do avatar dinamicamente (ex: "João Silva" -> "JS")
const obterIniciais = (nome) => {
  if (!nome) return '?';
  const partes = nome.trim().split(' ');
  if (partes.length > 1) {
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  }
  return partes[0][0].toUpperCase();
};

// Ação do botão ao ser clicado
const irParaPerfil = () => {
  console.log('Navegando para o perfil do usuário...');
  // Se estiver usando o Vue Router, você faria algo como:
  // router.push('/perfil');
};
</script>

<style scoped>
.sidebar {
  width: 260px;
  background-color: #ffffff;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid #e2e8f0;
  height: 100vh;
}

.logo {
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e293b;
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

.menu-item.active {
  background-color: #0b5ed7;
  color: white;
}

/* Transformado de div para button com resets de estilo CSS nativos */
.user-profile-btn {
  display: flex;
  align-items: center;
  text-align: left;
  gap: 12px;
  padding: 12px;
  background-color: #f8fafc;
  border: 1px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  width: 100%;
  transition: all 0.2s ease;
}

.user-profile-btn:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
}

.user-profile-btn:focus {
  outline: 2px solid #0b5ed7;
  outline-offset: 2px;
}

.avatar {
  background-color: #004d40;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0; /* Impede o avatar de amassar se o texto for grande */
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
</style>

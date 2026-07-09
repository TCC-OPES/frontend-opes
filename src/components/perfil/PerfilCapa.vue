<template>
  <div class="cartao-topo animar">
    <div class="acoes-perfil">
      <button class="botao-editar" @click="$emit('editar')">
        <i class="fas fa-edit"></i> Editar Perfil
      </button>
    </div>

    <div class="perfil-principal">
      <div class="avatar-container">
        <div class="avatar-circulo" @click="$emit('abrirSeletor')">
          <img v-if="usuario.fotoUrl" :src="usuario.fotoUrl" alt="Foto de Perfil" class="foto-renderizada" />
          <span v-else class="avatar-texto">
            {{ usuario.nome ? usuario.nome.split(' ').map(n => n[0]).join('').toUpperCase() : 'U' }}
          </span>
        </div>
        <button class="btn-foto" @click="$emit('abrirSeletor')" aria-label="Mudar foto">
          <i class="fas fa-camera"></i>
        </button>
      </div>

      <h2>{{ usuario.nome || 'Nome do Usuário' }}</h2>
      <p class="email-texto">{{ usuario.email || 'usuario@email.com' }}</p>

      <div class="bio-container">
        <p v-if="usuario.bio" class="bio-texto">"{{ usuario.bio }}"</p>
        <p v-else class="bio-vazia">Nenhuma descrição adicionada ainda.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  usuario: {
    type: Object,
    required: true
  }
});

defineEmits(['abrirSeletor', 'editar']);
</script>

<style scoped>
.cartao-topo {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  position: relative;
}

.acoes-perfil {
  display: flex;
  justify-content: flex-end;
  margin-bottom: -10px;
}

.botao-editar {
  background: linear-gradient(135deg, #155e75 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity 0.2s;
}

.botao-editar:hover {
  opacity: 0.9;
}

.perfil-principal {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
}

.avatar-circulo {
  width: 100%;
  height: 100%;
  background: #004d40;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
  border: 4px solid #f8fafc;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.avatar-texto {
  font-size: 2.5rem;
  font-weight: 700;
}

.foto-renderizada {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-foto {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: #0b5ed7;
  border: 2px solid white;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.perfil-principal h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.email-texto {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 16px;
}

.bio-container {
  max-width: 500px;
  margin-top: 8px;
  padding: 12px 20px;
  background-color: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
}

.bio-texto {
  font-size: 0.95rem;
  color: #475569;
  font-style: italic;
  line-height: 1.5;
}

.bio-vazia {
  font-size: 0.9rem;
  color: #94a3b8;
}
</style>

<template>
  <div class="cartao-perfil-dados animar">
    <h3 class="titulo-secao">Informações Pessoais</h3>

    <div class="grade-inputs">
      <div class="campo">
        <label>Nome Completo</label>
        <div class="input-wrapper">
          <i class="fas fa-user input-icon"></i>
          <input type="text" :value="usuario.nome" disabled>
        </div>
      </div>

      <div class="campo">
        <label>Email</label>
        <div class="input-wrapper">
          <i class="fas fa-envelope input-icon"></i>
          <input type="text" :value="usuario.email" disabled>
        </div>
      </div>

      <div class="campo">
        <label>Telefone</label>
        <div class="input-wrapper">
          <i class="fas fa-phone input-icon"></i>
          <input type="text" :value="telefone" disabled>
        </div>
      </div>

      <div class="campo">
        <label>CPF</label>
        <div class="input-wrapper">
          <i class="fas fa-id-card input-icon"></i>
          <input
            :type="esconderCpf ? 'password' : 'text'"
            :value="cpf"
            disabled
            class="input-cpf"
          >
          <button
            type="button"
            class="btn-revelar"
            @click="alternarVisibilidadeCpf"
            :aria-label="esconderCpf ? 'Mostrar CPF' : 'Esconder CPF'"
          >
            <i :class="esconderCpf ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
          </button>
        </div>
      </div>

      <div class="campo">
        <label>Data de Nascimento</label>
        <div class="input-wrapper">
          <i class="fas fa-calendar-alt input-icon"></i>
          <input type="text" :value="usuario.nascimento" disabled>
        </div>
      </div>

      <div class="campo">
        <label>Localização</label>
        <div class="input-wrapper">
          <i class="fas fa-map-marker-alt input-icon"></i>
          <input type="text" :value="usuario.localizacao" disabled>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  usuario: { type: Object, required: true },
  cpf: { type: String, default: '' },
  telefone: { type: String, default: '' }
});

const esconderCpf = ref(true)

const alternarVisibilidadeCpf = () => {
  esconderCpf.value = !esconderCpf.value
}
</script>

<style scoped>
/* Importação da fonte bonita */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');

.cartao-perfil-dados {
  font-family: 'Plus Jakarta Sans', sans-serif; /* Aplicada ao container principal */
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.titulo-secao {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 20px;
}

.grade-inputs {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.campo label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: #94a3b8;
  font-size: 0.9rem;
}

.campo input {
  font-family: 'Plus Jakarta Sans', sans-serif; /* Força os inputs a usarem a fonte */
  width: 100%;
  padding: 10px 12px 10px 38px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background-color: #f8fafc;
  color: #334155;
  font-weight: 500;
  font-size: 0.9rem;
}

.input-cpf {
  padding-right: 42px !important;
}

.btn-revelar {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
}

.btn-revelar:hover {
  color: #1e293b;
}

@media (min-width: 768px) {
  .grade-inputs {
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
}
</style>

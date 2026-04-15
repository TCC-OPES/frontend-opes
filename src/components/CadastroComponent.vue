<script setup>
import { ref, computed } from 'vue';

const form = ref({
  cpf: '',
  nome: '',
  telefone: '',
  email: '',
  senha: ''
});

// CPF formatado
const cpfFormatado = computed({
  get() {
    return form.value.cpf;
  },
  set(valor) {
    let v = valor.replace(/\D/g, '');

    if (v.length > 11) v = v.slice(0, 11);

    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    form.value.cpf = v;
  }
});

// Mostrar senha
const mostrarSenha = ref(false);

// Submit
const submitForm = () => {
  console.log(form.value);
};
</script>

<template>
  <div class="page">

    <!-- FORM -->
    <div class="card">
      <h1>Criar Conta</h1>
      <p class="subtitulo">Preencha seus dados para começar</p>

      <form class="formulario" @submit.prevent="submitForm">
        <div class="all">

          <!-- CPF -->
          <div class="input-group">
            <label>CPF</label>
            <div class="input-wrapper">
              <span class="fa-solid fa-address-card"></span>
              <input v-model="cpfFormatado" inputmode="numeric" placeholder="000.000.000-00">
            </div>
          </div>

          <!-- Nome -->
          <div class="input-group">
            <label>Nome Completo</label>
            <div class="input-wrapper">
              <span class="fa-solid fa-user"></span>
              <input v-model="form.nome" type="text" autocomplete="name">
            </div>
          </div>

          <!-- Telefone -->
          <div class="input-group">
            <label>Telefone</label>
            <div class="input-wrapper">
              <span class="fa-regular fa-address-book"></span>
              <input v-model="form.telefone" type="tel" inputmode="numeric" placeholder="(00) 00000-0000">
            </div>
          </div>

          <!-- Email -->
          <div class="input-group">
            <label>Email</label>
            <div class="input-wrapper">
              <span class="fa-solid fa-envelope"></span>
              <input v-model="form.email" type="email" autocomplete="email">
            </div>
          </div>

          <!-- Senha -->
          <div class="input-group senha">
            <label>Senha</label>
            <div class="input-wrapper">
              <span
                class="fa-solid"
                :class="mostrarSenha ? 'fa-eye-slash' : 'fa-eye'"
                @click="mostrarSenha = !mostrarSenha"
                style="cursor: pointer;"
              ></span>

              <input
                v-model="form.senha"
                :type="mostrarSenha ? 'text' : 'password'"
                autocomplete="new-password"
              >
            </div>
          </div>

        </div>

        <button type="submit" class="enviar">
          Criar Conta
        </button>
      </form>

      <div class="divisor">
        <span>Já tem uma conta?</span>
      </div>

      <router-link to="/login" class="btn-login">
        Fazer Login
      </router-link>
    </div>

  </div>
</template>

<style scoped>
/* FUNDO */
:global(body) {
  background-color: #f3f4f6;
  margin: 0;
  font-family: Arial, sans-serif;
}

/* LAYOUT */
.page {
  display: flex;
  min-height: 100vh;
}

/* CARD */
.card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
  width: 100%;
  max-width: 500px;
  margin: auto;
  padding: 24px;
}

/* LADO DIREITO */
.lado-direito {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4a90d9, #2563eb);
}

.lado-direito img {
  width: 250px;
  max-width: 80%;
  opacity: 0.9;
}

/* TEXTOS */
h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #1f2937;
}

.subtitulo {
  color: #6b7280;
  margin-bottom: 24px;
}

/* FORM */
.formulario {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

/* GRID */
.all {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

/* INPUT GROUP */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

/* INPUT */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper span {
  position: absolute;
  left: 14px;
  color: #9ca3af;
}

input {
  width: 100%;
  padding: 12px 10px 12px 40px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  font-size: 16px;
}

.input-wrapper:focus-within span {
  color: #2563EB;
}

input:focus {
  outline: none;
  border-color: #2563EB;
  background-color: #fff;
}

/* SENHA ocupa 2 colunas */
.senha {
  grid-column: span 2;
}

/* BOTÕES */
.enviar {
  background-color: #006400;
  color: white;
  padding: 14px;
  border-radius: 10px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  max-width: 300px;
  margin: 10px auto 0;
}

.enviar:hover {
  background-color: #228B22;
}

.btn-login {
  display: block;
  text-decoration: none;
  border: 1px solid #a0a2a4;
  color: #1f2937;
  padding: 12px;
  border-radius: 12px;
  font-weight: bold;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.btn-login:hover {
  background-color: #f3f4f6;
}

.divisor {
  display: flex;
  align-items: center;
  margin: 30px 0;
  color: #9ca3af;
  font-size: 14px;
}

.divisor::before, .divisor::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.divisor span {
  padding: 0 10px;
}

/* 📱 MOBILE */
@media (max-width: 768px) {
  .page {
    flex-direction: column;
    padding: 16px;
  }


  .all {
    grid-template-columns: 1fr;
  }

  .senha {
    grid-column: span 1;
  }
}
</style>

<script setup>
import { ref, watch } from 'vue';


const form = ref({
  cpf: '',
  nome: '',
  telefone: '',
  email: '',
  senha: ''
});

watch(() => form.value.cpf, (novoValor) => {

  let v = novoValor.replace(/\D/g, '');


  if (v.length > 11) v = v.slice(0, 11);


  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');


  form.value.cpf = v;
});
</script>


<template>
  <div class="page">
  <div class="card">
    <h1>Criar Conta</h1>
    <p class="subtitulo">Preencha seus dados para começar</p>

    <form class="formulario">
      <div class="all">
        <div class="input-group">
          <label>CPF</label>
          <div class="input-wrapper">
            <span class="fa-solid fa-address-card"></span>
            <input v-model="form.cpf" type="text" placeholder="000.000.000-00" required>
          </div>
        </div>

        <div class="input-group">
          <label>Nome Completo</label>
          <div class="input-wrapper">
            <span class="fa-solid fa-user"></span>
            <input type="text" placeholder="Luiz Fernando Mannrich" required>
          </div>
        </div>

        <div class="input-group">
          <label>Telefone</label>
          <div class="input-wrapper">
            <span class="fa-regular fa-address-book"></span>
            <input type="text" placeholder="(00) 00000-0000" required>
          </div>
        </div>

        <div class="input-group">
          <label>Email</label>
          <div class="input-wrapper">
            <span class="fa-solid fa-envelope"></span>
            <input type="email" placeholder="seu@email.com" required>
          </div>
        </div>

        <div class="input-group">
          <label>Senha</label>
          <div class="input-wrapper">
            <span class="fa-solid fa-eye"></span>
            <input type="password" placeholder="Senha" required>
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

  <div class="lado-direito">
    <img src="/public/icons/icon-512x512.png" alt="" class="">
  </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;

}
.card {
  background-color: white;
  border-radius: 16px;
  padding: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
}

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

.formulario {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.all {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 16px;
  margin-bottom: 20px;
}

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


.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper span {
  position: absolute;
  left: 14px;
  color: #9ca3af;
  transition: color 0.3s;
}


input {
  width: 100%;
  padding: 12px 10px 12px 40px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  font-size: 14px;
  transition: all 0.3s;
}

.input-group:nth-child(5) {
  grid-column: span 2;
  justify-self: center;
  max-width: calc(50% - 8px);
}


.input-wrapper:focus-within span {
  color: #2563EB;
}

input:focus {
  outline: none;
  border-color: #2563EB;
  background-color: #fff;
}

.enviar {
  background-color: #006400;
  color: white;
  padding: 14px;
  border-radius: 10px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  width: 200px;
  margin: 0 auto 0 auto;
}

.enviar:hover {
  background-color: #228B22;
  transition: background 0.3s;
}

.divisor {
  display: flex;
  align-items: center;
  text-align: center;
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

.btn-login {
  display: block;
  text-decoration: none;
  border: 1px solid #a0a2a4;
  color: #1f2937;
  padding: 12px;
  border-radius: 12px;
  font-weight: bold;
  transition: background 0.3s;
  width: 200px;
  margin: 0 auto 0 auto;
}

.btn-login:hover {
  background-color: #f3f4f6;
}

@media (max-width: 600px) {
  .all {
    grid-template-columns: 1fr;
  }
}

</style>

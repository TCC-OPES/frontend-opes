<script setup>
import { ref } from 'vue';

</script>

<template>
<div class="Retornar">
<span class="fa-solid fa-arrow-left-long">Voltar para a tela de login</span>
</div>
<div class="conteiner">
  <h1>Criar Conta</h1>
  <p>Preencha seus dados para começar</p>


  <form class="formulario">
   <p>CPF</p><input type="text" placeholder="000.000.000-00" required>
    <p>Nome Completo</p><input type="text" placeholder="Luiz Fernando Mannrich" required>
    <p>Telefone</p><input type="text" placeholder="(00) 00000-0000" required>
    <p>Email</p> <input type="email" placeholder="Seu@email.com" required>
    <p>Senha</p> <input type="password" placeholder="Senha" required>
    <button  type="submit">Criar Conta</button>
  </form>


<div class="fazer-login">
<p>Já tem uma conta?</p>

<button>Fazer Login</button>
</div>
</div>
</template>

<style scoped>



.conteiner {
  background-color: rgb(239, 233, 233);
  border-radius: 10px;;
  padding: 2vw 11vw 2vw 11vw;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
}
p {
  font-size: 14px;
}
input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid;
}

.fazer-login {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.fazer-login button {
  background-color: transparent;
  border: none;
  color: blue;
  cursor: pointer;
}
</style>

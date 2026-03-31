<script setup>

</script>

<template>
<section>
<div class="welcome">
  <h1>Bem vindo de volta!</h1>
  <p class="financas">Acesse sua conta e gerencie suas finanças.</p>
</div>
<div>
  <form action=""></form>
  <p class="email">E-mail</p>
  <input type="text" placeholder="seu@email.com">
  <p class="senha">Senha</p>
  <input type="text" placeholder="•••••••">
</div>
<div class="lembrar">
  <input type="checkbox"> Lembrar-me
  <a href="">Esqueceu sua senha?</a>
</div>
<div class="entrar">
  <button>Acessar conta</button>
</div>
<div class="criar">
  <p>Não tem uma conta? <a href="">Criar conta</a> </p>
</div>



</section>
</template>

<style scoped>
p.financas {
  margin: 0 0 30px 0;

}
input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid;
  margin: 10px 0 10px 0;
}
.lembrar a {
  color: red;
}
</style>

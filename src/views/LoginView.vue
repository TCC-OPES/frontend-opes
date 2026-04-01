<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const cpf = ref('')
const senha = ref('')
const lembrar = ref(false)

const router = useRouter()

function login() {
  if (!cpf.value || !senha.value) {
    alert('Preencha todos os campos!')
    return
  }

  console.log({
    cpf:cpf.value,
    senha: senha.value,
    lembrar: lembrar.value
  })
  router.push('/dashboard')
}
</script>

<template>
  <section class="container">
    <div class="welcome">
      <h1>Bem vindo de volta!</h1>
      <p class="financas">Acesse sua conta e gerencie suas finanças.</p>
    </div>

    <form @submit.prevent="login">
      <div class="campo">
        <label>CPF</label>
        <div class="input-icon">
         <i class="fa-solid fa-address-card"></i>
          <input
            type="text"
            v-model="cpf"
            placeholder="000.000.000-00"
          >
        </div>
      </div>

      <div class="campo">
        <label>Senha</label>
        <div class="input-icon">
        <i class="fa-solid fa-lock"></i>
          <input
            type="password"
            v-model="senha"
            placeholder="•••••••"
          >
        </div>
      </div>

      <div class="lembrar">
        <label>
          <input type="checkbox" v-model="lembrar"> Lembrar-me
        </label>
        <a href="#">Esqueceu sua senha?</a>
      </div>

      <div class="entrar">
        <button type="submit">
          Acessar conta
        </button>
      </div>
    </form>

    <div class="criar">
      <p>Não tem uma conta? <a href="#">Criar conta</a></p>
    </div>
  </section>
</template>

<style scoped>
/* Reset básico */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Arial, sans-serif;
}

/* Container ocupando toda a tela e alinhando à esquerda */
section.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;   /* tudo à esquerda */
  padding: 50px 20px;
  box-sizing: border-box;
  background-color: #f0f4f8;
  margin: 7vw 19vw 10vw 2vw;
}

/* Limitar o formulário para não ocupar a tela inteira */
form, .welcome, .criar {
  width: 400px;  /* largura fixa do conteúdo */
}

/* Texto de boas-vindas */
.welcome h1 {
  margin: 0 0 10px 0;
}

.financas {
  margin-bottom: 30px;
}

/* Campos do formulário */
.campo {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.input-icon {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  gap: 10px;
  background-color: #fff;
}

.input-icon i {
  color: #999;
  font-size: 18px;
}

.input-icon input {
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  font-size: 16px;
  padding: 0;
}

/* Checkbox e link de senha */
.lembrar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 15px 0;
}

.lembrar a {
  color: #42b883;
  text-decoration: none;
}

/* Botão de entrar */
.entrar button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background-color: #42b883;
  color: white;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.entrar button:hover {
  opacity: 0.9;
}

/* Link para criar conta */
.criar {
  margin-top: 20px;
  text-align: left; /* alinhado à esquerda */
}
</style>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const senha = ref('')
const lembrar = ref(false)

const router = useRouter()

function login() {
  if (!email.value || !senha.value) {
    alert('Preencha todos os campos!')
    return
  }

  console.log({
    email: email.value,
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
        <label>E-mail</label>
        <div class="input-icon">
          <i class="fa-solid fa-user"></i>
          <input
            type="email"
            v-model="email"
            placeholder="seu@email.com"
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
.container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}

.financas {
  margin-bottom: 30px;
}

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
  background-color: #f9f9f9;
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

.lembrar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
}

.lembrar a {
  color: red;
  text-decoration: none;
}

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

.entrar button i {
  font-size: 16px;
}

.entrar button:hover {
  opacity: 0.9;
}

.criar {
  margin-top: 20px;
  text-align: center;
}
</style>

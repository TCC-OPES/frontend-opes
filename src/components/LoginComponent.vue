<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const form = ref({
  cpf: '',
  senha: ''
})

const lembrar = ref(false)

const erro = ref('')
const sucesso = ref('')
const carregando = ref(false)

const cpfFormatado = computed({
  get() {
    return form.value.cpf
  },
  set(valor) {
    let v = valor.replace(/\D/g, '')

    if (v.length > 11) v = v.slice(0, 11)

    v = v.replace(/(\d{3})(\d)/, '$1.$2')
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

    form.value.cpf = v
  }
})

async function login() {
  erro.value = ''
  sucesso.value = ''

  if (!form.value.cpf || !form.value.senha) {
    erro.value = 'Preencha todos os campos antes de continuar.'
    return
  }

  carregando.value = true

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/login/', {
      cpf: form.value.cpf.replace(/\D/g, ''),
      senha: form.value.senha
    })

    const token = response.data.token

    localStorage.setItem('token', token)

    sucesso.value = 'Login realizado com sucesso!'

    setTimeout(() => {
      router.push('/dashboard')
    }, 800)

  } catch (error) {
    console.log(error)

    const msg =
      error.response?.data?.erro ||
      error.response?.data?.detail ||
      'CPF ou senha inválidos'

    erro.value = msg

  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="page">
    <section class="container">

      <div class="welcome">
        <h1>Bem vindo de volta!</h1>
        <p class="financas">Acesse sua conta e gerencie suas finanças.</p>
      </div>

      <!-- MENSAGENS -->
      <div v-if="erro" class="msg erro">
        {{ erro }}
      </div>

      <div v-if="sucesso" class="msg sucesso">
        {{ sucesso }}
      </div>

      <form @submit.prevent="login">

        <div class="campo">
          <label>CPF</label>
          <div class="input-icon">
            <i class="fa-solid fa-address-card"></i>
            <input
              type="text"
              v-model="cpfFormatado"
              placeholder="000.000.000-00"
            >
          </div>
        </div>

        <div class="campo">
          <label>Senha</label>
          <div class="input-icon">
            <i class="fa-solid fa-eye"></i>
            <input
              type="password"
              v-model="form.senha"
              placeholder="•••••••"
            >
          </div>
        </div>

        <div class="lembrar">
          <label>
            <input type="checkbox" v-model="lembrar">
            Lembrar-me
          </label>

          <a href="#">Esqueceu sua senha?</a>
        </div>

        <div class="entrar">
          <button type="submit" :disabled="carregando">
            {{ carregando ? 'Entrando...' : 'Acessar conta' }}
          </button>
        </div>

      </form>

      <div class="criar">
        <p>Não tem uma conta? <a href="#">Criar conta</a></p>
      </div>

    </section>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', Arial, sans-serif;
}

.page {
  min-height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 60px;
}

body {
  height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: #eef5f3;
}

section.container {
  width: 100%;
  max-width: 700px;
  padding: 80px 60px;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
}

.welcome h1 {
  font-size: 40px;
  margin-bottom: 8px;
  color: #1f2937;
}

.financas {
  color: #6b7280;
  font-size: 18px;
  margin-bottom: 50px;
}

.campo {
  display: flex;
  flex-direction: column;
  margin-bottom: 28px;
}

.campo label {
  font-size: 18px;
  margin-bottom: 6px;
  color: #374151;
}

.input-icon {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 18px;
  gap: 10px;
  background-color: #f9fafb;
}

.input-icon i {
  color: #9ca3af;
}

.input-icon input {
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  font-size: 17px;
}

.lembrar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 25px 0 35px;
  font-size: 16px;
}

.lembrar a {
  color: #10b981;
  text-decoration: none;
}

.entrar button {
  width: 100%;
  padding: 20px;
  border: none;
  border-radius: 16px;
  background: #059669;
  color: white;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.entrar button:hover {
  background: #047857;
}

.entrar button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.criar {
  margin-top: 35px;
  text-align: center;
  font-size: 18px;
  color: #6b7280;
}

.criar a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

/* MENSAGENS */
.msg {
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-weight: 500;
  text-align: center;
}

.erro {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.sucesso {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}
</style>

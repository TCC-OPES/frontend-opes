<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import HeaderLogin from './HeaderLogin.vue'
import BaseInput from './BaseInput.vue'

const router = useRouter()
const carregando = ref(false)

const form = ref({
  cpf: '',
  senha: '',
  lembrar: false
})

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
  if (!form.value.cpf || !form.value.senha) {
    alert('Preencha todos os campos!')
    return
  }

  carregando.value = true

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/login/', {
      cpf: form.value.cpf.replace(/\D/g, ''),
      password: form.value.senha
    })

    console.log('Login realizado com sucesso:', response.data)

    router.push('/dashboard')

  } catch (error) {
    console.error('Erro no login:', error)
    if (error.response) {
      alert(error.response.data.error || 'CPF ou senha incorretos')
    } else {
      alert('Não foi possível conectar ao servidor')
    }
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="container-login">
    <HeaderLogin />

    <form @submit.prevent="login">
      <BaseInput
        label="CPF"
        icon="fa-solid fa-address-card"
        placeholder="000.000.000-00"
        v-model="cpfFormatado"
      />

      <BaseInput
        label="Senha"
        icon="fa-solid fa-eye"
        type="password"
        placeholder="•••••••"
        v-model="form.senha"
      />

      <div class="lembrar">
        <label>
          <input type="checkbox" v-model="form.lembrar" />
          Lembrar-me
        </label>

        <a href="#">Esqueceu sua senha?</a>
      </div>

      <button type="submit">Acessar conta</button>
    </form>

    <div class="criar">
      Não tem uma conta?
      <a href="/cadastro">Criar conta</a>
    </div>
  </div>
</template>

<style scoped>
.container-login {
  width: 100%;
  max-width: 450px;
  padding: 50px 40px;
  background: rgba(255,255,255,.85);
  backdrop-filter: blur(10px);
  border-radius: 28px;
}

.lembrar {
  display: flex;
  justify-content: space-between;
  margin: 25px 0;
}

button {
  width: 100%;
  padding: 18px;
  border: none;
  border-radius: 14px;
  background: #006400;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background: #228B22;
}


.criar {
  margin-top: 25px;
  text-align: center;
}

</style>

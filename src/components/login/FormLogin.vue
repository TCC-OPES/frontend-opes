<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import HeaderLogin from './HeaderLogin.vue'
import BaseInput from './BaseInput.vue'

const router = useRouter()

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

function login() {
  if (!form.value.cpf || !form.value.senha) {
    alert('Preencha todos os campos!')
    return
  }

  router.push('/dashboard')
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
      <a href="#">Criar conta</a>
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
  background: #059669;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.criar {
  margin-top: 25px;
  text-align: center;
}

</style>

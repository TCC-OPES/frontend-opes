<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth.js'

import FormCard from '@/components/cadastro/FormCard.vue'
import HeaderLogin from './HeaderLogin.vue'
import BaseInput from './BaseInput.vue'
import PasswordInput from '@/components/cadastro/PasswordInput.vue'

const router = useRouter()
const authStore = useAuthStore()
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
    const cpfLimpo = form.value.cpf.replace(/\D/g, '')
    await authStore.realizarLogin(cpfLimpo, form.value.senha)

    router.push('/dashboard')
  } catch (error) {
    console.error('Erro no login:', error)
    if (error.response && error.response.data) {
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
  <FormCard class="card-interno">
    <div class="scroll-content">
      <HeaderLogin />

      <form @submit.prevent="login" class="formulario">
        <div class="all">
          <BaseInput
            label="CPF"
            icon="fa-solid fa-address-card"
            placeholder="000.000.000-00"
            v-model="cpfFormatado"
            maxlength="14"
          />

          <PasswordInput
            label="Senha"
            v-model="form.senha"
          />
        </div>

        <div class="lembrar">
          <label>
            <input type="checkbox" v-model="form.lembrar" />
            Lembrar-me
          </label>

          <a href="#">Esqueceu sua senha?</a>
        </div>

        <button type="submit" :disabled="carregando" class="enviar">
          {{ carregando ? 'Carregando...' : 'Acessar conta' }}
        </button>
      </form>

      <div class="criar">
        Não tem uma conta?
        <router-link to="/cadastro">Criar conta</router-link>
      </div>
    </div>
  </FormCard>
</template>

<style scoped>
.card-interno {
  width: 100%;
  max-width: 450px;
  box-sizing: border-box;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 28px;
}

/* Scroll ATIVO por padrão para dispositivos móveis */
.scroll-content {
  overflow-y: auto;
  max-height: calc(90vh - 48px);
  padding-right: 4px;
  box-sizing: border-box;
}

.scroll-content::-webkit-scrollbar {
  width: 6px;
}
.scroll-content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.formulario {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.all {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.lembrar {
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  font-size: 14px;
  color: #4b5563;
}

.enviar {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 14px;
  background: #006400;
  color: white;
  font-weight: bold;
  cursor: pointer;
  display: block;
}

.enviar:disabled {
  background: #555;
  cursor: not-allowed;
}

.enviar:hover:not(:disabled) {
  background: #228B22;
}

.criar {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #4b5563;
}

.criar a {
  color: #006400;
  font-weight: bold;
  text-decoration: none;
}

/* DESKTOP: Remove o scroll completamente */
@media (min-width: 769px) {
  .card-interno {
    max-height: 95vh;
  }

  .scroll-content {
    max-height: calc(95vh - 48px);
    overflow-y: hidden;
  }
}
</style>

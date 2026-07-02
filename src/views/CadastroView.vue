<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router' // <-- Importa o roteador

import FormCard from '../components/cadastro/FormCard.vue'
import FormInput from '../components/cadastro/FormInput.vue'
import PasswordInput from '../components/cadastro/PasswordInput.vue'
import imagem from '@/img/icon.relogio.renovado.png'

const router = useRouter() // <-- Inicializa o roteador

const form = ref({
  cpf: '',
  nome: '',
  telefone: '',
  email: '',
  senha: '',
  confirmarSenha: ''
})

const carregando = ref(false)

const cpfFormatado = computed({
  get() {
    return form.value.cpf
  },
  set(valor) {
    let v = valor.replace(/\D/g, '').slice(0, 11)

    v = v.replace(/(\d{3})(\d)/, '$1.$2')
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

    form.value.cpf = v
  }
})

const telefoneFormatado = computed({
  get() {
    return form.value.telefone
  },
  set(valor) {
    let v = valor.replace(/\D/g, '').slice(0, 11)

    v = v.replace(/^(\d{2})(\d)/g, '($1) $2')
    v = v.replace(/(\d)(\d{4})$/, '$1-$2')

    form.value.telefone = v
  }
})

async function submitForm() {
  carregando.value = true

  try {
    const apiUrl = import.meta.env.VITE_API_URL
    await axios.post(`${apiUrl}api/cadastro/`, {
      cpf: form.value.cpf.replace(/\D/g, ''),
      name: form.value.nome,
      telefone: form.value.telefone.replace(/\D/g, ''),
      email: form.value.email,
      password: form.value.senha,
      password_confirm: form.value.confirmarSenha
    })

    alert('Conta criada com sucesso!')

    // Redireciona o usuário para a rota de login
    router.push('/login')

    form.value = {
      cpf: '',
      nome: '',
      telefone: '',
      email: '',
      senha: '',
      confirmarSenha: ''
    }

  } catch (error) {
    console.log(error)
    alert('Erro ao cadastrar')
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <div class="page">
    <div class="lado-imagem">
      <img :src="imagem" alt="Ilustração" />
    </div>

    <div class="container-form">
      <FormCard>
        <h1>Criar Conta</h1>

        <p class="subtitulo">
          Preencha seus dados para começar
        </p>

        <form class="formulario" @submit.prevent="submitForm">
          <div class="all">

            <FormInput
              label="CPF"
              v-model="cpfFormatado"
              icon="fa-solid fa-address-card"
              placeholder="000.000.000-00"
              maxlength="14"
            />

            <FormInput
              label="Nome Completo"
              v-model="form.nome"
              icon="fa-solid fa-user"
            />

            <FormInput
              label="Telefone"
              v-model="telefoneFormatado"
              icon="fa-regular fa-address-book"
              placeholder="(00) 00000-0000"
              maxlength="15"
            />

            <FormInput
              label="Email"
              v-model="form.email"
              type="email"
              icon="fa-solid fa-envelope"
            />

            <PasswordInput
              label="Senha"
              v-model="form.senha"
            />

            <PasswordInput
              label="Confirmar Senha"
              v-model="form.confirmarSenha"
            />

          </div>

          <button class="enviar" :disabled="carregando">
            {{ carregando ? 'Criando conta...' : 'Criar Conta' }}
          </button>
        </form>

        <div class="divisor">
          <span>Já tem uma conta?</span>
        </div>

        <router-link to="/login" class="btn-login">
          Fazer Login
        </router-link>
      </FormCard>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-height: 100vh;
  padding: 20px;

  background: linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%);
  font-family: Arial, sans-serif;
}

.lado-imagem {
  display: none;
}

.container-form {
  width: 100%;
  display: flex;
  justify-content: center;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.all {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

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
  text-align: center;
}

@media (min-width: 769px) {
  .page {
    display: grid;
    grid-template-columns: 1.3fr 0.9fr;
    padding: 0 60px;
    gap: 10px;
  }

  .lado-imagem {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 40px;
    overflow: hidden;
  }

  .lado-imagem img {
    width: 135%;
    max-width: 1300px;
    height: auto;
    transform: translate(-310px, -60px);
  }

  .all {
    grid-template-columns: repeat(2, 1fr);
  }
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

.divisor {
  display: flex;
  align-items: center;
  margin: 30px 0;
  color: #9ca3af;
  font-size: 14px;
}

.divisor::before,
.divisor::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.divisor span {
  padding: 0 10px;
}
</style>

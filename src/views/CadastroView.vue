<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

import FormCard from '../components/cadastro/FormCard.vue'
import FormInput from '../components/cadastro/FormInput.vue'
import PasswordInput from '../components/cadastro/PasswordInput.vue'
import imagem from '@/img/icon.relogio.renovado.png'

const form = ref({
  cpf: '',
  nome: '',
  telefone: '',
  email: '',
  senha: ''
})

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

async function submitForm() {
  carregando.value = true

  try {
    await axios.post('http://127.0.0.1:8000/api/cadastro/', {
      cpf: form.value.cpf.replace(/\D/g, ''),
      nome: form.value.nome,
      telefone: form.value.telefone,
      email: form.value.email,
      password: form.value.senha
    })

    alert('Conta criada com sucesso!')

    form.value = {
      cpf: '',
      nome: '',
      telefone: '',
      email: '',
      senha: ''
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

    <!-- LADO ESQUERDO -->
    <div class="lado-imagem">
      <img :src="imagem" alt="Ilustração">
    </div>

    <!-- LADO DIREITO -->
    <FormCard>
      <h1>Criar Conta</h1>
      <p class="subtitulo">Preencha seus dados para começar</p>

      <form class="formulario" @submit.prevent="submitForm">
        <div class="all">

          <FormInput
            label="CPF"
            v-model="cpfFormatado"
            icon="fa-solid fa-address-card"
            placeholder="000.000.000-00"
          />

          <FormInput
            label="Nome Completo"
            v-model="form.nome"
            icon="fa-solid fa-user"
          />

          <FormInput
            label="Telefone"
            v-model="form.telefone"
            icon="fa-regular fa-address-book"
            placeholder="(00) 00000-0000"
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

        </div>

        <button type="submit" class="enviar" :disabled="carregando">
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
</template>
<style scoped>
.page {
  display: flex;
  min-height: 100vh;
  background-color: #f3f4f6;
  margin: 0;
  font-family: Arial, sans-serif;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

.all {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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

.enviar:hover {
  background-color: #228B22;
}

.enviar:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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
}

.btn-login:hover {
  background-color: #f3f4f6;
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

.subtitulo {
  color: #6b7280;
  margin-bottom: 24px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #1f2937;
}

@media (max-width: 768px) {
  .page {
    padding: 16px;
  }

  .all {
    grid-template-columns: 1fr;
  }
}
.page {
  display: grid;
  grid-template-columns: 1.3fr 0.9fr;
  align-items: center;
  min-height: 100vh;
  padding: 0 60px;
  gap: 10px;
   background: linear-gradient(
    135deg,
    rgba(224, 242, 241, 1) 0%,
    rgba(178, 223, 219, 1) 100%
  );
}

.lado-imagem {
  display: flex;
  justify-content: flex-start; /* joga pra esquerda */
  align-items: center;         /* centraliza no meio */
  padding-left: 40px;
}

.lado-imagem img {
  width: 135%;
  max-width: 1300px;
  height: auto;
  transform: translate(-310px, -60px); /* move mais pra esquerda */
}

/* card */
.page > *:last-child {
  justify-self: start; /* puxa pra esquerda */
  width: 100%;
  max-width: 500px;
}
/* Responsivo */
@media (max-width: 768px) {
  .lado-imagem {
    display: none;
  }
}

</style>

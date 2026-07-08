<script setup>
import { ref } from 'vue'

const model = defineModel()

const props = defineProps({
  label: String,
  icon: String,
  type: {
    type: String,
    default: 'text'
  },
  placeholder: String
})

// Estado interno para controlar a visibilidade caso seja um campo de senha
const mostrarSenha = ref(false)
</script>

<template>
  <div class="input-group">
    <label v-if="label">{{ label }}</label>

    <div class="input-wrapper">
      <!-- Se for um campo de senha, o ícone vira o alternador (olho) -->
      <template v-if="props.type === 'password'">
        <i
          class="fa-solid eye-toggle"
          :class="mostrarSenha ? 'fa-eye' : 'fa-eye-slash'"
          @click="mostrarSenha = !mostrarSenha"
        ></i>
      </template>

      <!-- Se NÃO for senha, exibe o ícone normal passado por prop -->
      <template v-else>
        <i v-if="icon" :class="icon"></i>
      </template>

      <!-- O :type muda dinamicamente se for um campo de senha -->
      <input
        :type="props.type === 'password' ? (mostrarSenha ? 'text' : 'password') : props.type"
        :placeholder="placeholder"
        v-model="model"
        v-bind="$attrs"
      />
    </div>
  </div>
</template>

<style scoped>
.input-group {
  margin-bottom: 22px;
}

label {
  display: block;
  margin-bottom: 8px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 14px;
  padding: 16px;
  gap: 12px;
}

input {
  border: none;
  outline: none;
  flex: 1;
  background: transparent;
}

/* Estilo para quando o ícone for o olho clicável */
.eye-toggle {
  cursor: pointer;
  user-select: none;
  color: #9ca3af;
  width: 20px; /* Garante tamanho fixo para o ícone não tremer a tela ao mudar */
  text-align: center;
}
</style>

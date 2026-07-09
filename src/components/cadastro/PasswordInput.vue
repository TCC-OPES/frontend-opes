<script setup>
import { ref } from 'vue'

defineProps({
  label: String,
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

// Estado que controla se a senha está visível ou oculta
const mostrarSenha = ref(false)
</script>

<template>
  <div class="input-group senha full-width">
    <label>{{ label }}</label>

    <div class="input-wrapper">
      <span
        class="fa-solid eye-toggle"
        :class="mostrarSenha ? 'fa-eye' : 'fa-eye-slash'"
        @click="mostrarSenha = !mostrarSenha"
      ></span>

      <input
        :type="mostrarSenha ? 'text' : 'password'"
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        placeholder="••••••••"
      >
    </div>
  </div>
</template>

<style scoped>
.full-width {
  grid-column: 1 / -1;
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;

}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.eye-toggle {
  position: absolute;
  left: 14px;
  color: #9ca3af;
  cursor: pointer;
  z-index: 10;
  display: flex;
  align-items: center;
  height: 100%;

  /* Evita que o usuário selecione o ícone como texto ao clicar rápido */
  user-select: none;
}

input {
  width: 100%;
  padding: 14px 10px 14px 45px; /* Espaço na esquerda (45px) para não cobrir o ícone */
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  font-size: 16px;
  box-sizing: border-box;
  outline: none;
}

input:focus {
  border-color: #3b82f6;
}
</style>

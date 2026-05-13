<script setup>
import { ref } from 'vue'

defineProps({
  label: String,
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])
const mostrarSenha = ref(false)
</script>

<template>
  <div class="input-group senha full-width">
    <label>{{ label }}</label>

    <div class="input-wrapper">
      <span
        class="fa-solid eye-toggle"
        :class="mostrarSenha ? 'fa-eye-slash' : 'fa-eye'"
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
/* FAZ O CAMPO OCUPAR TODAS AS COLUNAS */
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
}

input {
  width: 100%;
  padding: 14px 10px 14px 45px;

  border-radius: 12px;
  border: 1px solid #e5e7eb;

  background-color: #f9fafb;
  font-size: 16px;

  box-sizing: border-box;
}
</style>

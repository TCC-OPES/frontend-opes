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
  <div class="input-group senha">
    <label>{{ label }}</label>

    <div class="input-wrapper">
      <span
        class="fa-solid"
        :class="mostrarSenha ? 'fa-eye-slash' : 'fa-eye'"
        @click="mostrarSenha = !mostrarSenha"
        style="cursor: pointer;"
      ></span>

      <input
        :type="mostrarSenha ? 'text' : 'password'"
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
      >
    </div>
  </div>
</template>
<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.senha {
  grid-column: span 2;
}

label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper span {
  position: absolute;
  left: 14px;
  color: #9ca3af;
}

input {
  width: 100%;
  padding: 12px 10px 12px 40px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  font-size: 16px;
}

.input-wrapper:focus-within span {
  color: #2563EB;
}

input:focus {
  outline: none;
  border-color: #2563EB;
  background-color: #fff;
}
</style>

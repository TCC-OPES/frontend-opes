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

const mostrarSenha = ref(false)
</script>

<template>
  <div class="input-group">
    <label v-if="label">{{ label }}</label>

    <div class="input-wrapper">
      <template v-if="props.type === 'password'">
        <i
          class="fa-solid eye-toggle"
          :class="mostrarSenha ? 'fa-eye' : 'fa-eye-slash'"
          @click="mostrarSenha = !mostrarSenha"
        ></i>
      </template>

      <template v-else>
        <i v-if="icon" :class="icon"></i>
      </template>

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
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #1f2937;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 14px;
  padding: 14px 16px;
  gap: 12px;
  background: #fff;
}

input {
  border: none;
  outline: none;
  flex: 1;
  background: transparent;
  font-size: 15px;
}

.eye-toggle {
  cursor: pointer;
  user-select: none;
  color: #9ca3af;
  width: 20px;
  text-align: center;
}
</style>

<script setup>
defineProps({
  label: String,
  modelValue: String,
  type: {
    type: String,
    default: 'text'
  },
  icon: String,
  placeholder: String,
  maxlength: [String, Number]
})

const emit = defineEmits(['update:modelValue'])


function blockNonNumbers(event) {
  const allowedKeys = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Tab',
    'Enter'
  ]


  if (allowedKeys.includes(event.key)) return


  if (!/[0-9]/.test(event.key)) {
    event.preventDefault()
  }
}

function handleInput(event) {
  let value = event.target.value.replace(/\D/g, '')

  emit('update:modelValue', value)
}
</script>

<template>
  <div class="input-group">
    <label>{{ label }}</label>

    <div class="input-wrapper">
      <span :class="icon"></span>

      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        :maxlength="maxlength"
        inputmode="numeric"
        @keydown="blockNonNumbers"
        @input="handleInput"
      />
    </div>
  </div>
</template>

<style scoped>
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
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
  padding: 14px 10px 14px 40px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background-color: #f9fafb;
  font-size: 16px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #2563eb;
  background-color: #fff;
}
</style>

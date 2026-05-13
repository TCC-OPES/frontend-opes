<script setup>
defineProps({
  label: String,
  icon: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text'
  },
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="campo">
    <label>{{ label }}</label>

    <div class="input-icon">
      <i :class="icon"></i>

      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
      />
    </div>
  </div>
</template>

<style scoped>
.campo {
  margin-bottom: 22px;
}

label {
  display: block;
  margin-bottom: 8px;
}

.input-icon {
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
}
</style>

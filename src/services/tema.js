import { ref } from 'vue'

export const tema = ref('light')

export function aplicarTema(valor) {
  tema.value = valor === 'dark' ? 'dark' : 'light'
  document.documentElement.dataset.theme = tema.value
  localStorage.setItem('opes-tema', tema.value)
}

export function inicializarTema() {
  const salvo = localStorage.getItem('opes-tema')
  const preferencia = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  aplicarTema(salvo || preferencia)
}

export function alternarTema() {
  aplicarTema(tema.value === 'dark' ? 'light' : 'dark')
}

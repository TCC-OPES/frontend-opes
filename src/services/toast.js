import { reactive } from 'vue'

export const toastState = reactive({ items: [], dialog: null })
let nextId = 0
export function toast(message, type = 'info', duration = 5000) {
  const id = ++nextId
  toastState.items.push({ id, message: String(message || ''), type })
  if (toastState.items.length > 5) toastState.items.shift()
  if (duration > 0) setTimeout(() => dismissToast(id), duration)
  return id
}
export function dismissToast(id) { toastState.items = toastState.items.filter(t => t.id !== id) }
export const notify = {
  success: message => toast(message, 'success'),
  error: message => toast(message, 'error', 7500),
  warning: message => toast(message, 'warning', 7000),
  info: message => toast(message, 'info'),
}
export function confirmAction(message) {
  return new Promise(resolve => {
    if (toastState.dialog) toastState.dialog.resolve(false)
    toastState.dialog = { message, resolve }
  })
}
export function resolveConfirmation(value) {
  const dialog = toastState.dialog
  if (!dialog) return
  toastState.dialog = null
  dialog.resolve(Boolean(value))
}

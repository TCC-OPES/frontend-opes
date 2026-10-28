<script setup>
import { toastState, dismissToast, resolveConfirmation } from '@/services/toast'
const icons = { success:'✓', error:'!', warning:'!', info:'i' }
</script>
<template>
  <div class="toast-stack" aria-live="polite" aria-relevant="additions">
    <div v-for="t in toastState.items" :key="t.id" :class="['toast-item',t.type]" :role="t.type==='error'?'alert':'status'">
      <span class="toast-icon" aria-hidden="true">{{ icons[t.type] }}</span>
      <p>{{ t.message }}</p>
      <button type="button" aria-label="Fechar notificação" @click="dismissToast(t.id)">×</button>
    </div>
  </div>
  <div v-if="toastState.dialog" class="dialog-shade" @click.self="resolveConfirmation(false)">
    <div role="dialog" aria-modal="true" aria-label="Confirmar ação" class="dialog-box" @keydown.esc="resolveConfirmation(false)">
      <h2>Confirmar ação</h2><p>{{ toastState.dialog.message }}</p>
      <div class="dialog-actions">
        <button type="button" class="cancel" @click="resolveConfirmation(false)">Cancelar</button>
        <button type="button" class="ok" @click="resolveConfirmation(true)">Confirmar</button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.toast-stack{position:fixed;z-index:9998;right:20px;top:20px;max-width:min(420px,calc(100vw - 30px));display:grid;gap:10px;pointer-events:none}.toast-item{display:flex;align-items:flex-start;gap:12px;pointer-events:auto;background:white;border:1px solid #e2e8f0;border-left:4px solid #0284c7;border-radius:12px;padding:14px 16px;box-shadow:0 15px 40px #0f172a23;color:#334155}.toast-item.success{border-left-color:#059669}.toast-item.error{border-left-color:#e11d48}.toast-item.warning{border-left-color:#d97706}.toast-item p{flex:1;margin:0;font-size:14px;line-height:1.45;overflow-wrap:anywhere}.toast-icon{width:20px;height:20px;display:grid;place-items:center;border-radius:50%;background:#e0f2fe;color:#075985;font-weight:900;flex-shrink:0}.success .toast-icon{background:#d1fae5;color:#047857}.error .toast-icon{background:#ffe4e6;color:#be123c}.warning .toast-icon{background:#fef3c7;color:#b45309}.toast-item button{border:0;background:transparent;cursor:pointer;font-size:22px;line-height:1;color:#64748b}.dialog-shade{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:16px;background:#0f172a99}.dialog-box{background:white;color:#172b45;border-radius:16px;padding:28px;width:min(420px,100%);box-shadow:0 25px 60px #0003}.dialog-box h2{margin:0 0 12px;font-size:21px}.dialog-box p{line-height:1.5}.dialog-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:24px}.dialog-actions button{padding:11px 16px;border-radius:9px;border:0;cursor:pointer}.cancel{background:#e2e8f0;color:#334155}.ok{background:#0f766e;color:white}@media(max-width:600px){.toast-stack{top:12px;right:12px;left:12px;max-width:none}.toast-item{padding:12px}.dialog-box{padding:20px}}
</style>
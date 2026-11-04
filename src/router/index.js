import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import PerfilView from '../views/PerfilView.vue'
import HomeView from '../views/HomeView.vue'
import CadastroView from '../views/CadastroView.vue'
import LoginView from '../views/LoginView.vue'
import InvestimentoView from '../views/InvestimentoView.vue'
import CartoesView from '../views/CartoesView.vue'
import MetasFinanceirasView from '@/views/MetasFinanceirasView.vue'
import TransacoesView from '@/views/TransacoesView.vue'

import RecorrenciasView from '@/views/RecorrenciasView.vue'

import CalendarioFinanceiroView from '@/views/CalendarioFinanceiroView.vue'
import FamiliaView from '@/views/FamiliaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/calendario', component: CalendarioFinanceiroView, name: 'Calendário' },
    { path: '/recorrencias', name: 'RecorrenciasView', component: RecorrenciasView },
    { path: '/familia', name: 'familia', component: FamiliaView },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/cadastro',
      name: 'cadastro',
      component: CadastroView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/investimento',
      name: 'investimento',
      component: InvestimentoView,
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: PerfilView,
    },
    {
      path: '/cartoes',
      name: 'cartoes',
      component: CartoesView,
    },
    {
      path: '/metas',
      name: 'metas',
      component: MetasFinanceirasView
    },
    {
      path: '/transacoes',
      name: 'transacoes',
      component: TransacoesView
    },
  ],
})

const rotasProtegidas = new Set([
  '/dashboard', '/investimento', '/perfil', '/cartoes',
  '/metas', '/transacoes', '/recorrencias', '/calendario', '/familia'
])
router.beforeEach((to) => {
  const semToken = !localStorage.getItem('access')
  const deveProteger = rotasProtegidas.has(to.path) && semToken && !import.meta.env.DEV

  if (deveProteger) {
    return { name: 'login' }
  }
})

export default router

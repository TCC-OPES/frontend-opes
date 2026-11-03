import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import PerfilView from '../views/PerfilView.vue'
import HomeView from '../views/HomeView.vue'
import CadastroView from '../views/CadastroView.vue'
import LoginView from '../views/LoginView.vue'
import CartoesView from '../views/CartoesView.vue'
import MetasFinanceirasView from '@/views/MetasFinanceirasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      meta: { requiresAuth: true },
      component: DashboardView,
    },
    {
      path: '/perfil',
      name: 'perfil',
      meta: { requiresAuth: true },
      component: PerfilView,
    },
    {
      path: '/cartoes',
      name: 'cartoes',
      meta: { requiresAuth: true },
      component: CartoesView,
    },
    {
      path: '/metas',
      name: 'metas',
      meta: { requiresAuth: true },
      component: MetasFinanceirasView
    }
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !localStorage.getItem('access')) {
    return { name: 'login' }
  }
})

export default router

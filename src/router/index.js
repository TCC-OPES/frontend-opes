import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import PerfilView from '../views/PerfilView.vue'
import HomeView from '../views/HomeView.vue'
import CadastroView from '../views/CadastroView.vue'
import LoginView from '../views/LoginView.vue'
import InvestimentoView from '../views/InvestimentoView.vue'

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
    component: DashboardView
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
  ],
})

export default router

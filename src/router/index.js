import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CadastroView from '../views/CadastroView.vue'
import LoginView from '../views/LoginView.vue'

// Importando o Layout Mestre que criamos
import MasterLayout from '@/components/global/MasterLayout.vue'

// Importando as páginas internas do miolo
import TransactionsPage from '@/components/transacoes/TransactionPage.vue
import PerfilView from '../views/PerfilView.vue' // Se o perfil também usa a Sidebar
import DashboardView from '@/views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. Rotas Públicas (NÃO usam a Sidebar)
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

    // 2. Rotas Privadas/Internas (Todas usam o MasterLayout com a Sidebar)
    {
      path: '/dashboard',
      component: MasterLayout, // O pai renderiza o layout com a Sidebar e Header
      children: [
        {
          path: '', // Quando acessar exatamente '/dashboard'
          name: 'dashboard',
          component: DashboardView, // Renderiza o miolo do Dashboard
        },
        {
          path: 'transactions', // Quando acessar '/dashboard/transactions'
          name: 'transactions',
          component: TransactionsPage, // Renderiza a página de transações
        },
        {
          path: 'perfil', // Quando acessar '/dashboard/perfil'
          name: 'perfil',
          component: PerfilView, // Renderiza o perfil no miolo se preferir
        },
      ],
    },
  ],
})

export default router

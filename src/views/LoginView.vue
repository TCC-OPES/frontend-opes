<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const form = ref({
  cpf: '',
  senha: '',
  lembrar: false
});

const cpfFormatado = computed({
  get() { return form.value.cpf; },
  set(valor) {
    let v = valor.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    form.value.cpf = v;
  }
});

const router = useRouter()

function login() {
  if (!form.value.cpf || !form.value.senha) {
    alert('Preencha todos os campos!')
    return
  }
  router.push('/dashboard')
}
</script>

<template>
  <div class="main-wrapper">

    <section class="login-side">
      <div class="container-login">
        <div class="welcome">
          <h1>Bem vindo de volta!</h1>
          <p class="financas">Acesse sua conta e gerencie suas finanças.</p>
        </div>

        <form @submit.prevent="login">
          <div class="campo">
            <label>CPF</label>
            <div class="input-icon">
              <i class="fa-solid fa-address-card"></i>
              <input type="text" v-model="cpfFormatado" placeholder="000.000.000-00">
            </div>
          </div>

          <div class="campo">
            <label>Senha</label>
            <div class="input-icon">
              <i class="fa-solid fa-eye"></i>
              <input type="password" v-model="form.senha" placeholder="•••••••">
            </div>
          </div>

          <div class="lembrar">
            <label><input type="checkbox" v-model="form.lembrar"> Lembrar-me</label>
            <a href="#">Esqueceu sua senha?</a>
          </div>

          <div class="entrar">
            <button type="submit">Acessar conta</button>
          </div>
        </form>

        <div class="criar">
          <p>Não tem uma conta? <a href="#">Criar conta</a></p>
        </div>
      </div>
    </section>

    <section class="side-illustration">
      <h1>O que você quer fazer hoje?</h1>
      <div class="features-grid">
        <div class="feature-item">
          <div class="icon">🌱</div>
          <h3>Cultivar minhas economias</h3>
          <p>Gerencie seus investimentos com clareza e segurança.</p>
        </div>
        <div class="feature-item">
          <div class="icon">🏠</div>
          <h3>Planejar objetivos</h3>
          <p>Sua casa ou carro novo começam com um bom plano.</p>
        </div>
        <div class="feature-item">
          <div class="icon">🔒</div>
          <h3>Proteger patrimônio</h3>
          <p>Segurança total para seus dados e sua reserva.</p>
        </div>
        <div class="feature-item">
          <div class="icon">📊</div>
          <h3>Organizar gastos</h3>
          <p>Controle cada centavo de forma simples e rápida.</p>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ESTRUTURA GLOBAL - O gradiente ocupa toda a tela aqui */
.main-wrapper {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(
    135deg,
    rgba(224, 242, 241, 1) 0%,
    rgba(178, 223, 219, 1) 100%
  );
  margin: 0;
  padding: 0;
}

/* LADO ESQUERDO (LOGIN) */
.login-side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.container-login {
  width: 100%;
  max-width: 450px;
  padding: 50px 40px;
  background: rgba(255, 255, 255, 0.85); /* Branco translúcido */
  backdrop-filter: blur(10px); /* Efeito de vidro */
  border-radius: 28px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
}

/* LADO DIREITO (ILUSTRAÇÃO) */
.side-illustration {
  flex: 1.2;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.side-illustration h1 {
  color: #263238;
  margin-bottom: 40px;
  font-size: 2.2rem;
  font-weight: 700;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 550px;
}

.feature-item {
  background: rgba(255, 255, 255, 0.45); /* Transparência para ver o gradiente ao fundo */
  backdrop-filter: blur(8px);
  padding: 30px 20px;
  border-radius: 24px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-5px);
}

.feature-item .icon { font-size: 2.5rem; margin-bottom: 12px; }
.feature-item h3 { font-size: 1.1rem; color: #00796b; margin-bottom: 8px; font-weight: 600; }
.feature-item p { font-size: 0.85rem; color: #455a64; line-height: 1.4; }

/* TEXTOS E INPUTS */
.welcome h1 { font-size: 32px; color: #1f2937; margin-bottom: 10px; }
.financas { color: #6b7280; font-size: 17px; margin-bottom: 45px; }

.campo { display: flex; flex-direction: column; margin-bottom: 22px; }
.campo label { font-size: 15px; margin-bottom: 8px; color: #374151; font-weight: 600; }

.input-icon {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 16px;
  gap: 12px;
  background-color: #ffffff;
}

.input-icon input { border: none; outline: none; background: transparent; flex: 1; font-size: 16px; }

.lembrar {
  display: flex;
  justify-content: space-between;
  margin: 25px 0;
  font-size: 14px;
}
.lembrar a { color: #10b981; text-decoration: none; font-weight: 700; }

.entrar button {
  width: 100%;
  padding: 18px;
  border: none;
  border-radius: 14px;
  background: #059669;
  color: white;
  font-size: 19px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.entrar button:hover { background: #047857; box-shadow: 0 10px 20px rgba(5, 150, 105, 0.2); }

.criar { margin-top: 30px; text-align: center; font-size: 16px; color: #6b7280; }
.criar a { color: #2563eb; text-decoration: none; font-weight: 700; }

/* Responsividade */
@media (max-width: 1024px) {
  .side-illustration { display: none; }
  .login-side { flex: 1; }
}
</style>

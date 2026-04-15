<template>
  <section class="side-illustration">
  <div class="content-left">

    <h1>O que você quer fazer hoje?</h1>

    <div class="features-grid">

      <div class="feature-card">
        <img src="/src/img/planta.jpeg" alt="Economias">
        <h3>Cultivar minhas economias</h3>
        <p>Gerencie seus investimentos com clareza e segurança.</p>
      </div>

      <div class="feature-card">
        <img src="/src/img/casa.jpeg" alt="Objetivos">
        <h3>Planejar objetivos</h3>
        <p>Sua casa ou carro novo começam com um bom plano.</p>
      </div>

      <div class="feature-card">
        <img src="/src/img/money.jpeg" alt="Proteção">
        <h3>Proteger patrimônio</h3>
        <p>Segurança total para seus dados e sua reserva.</p>
      </div>

      <div class="feature-card">
        <img src="/src/img/livro.jpeg" alt="Gastos">
        <h3>Organizar gastos</h3>
        <p>Controle cada centavo de forma simples e rápida.</p>
      </div>

    </div>

  </div>
</section>
</template>
<style scoped>
/* =========================
   CONTROLE DE TAMANHOS
   (altere aqui facilmente)
========================= */

.side-illustration {
  flex: 1;
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  /* espaço externo da área direita */
  padding: 0px 70px 40px 40px; /* ↑↓ direita esquerda */
}

.content-left {
  width: 100%;
  margin-top: -50px;
  /* largura máxima do bloco todo */
  max-width: 800px; /* aumente ou diminua */
}

.content-left h1 {
  font-size: 2.3rem; /* título principal */
  font-weight: 700;
  color: #263238;
  text-align: center;

  margin-bottom: 42px; /* espaço abaixo do título */
}

/* grade dos cards */
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);

  gap: 24px; /* espaço entre cards */
}

/* =========================
   CARD
========================= */

.feature-card {
  background: rgba(255, 255, 255, 0.42);
  backdrop-filter: blur(8px);

  border-radius: 28px; /* arredondamento */

  padding: 30px 25px; /* tamanho interno */
  min-height: 235px; /* altura do card */

  text-align: center;

  border: 1px solid rgba(255, 255, 255, 0.35);

  transition: all 0.25s ease;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.04);

  display: flex;
  flex-direction: column;
  justify-content: center;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 30px rgba(0, 0, 0, 0.08);
}

/* =========================
   IMAGEM
========================= */

.feature-card img {
  width: 100px;   /* largura imagem */
  height: 100px;  /* altura imagem */

  object-fit: cover;
  border-radius: 14px;

  margin: 0 auto 16px; /* espaço abaixo da imagem */
}

/* =========================
   TEXTOS
========================= */

.feature-card h3 {
  font-size: 1rem; /* título card */
  font-weight: 700;
  color: #0f172a;

  margin-bottom: 10px;
}

.feature-card p {
  font-size: 0.90rem; /* texto menor */
  line-height: 1.6;
  color: #334155;
}

/* =========================
   RESPONSIVO
========================= */

@media (max-width: 1024px) {
  .side-illustration {
    display: none;
  }
}

@media (max-width: 1280px) {
  .content-left {
    max-width: 720px;
  }

  .feature-card {
    min-height: 220px;
  }
}
</style>

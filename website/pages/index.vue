<template>
  <div class="page-index">
    <section class="home-section">
      <div class="intro">
        <div class="logo">
          <Logo size="124" />
        </div>
        <div class="slogan">
          Build static sites in Vue.js,
          <br />without the hassle.
        </div>
        <div class="actions">
          <a class="button" style="margin-right: 10px" href="./docs/index.md">Getting Started</a>
          <a
            class="button is-secondary"
            href="https://github.com/saberland/saber"
            target="_blank"
          >GitHub</a>
        </div>
      </div>
    </section>
    <section class="home-section features">
      <div class="feature">
        <div class="feature-title">Zero Setup</div>
        <div
          class="feature-content"
        >Automatic code splitting, file-system based routing, hot code reloading and built-in Markdown support.</div>
      </div>
      <div class="feature">
        <div class="feature-title">Bring Your Own Data</div>
        <div
          class="feature-content"
        >Build sites with the data you want: Pull data from headless CMS, SaaS services, APIs, your file-system, and more.</div>
      </div>
      <div class="feature">
        <div class="feature-title">Fully Extensible</div>
        <div
          class="feature-content"
        >With Saber's powerful APIs and plugin system, you can customize almost everything.</div>
      </div>
    </section>
    <section class="home-section footer">
      &copy; 2019 Developed by
      <a href="https://egoist.sh" target="_blank">EGOIST</a>.
      <div class="vercel-logo">
        <a href="https://vercel.com?utm_source=saber">
          <Vercel />
        </a>
      </div>
    </section>
  </div>
</template>


<script>
import Vue from 'vue'
import Logo from '@/src/components/Logo.vue'
import Vercel from '@/src/components/Vercel.vue'

export const attributes = {
  layout: 'index'
}

export default Vue.extend({
  components: {
    Logo,
    Vercel
  }
})
</script>

<style scoped>
.page-index {
  color: var(--text-dark-color);
}

.home-section {
  padding: 60px 0;

  &:not(:first-child) {
    border-top: 1px solid var(--border-color);
  }
}

.intro {
  max-width: 70%;
  text-align: center;
  margin: 20px auto;

  @media (max-width: 768px) {
    max-width: 100%;
  }
}

.logo {
  text-align: center;
  margin-bottom: 30px;
}

.slogan {
  font-size: 2.4rem;
  font-weight: 500;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.actions {
  margin-top: 60px;
}

.features {
  font-size: 1.3rem;
  margin-top: 60px;
  display: flex;

  @media (max-width: 992px) {
    flex-direction: column;
  }
}

.feature {
  margin-top: 20px;
}

.feature-title {
  font-weight: bold;
}

.feature-content {
  color: #666;
  padding-right: 10px;
  font-size: 1rem;
  margin-top: 20px;
}

.footer {
  font-size: 0.9rem;
  text-align: center;
  color: #666;
}

.vercel-logo {
  margin-top: 30px;
}
</style>

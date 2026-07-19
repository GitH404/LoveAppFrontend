<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const startedAt = new Date('2023-03-22T00:00:00')
const today = new Date()
const daysTogether = computed(() => Math.max(0, Math.floor((today - startedAt) / 86400000)))
const isMenuOpen = ref(false)
const notice = ref('')
const router = useRouter()

const menuItems = [
  { number: '01', title: '关于我们', desc: '写下重要的故事', path: '/about' },
  { number: '02', title: '时光相册', desc: '被好好收藏的瞬间' },
  { number: '03', title: '点点滴滴', desc: '写给日常的注脚' },
  { number: '04', title: '爱情清单', desc: '一起完成的小事' },
  { number: '05', title: '祝福语', desc: '来自朋友们的温柔' },
]

function scrollToStory() {
  document.querySelector('#story')?.scrollIntoView({ behavior: 'smooth' })
}

function showNotice(title) {
  notice.value = `“${title}”页面将在下一步完成`
  window.setTimeout(() => (notice.value = ''), 2400)
}

function selectMenuItem(item) {
  isMenuOpen.value = false
  if (item.path) {
    router.push(item.path)
    return
  }
  showNotice(item.title)
}
</script>

<template>
  <main>
    <section class="hero" aria-label="子休和梦蝶的主页封面">
      <img class="hero-image" src="/hero-cover.jpg" alt="湖边的两人" />
      <div class="hero-wash"></div>

      <header class="hero-header">
        <span class="eyebrow">自 2023 · 03 · 22 起</span>
        <button class="menu-button" type="button" aria-label="打开目录" @click="isMenuOpen = true">
          <span></span><span></span>
        </button>
      </header>

      <div class="hero-copy">
        <p class="hero-intro">两个人的普通日子</p>
        <h1>子休 <i>&</i> 梦蝶</h1>
        <p class="hero-quote">因为有人海，<br />相遇才变得意外！</p>
      </div>

      <div class="hero-bottom">
        <div class="day-count">
          <span>我们已经在一起</span>
          <strong>{{ daysTogether }}</strong>
          <em>天</em>
        </div>
        <button class="unfold" type="button" @click="scrollToStory">
          <span>翻开我们的故事</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v15M6 13l6 6 6-6" /></svg>
        </button>
      </div>
    </section>

    <section id="story" class="story-section">
      <div class="section-caption">第一章</div>
      <div class="section-heading">
        <p>我们的故事，从这里开始</p>
        <h2>不是偶然，<br /><i>是刚好遇见。</i></h2>
      </div>
      <RouterLink class="story-card" to="/about">
        <img src="/story-cover.jpg.png" alt="夜晚的合影" />
        <div class="story-card-copy">
          <span>关于我们</span>
          <p>从第一次相见，到每一个仍在发生的今天。</p>
          <b>阅读故事 <span>↗</span></b>
        </div>
      </RouterLink>
    </section>

    <section class="gallery-section">
      <div class="section-heading compact">
        <p>那些闪闪发光的片刻</p>
        <h2>时光 <i>相册</i></h2>
      </div>
      <div class="gallery-strip" aria-label="相册预览">
        <figure class="gallery-tile tilt-left"><img src="/moment-01.jpg" alt="日常合影" /></figure>
        <figure class="gallery-tile featured"><img src="/moment-02.jpg" alt="湖边的身影" /></figure>
        <figure class="gallery-tile tilt-right"><img src="/moment-03.jpg" alt="日落时刻" /></figure>
      </div>
      <button class="text-link" type="button" @click="showNotice('时光相册')">去看全部回忆 <span>→</span></button>
    </section>

    <section class="rooms-section">
      <div class="section-caption">日常收藏</div>
      <h2>把平凡的日子，<br />也认真收藏。</h2>
      <div class="room-grid">
        <button class="room-card diary" type="button" @click="showNotice('点点滴滴')">
          <span class="room-number">03</span>
          <span class="room-icon">✦</span>
          <b>点点滴滴</b>
          <small>城市、天气、心情与今天</small>
        </button>
        <button class="room-card list" type="button" @click="showNotice('爱情清单')">
          <span class="room-number">04</span>
          <span class="room-icon">✓</span>
          <b>爱情清单</b>
          <small>还想和你一起做的事</small>
        </button>
        <button class="room-card wishes" type="button" @click="showNotice('祝福语')">
          <span class="room-number">05</span>
          <span class="room-icon">♡</span>
          <b>祝福语</b>
          <small>留下你的温柔祝愿</small>
        </button>
      </div>
    </section>

    <footer>
      <p>把每一个重要瞬间都好好收藏</p>
      <strong>子休 <i>×</i> 梦蝶</strong>
      <span>2023 — ∞</span>
    </footer>

    <Transition name="fade">
      <p v-if="notice" class="notice" role="status">{{ notice }}</p>
    </Transition>

    <Transition name="sheet">
      <div v-if="isMenuOpen" class="menu-layer" @click.self="isMenuOpen = false">
        <nav class="directory" aria-label="网站目录">
          <button class="close-button" type="button" aria-label="关闭目录" @click="isMenuOpen = false">×</button>
          <p>我们的回忆目录</p>
          <button v-for="item in menuItems" :key="item.number" type="button" class="directory-item" @click="selectMenuItem(item)">
            <span>{{ item.number }}</span><b>{{ item.title }}</b><em>{{ item.desc }}</em><i>↗</i>
          </button>
        </nav>
      </div>
    </Transition>
  </main>
</template>

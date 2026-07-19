<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { aboutEvents } from '../data/aboutEvents'

const router = useRouter()
const activeId = ref(null)
const readingProgress = ref(0)

const activeIndex = computed(() => aboutEvents.findIndex((event) => event.id === activeId.value))

function updateReadingProgress() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
  readingProgress.value = scrollableHeight > 0
    ? Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100))
    : 0
}

function toggleEvent(id) {
  activeId.value = activeId.value === id ? null : id
}

async function switchEvent(direction) {
  const nextIndex = activeIndex.value === -1
    ? (direction > 0 ? 0 : aboutEvents.length - 1)
    : Math.min(Math.max(activeIndex.value + direction, 0), aboutEvents.length - 1)

  activeId.value = aboutEvents[nextIndex].id
  await nextTick()
  document.querySelector(`#about-event-${aboutEvents[nextIndex].id}`)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

function goHome() {
  router.push('/')
}

async function goToAlbum() {
  await router.push('/')
  await nextTick()
  document.querySelector('.gallery-section')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  updateReadingProgress()
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', updateReadingProgress))
</script>

<template>
  <main class="about-page">
    <div class="about-progress" aria-hidden="true">
      <span :style="{ width: `${readingProgress}%` }"></span>
    </div>

    <header class="about-header">
      <button type="button" class="about-back" @click="goHome">
        <span aria-hidden="true">←</span> 返回主页
      </button>
      <span>关于我们</span>
    </header>

    <section class="about-cover">
      <p class="about-kicker">子休与梦蝶的故事</p>
      <h1>被时光写下的，<br /><i>每一次靠近。</i></h1>
      <p class="about-lead">这里记录的不是每天发生的事，<br />而是那些改变了我们故事方向的瞬间。</p>
      <div class="about-start-line"><span></span><b>从相遇开始</b></div>
    </section>

    <section class="about-events" aria-label="重要故事">
      <div class="about-section-title">
        <span>重要的几件事</span>
        <em>点击章节，慢慢读</em>
      </div>

      <article
        v-for="(event, index) in aboutEvents"
        :id="`about-event-${event.id}`"
        :key="event.id"
        class="about-event"
        :class="{ 'is-open': activeId === event.id }"
      >
        <button
          type="button"
          class="about-event-summary"
          :aria-expanded="activeId === event.id"
          @click="toggleEvent(event.id)"
        >
          <span class="about-event-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="about-event-date">{{ event.date }}</span>
          <strong>{{ event.title }}</strong>
          <small>{{ event.summary }}</small>
          <i aria-hidden="true">{{ activeId === event.id ? '收起' : '阅读' }}</i>
        </button>

        <Transition name="chapter">
          <div v-if="activeId === event.id" class="about-event-body">
            <p v-for="paragraph in event.paragraphs" :key="paragraph">{{ paragraph }}</p>
            <div class="about-event-end">这一页，仍在继续</div>
          </div>
        </Transition>
      </article>
    </section>

    <nav class="about-chapter-nav" aria-label="章节切换">
      <button type="button" :disabled="activeIndex <= 0" @click="switchEvent(-1)">上一件事</button>
      <span>{{ activeIndex === -1 ? '选择一件事开始阅读' : `第 ${activeIndex + 1} 件事` }}</span>
      <button type="button" :disabled="activeIndex === aboutEvents.length - 1" @click="switchEvent(1)">下一件事</button>
    </nav>

    <section class="about-ending">
      <p>故事仍在继续</p>
      <h2>往后的每一次重要，<br />也会被我们好好写下。</h2>
      <span>最后更新：等待第一篇故事完成</span>
      <div class="about-ending-actions">
        <button type="button" @click="goHome">返回主页</button>
        <button type="button" class="about-album-link" @click="goToAlbum">去看时光相册 <span>→</span></button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.about-page { min-height: 100svh; position: relative; background: var(--paper); }
.about-progress { position: fixed; z-index: 10; top: 0; left: 0; right: 0; height: 3px; background: rgba(23,34,31,.08); }
.about-progress span { display: block; height: 100%; background: var(--wine); transition: width .12s linear; }
.about-header { position: sticky; z-index: 5; top: 0; display: flex; justify-content: space-between; align-items: center; padding: max(18px, env(safe-area-inset-top)) 24px 16px; background: rgba(242,238,228,.91); border-bottom: 1px solid rgba(23,34,31,.08); backdrop-filter: blur(12px); }
.about-header > span, .about-kicker, .about-start-line, .about-section-title, .about-event-number, .about-event-date, .about-event-end, .about-ending > span { font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .1em; }
.about-header > span { color: var(--moss); }.about-back { padding: 0; color: var(--ink); background: none; border: 0; cursor: pointer; font-size: 13px; }.about-back span { margin-right: 4px; font-size: 17px; }
.about-cover { padding: 86px 25px 66px; background: linear-gradient(135deg, #ede5d7 0%, var(--paper) 63%, #e6ddd1 100%); }.about-kicker { margin-bottom: 26px; color: var(--wine); }.about-cover h1 { margin-bottom: 25px; color: var(--ink); font-size: clamp(38px, 10vw, 58px); line-height: 1.28; letter-spacing: .025em; }.about-cover h1 i { color: var(--wine); }.about-lead { margin-bottom: 42px; color: #5e665f; font-size: 15px; line-height: 2; }.about-start-line { display: flex; align-items: center; gap: 11px; color: var(--moss); }.about-start-line span { width: 48px; height: 1px; background: var(--wine); }.about-start-line b { font-weight: 500; }
.about-events { padding: 62px 24px 34px; }.about-section-title { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px; color: var(--wine); }.about-section-title em { color: #777a71; font-family: inherit; font-size: 10px; font-style: normal; }
.about-event { scroll-margin-top: 78px; border-top: 1px solid var(--line); }.about-event:last-child { border-bottom: 1px solid var(--line); }.about-event-summary { width: 100%; display: grid; grid-template-columns: 37px 1fr auto; gap: 5px 10px; padding: 24px 0 21px; color: var(--ink); text-align: left; background: transparent; border: 0; cursor: pointer; }.about-event-number { grid-row: 1 / 4; padding-top: 3px; color: var(--wine); }.about-event-date { color: #70756c; }.about-event-summary strong { grid-column: 2; font-size: 23px; font-weight: 500; letter-spacing: .03em; }.about-event-summary small { grid-column: 2; max-width: 250px; color: #687068; font-size: 12px; line-height: 1.65; }.about-event-summary i { grid-column: 3; grid-row: 1 / 4; align-self: center; color: var(--wine); font-size: 11px; font-style: normal; }.about-event.is-open .about-event-summary { padding-bottom: 15px; }
.about-event-body { padding: 5px 0 31px 47px; color: #3c4740; }.about-event-body p { margin-bottom: 17px; font-size: 15px; line-height: 2; text-align: justify; }.about-event-end { padding-top: 12px; color: var(--wine); }.chapter-enter-active,.chapter-leave-active { overflow: hidden; transition: max-height .35s ease, opacity .25s ease; }.chapter-enter-from,.chapter-leave-to { max-height: 0; opacity: 0; }.chapter-enter-to,.chapter-leave-from { max-height: 460px; opacity: 1; }
.about-chapter-nav { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 8px; margin: 8px 24px 72px; padding: 16px 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }.about-chapter-nav button { padding: 6px 0; color: var(--moss); background: transparent; border: 0; cursor: pointer; font-size: 12px; }.about-chapter-nav button:first-child { text-align: left; }.about-chapter-nav button:last-child { text-align: right; }.about-chapter-nav button:disabled { color: #afb2aa; cursor: default; }.about-chapter-nav span { color: #73776f; font-size: 10px; text-align: center; }
.about-ending { padding: 64px 25px max(48px, env(safe-area-inset-bottom)); color: #f8f2e5; background: var(--ink); }.about-ending > p { margin-bottom: 16px; color: #d8b98d; font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: .13em; }.about-ending h2 { margin-bottom: 22px; font-size: 29px; font-weight: 500; line-height: 1.5; }.about-ending > span { color: rgba(255,255,255,.52); }.about-ending-actions { display: flex; gap: 15px; margin-top: 38px; }.about-ending-actions button { padding: 0; color: #f8f2e5; background: transparent; border: 0; cursor: pointer; font-size: 13px; }.about-album-link { color: #d8b98d !important; }.about-album-link span { margin-left: 5px; font-size: 17px; }
</style>

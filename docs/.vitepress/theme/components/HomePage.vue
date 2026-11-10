<script setup>
import { withBase } from 'vitepress'

// 站点 cleanUrls: false，站内页面需要显式带 .html；withBase 负责补部署 base
const pageUrl = (path) => withBase(`${path}.html`)
const heroImage = withBase('/doc-logo.png')

// 内容规模取自 docs/ 下实际文档数，内容增减时同步这里
const stats = [
  { value: '15', label: '前端基础笔记', hint: 'HTML&CSS · JS · Vue2 · TS' },
  { value: '16', label: 'React 学习笔记', hint: 'Redux · Router · 极客园' },
  { value: '16', label: '面试与项目复盘', hint: '八股 · 手写代码 · 项目' }
]

// 栏目与站点导航保持一致，path 对应 docs 下的真实 Markdown 文件
const sections = [
  {
    path: '/note/html&css',
    title: '前端基础',
    desc: '从 HTML&CSS、JavaScript、WebAPI 一路到 Vue2、TS、小程序与 Electron。',
    count: '15 篇',
    tags: ['HTML&CSS', 'JS 进阶', 'Vue2', 'TS', '小程序'],
    icon: '📘'
  },
  {
    path: '/interview/index1',
    title: '面试题库',
    desc: '高频前端面试题、手写代码，以及真实项目的技术复盘与讲述思路。',
    count: '16 篇',
    tags: ['ES6&HTTP', 'Vue', 'React', '手写代码', '项目复盘'],
    icon: '🎯'
  },
  {
    path: '/up/up1',
    title: 'React 学习笔记',
    desc: '从 React 基础、Redux、Router 到记账本与极客园两个完整项目。',
    count: '16 篇',
    tags: ['React', 'Redux', 'ReactRouter', '极客园'],
    icon: '⚛️'
  },
  {
    path: '/project/ggzx/index1',
    title: '项目实战',
    desc: '博欣试剂管理系统：创建项目、页面搭建、权限控制到数据大屏。',
    count: '6 篇',
    tags: ['工程化', '页面配置', '权限', '大屏'],
    icon: '🛠️'
  },
  {
    path: '/harmony/hm1',
    title: '鸿蒙开发',
    desc: 'Harmony 基础与进阶，配合云音乐项目的完整实现拆解。',
    count: '4 篇',
    tags: ['ArkTS', 'Harmony', '云音乐'],
    icon: '📱'
  },
  {
    path: '/ai/AI开发入门',
    title: 'AI 开发',
    desc: 'AI 开发入门笔记，正在持续整理中。',
    count: '编写中',
    tags: ['AI', '持续更新'],
    icon: '🤖'
  }
]

// 一条从入门到面试的渐进阅读路线，全部指向站内已有页面
const roadmap = [
  { step: '01', title: '打好基础', link: '/note/html&css', note: 'HTML&CSS / JS' },
  { step: '02', title: '深入语言', link: '/note/js-high', note: 'JS 进阶 / TS' },
  { step: '03', title: '掌握框架', link: '/note/vue3', note: 'Vue3 / React' },
  { step: '04', title: '动手实战', link: '/project/ggzx/index1', note: '完整项目' },
  { step: '05', title: '准备面试', link: '/interview/index1', note: '八股 / 复盘' }
]
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="hero-copy">
        <span class="hero-badge">PandaDoc · 前端知识库</span>
        <h1 class="hero-title">
          从第一行 HTML<br />
          <span class="hero-accent">到完整项目实战</span>
        </h1>
        <p class="hero-desc">
          这里整理了一条完整的前端成长路径：基础语法、框架进阶、工程化实战、鸿蒙开发，
          以及面试时真正用得上的知识点与项目复盘。
        </p>
        <div class="hero-actions">
          <a class="btn btn-primary" :href="pageUrl('/note/html&css')">开始阅读</a>
          <a class="btn btn-ghost" :href="pageUrl('/interview/index1')">浏览面试题</a>
          <a class="btn btn-text" href="https://github.com/ihong-he/panda-doc" target="_blank" rel="noopener noreferrer">GitHub →</a>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="hero-glow"></div>
        <img class="hero-logo" :src="heroImage" alt="" />
      </div>
    </section>

    <section class="stats" aria-label="内容规模">
      <div v-for="item in stats" :key="item.label" class="stat">
        <p class="stat-value">{{ item.value }}</p>
        <p class="stat-label">{{ item.label }}</p>
        <p class="stat-hint">{{ item.hint }}</p>
      </div>
    </section>

    <section class="block">
      <header class="block-head">
        <h2 class="block-title">按栏目浏览</h2>
        <p class="block-desc">六个内容方向，直接对应站点里的笔记与实战文档。</p>
      </header>
      <div class="cards">
        <a
          v-for="section in sections"
          :key="section.path"
          class="card"
          :href="pageUrl(section.path)"
        >
          <div class="card-top">
            <span class="card-icon" aria-hidden="true">{{ section.icon }}</span>
            <span class="card-count">{{ section.count }}</span>
          </div>
          <h3 class="card-title">{{ section.title }}</h3>
          <p class="card-desc">{{ section.desc }}</p>
          <div class="card-tags">
            <span v-for="tag in section.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <span class="card-link">进入栏目 <span aria-hidden="true">→</span></span>
        </a>
      </div>
    </section>

    <section class="block">
      <header class="block-head">
        <h2 class="block-title">一条推荐阅读路线</h2>
        <p class="block-desc">从基础到实战再到面试，按顺序读下来即可串起整套笔记。</p>
      </header>
      <ol class="roadmap">
        <li v-for="item in roadmap" :key="item.step" class="roadmap-item">
          <a class="roadmap-link" :href="pageUrl(item.link)">
            <span class="roadmap-step">{{ item.step }}</span>
            <span class="roadmap-body">
              <span class="roadmap-title">{{ item.title }}</span>
              <span class="roadmap-note">{{ item.note }}</span>
            </span>
            <span class="roadmap-arrow" aria-hidden="true">→</span>
          </a>
        </li>
      </ol>
    </section>

    <section class="tail">
      <p class="tail-text">还有一套站内文档组件，用来改善技术文档的阅读体验。</p>
      <a class="tail-link" :href="pageUrl('/guide/doc-components')">查看文档组件示例 →</a>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px;
}

.hero {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  align-items: center;
  gap: 32px;
  padding: 72px 0 56px;
}

.hero-badge {
  display: inline-block;
  padding: 5px 12px;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.hero-title {
  margin: 20px 0 16px;
  font-size: clamp(32px, 4.6vw, 52px);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.hero-accent {
  color: var(--vp-c-brand-1);
}

.hero-desc {
  max-width: 560px;
  margin: 0;
  font-size: 15px;
  line-height: 1.9;
  color: var(--vp-c-text-2);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  margin-top: 28px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.btn-primary:hover {
  background: var(--vp-c-brand-2);
}

.btn-ghost {
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.btn-ghost:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.btn-text {
  padding: 0 8px;
  color: var(--vp-c-text-2);
}

.btn-text:hover {
  color: var(--vp-c-brand-1);
}

.hero-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
}

/* 光晕用主题色 + 透明度实现，暗色模式下不会出现死白 */
.hero-glow {
  position: absolute;
  inset: 12% 4%;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  opacity: 0.16;
  filter: blur(56px);
}

.hero-logo {
  position: relative;
  width: min(76%, 280px);
  max-height: 280px;
  object-fit: contain;
  border-radius: 20px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 20px 0;
}

.stat {
  padding: 18px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.stat-value {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
  color: var(--vp-c-brand-1);
}

.stat-label {
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.stat-hint {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.block {
  padding: 40px 0 8px;
}

.block-head {
  margin-bottom: 20px;
}

.block-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.block-desc {
  margin: 6px 0 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-icon {
  font-size: 24px;
  line-height: 1;
}

.card-count {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.card-title {
  margin: 14px 0 8px;
  font-size: 17px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.card-desc {
  flex: 1;
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 14px 0;
}

.tag {
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-3);
  font-size: 11px;
}

.card-link {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.roadmap {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.roadmap-link {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
  transition: border-color 0.18s ease, transform 0.18s ease;
}

.roadmap-link:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-3px);
}

.roadmap-step {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--vp-c-brand-1);
}

.roadmap-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.roadmap-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.roadmap-note {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.roadmap-arrow {
  margin-top: auto;
  color: var(--vp-c-brand-1);
}

.tail {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 40px 0 56px;
  padding: 20px 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}

.tail-text {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.tail-link {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.tail-link:hover {
  text-decoration: underline;
}

@media (max-width: 960px) {
  .cards,
  .roadmap {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 48px 0 32px;
  }

  .hero-visual {
    min-height: 200px;
    order: -1;
  }

  .hero-logo {
    width: min(50%, 200px);
  }

  .stats {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .cards,
  .roadmap {
    grid-template-columns: 1fr;
  }
}
</style>

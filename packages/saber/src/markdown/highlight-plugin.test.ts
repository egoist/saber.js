import { test } from 'uvu'
import assert from 'uvu/assert'
import Markdown from 'saber-markdown'
const fenceOptionsPlugin = require('saber/src/markdown/highlight-plugin')
import { createMarkdownEnv } from './__helpers__/create-markdown-env'

test('main', () => {
  const md = new Markdown()
  const { env } = createMarkdownEnv()
  md.use(fenceOptionsPlugin)
  const html = md.render(
    `
\`\`\`vue
<div>hehe</div>
\`\`\`
  `,
    env
  )
  assert.snapshot(
    html,
    `<div class="saber-highlight" v-pre="" data-lang="vue"><pre class="saber-highlight-code language-vue"><code class="language-vue">&lt;div&gt;hehe&lt;/div&gt;</code></pre></div>`
  )
})

test('code block with {lineNumbers:true}', () => {
  const md = new Markdown()
  const { env } = createMarkdownEnv()
  md.use(fenceOptionsPlugin)
  const html = md.render(
    `
\`\`\`js {lineNumbers:true}
const cry = Array(3).fill('ora').join(' ')
\`\`\`
  `,
    env
  )
  assert.snapshot(
    html,
    `<div class="saber-highlight has-line-numbers" v-pre="" data-lang="js"><pre class="saber-highlight-code language-js"><code class="language-js"><span aria-hidden="true" class="saber-highlight-line-numbers" style="counter-reset: linenumber 0"><span></span></span>const cry = Array(3).fill('ora').join(' ')</code></pre></div>`
  )
})

test('code block with {lineNumbers:true,lineStart:5}', () => {
  const md = new Markdown()
  const { env } = createMarkdownEnv()
  md.use(fenceOptionsPlugin)
  const html = md.render(
    `
\`\`\`js {lineNumbers:true,lineStart:5}
const cry = Array(3).fill('ora').join(' ')
\`\`\`
  `,
    env
  )
  assert.snapshot(
    html,
    `<div class="saber-highlight has-line-numbers" v-pre="" data-lang="js"><pre class="saber-highlight-code language-js"><code class="language-js"><span aria-hidden="true" class="saber-highlight-line-numbers" style="counter-reset: linenumber 4"><span></span></span>const cry = Array(3).fill('ora').join(' ')</code></pre></div>`
  )
})

test('code block markdown.lineNumbers = true', () => {
  const md = new Markdown()
  const { env } = createMarkdownEnv()
  md.use(fenceOptionsPlugin, { lineNumbers: true })
  const html = md.render(
    `
\`\`\`js {lineNumbers:true}
const cry = Array(3).fill('ora').join(' ')
\`\`\`
  `,
    env
  )
  assert.snapshot(
    html,
    `<div class="saber-highlight has-line-numbers" v-pre="" data-lang="js"><pre class="saber-highlight-code language-js"><code class="language-js"><span aria-hidden="true" class="saber-highlight-line-numbers" style="counter-reset: linenumber 0"><span></span></span>const cry = Array(3).fill('ora').join(' ')</code></pre></div>`
  )
})

test.run()

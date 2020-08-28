import Markdown from 'saber-markdown'

const hasExcerptMark = (value: string) => /<!--\s*more\s*-->/.test(value.trim())

export default (md: Markdown, { paragraphOnly = true } = {}) => {
  md.renderer.rules.paragraph_close = (...args) => {
    const [tokens, idx, options, env, self] = args

    const { page, __excerpted } = env

    const autoExcerpt = !tokens.some(token => {
      return token.type === 'html_block' && hasExcerptMark(token.content)
    })

    if (
      autoExcerpt &&
      !__excerpted &&
      page.excerpt !== false &&
      typeof page.excerpt !== 'string'
    ) {
      env.__excerpted = true
      let startIndex = 0
      if (paragraphOnly) {
        for (const [index, token] of tokens.entries()) {
          if (token.type === 'paragraph_open') {
            startIndex = index
            break
          }
        }
      }

      page.excerpt = self.render(
        tokens.slice(startIndex, idx + 1),
        options,
        env
      )
    }

    return self.renderToken(tokens, idx, options)
  }

  const htmlRule = md.renderer.rules.html_block

  md.renderer.rules.html_block = (...args) => {
    const [tokens, idx, options, env, self] = args
    const token = tokens[idx]

    const { __excerpted, page } = env

    if (
      hasExcerptMark(token.content) &&
      !__excerpted &&
      page.excerpt !== false
    ) {
      page.excerpt = self.render(tokens.slice(0, idx), options, env)
      env.__excerpted = true
    }

    return htmlRule ? htmlRule(...args) : ''
  }
}

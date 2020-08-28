const shiki = require('shiki')

const ID = 'shiki'

exports.name = ID

const languageAlias = {
  vue: 'html',
  sh: 'bash',
  styl: 'stylus'
}

exports.apply = async (api, { theme } = {}) => {
  const h = await shiki.getHighlighter({
    theme: theme || 'nord'
  })

  api.hooks.chainMarkdown.tap(ID, config => {
    config.options.highlight((code, lang) => {
      if (!lang) {
        return `<code>${code}</code>`
      }

      lang = lang.toLowerCase()

      if (lang in languageAlias) {
        lang = languageAlias[lang]
      }

      return h.codeToHtml(code, lang)
    })
  })
}

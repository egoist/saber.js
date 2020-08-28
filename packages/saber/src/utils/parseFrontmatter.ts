import { log } from 'saber-log'

const RE_STARTING = /^(?:\r?\n)*---([a-z]+)?(?:\r?\n)+/

const parsers: {
  [k: string]: (str: string) => object
} = {
  yaml: str => require('js-yaml').safeLoad(str),
  yml: str => require('js-yaml').safeLoad(str),
  toml: str => require('toml').parse(str),
  js: str => {
    const fn = new Function(`return ${str.trim()}`)
    return fn()
  },
  json: str => JSON.parse(str)
}

/**
 * Extract front matter from a page
 */
export const parseFrontmatter = (content?: string, filepath?: string) => {
  const getEmpty = () => ({
    frontmatter: {},
    body: content && content.trim()
  })

  if (!content) {
    return getEmpty()
  }

  const starting = RE_STARTING.exec(content)
  if (!starting) {
    return getEmpty()
  }

  const parseType = starting[1] || 'yaml'
  const parse = parsers[parseType]
  if (!parse) {
    throw new Error(`Unsupported front matter type: ${parseType}`)
  }

  const rest = content.replace(RE_STARTING, '')
  const index = rest.indexOf('\n---')
  const head = rest.slice(0, index)
  const body = rest.slice(index + 4)
  let frontmatter
  try {
    frontmatter = parse(head)
  } catch (error) {
    if (filepath) {
      log.error(`Error parsing front matter in ${filepath}`)
    }

    throw error
  }

  return {
    frontmatter,
    body: body && body.trim()
  }
}

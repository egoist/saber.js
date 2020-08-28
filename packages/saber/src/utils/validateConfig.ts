import { struct } from 'superstruct'
import {
  SaberConfig,
  SaberConfigPlugin,
  MarkdownPlugin,
  NonUndefined
} from '../types'

export interface ValidatedSaberConfig {
  siteConfig: SaberConfig['siteConfig'] & {
    title: string
    description: string
  }

  plugins: Array<SaberConfigPlugin | string>

  markdown: SaberConfig['markdown'] & {
    plugins: MarkdownPlugin[]
  }

  themeConfig: NonUndefined<SaberConfig['themeConfig']>

  permalinks: NonUndefined<SaberConfig['permalinks']>

  server: Required<NonUndefined<SaberConfig['server']>>

  build: Required<NonUndefined<SaberConfig['build']>>

  locales: NonNullable<SaberConfig['locales']>

  theme: SaberConfig['theme']

  template: Required<NonUndefined<SaberConfig['template']>>
}

/**
 * Validate saber config
 */
export function validateConfig(
  config: SaberConfig,
  { dev }: { dev: boolean }
): ValidatedSaberConfig {
  const siteConfig = struct.interface(
    {
      title: 'string?',
      description: 'string?'
    },
    {}
  )

  // Type of Saber plugins
  const plugins = struct.union(
    [
      ['string'],
      [
        {
          resolve: 'string',
          options: 'object?'
        }
      ]
    ],
    []
  )

  const markdown = struct(
    {
      slugify: 'string?',
      options: 'object?',
      headings: 'object?',
      highlighter: 'string?',
      lineNumbers: 'boolean?',
      // Same as the type of Saber plugins
      plugins
    },
    {
      plugins: []
    }
  )

  const themeConfig = struct.interface({}, {})

  const permalinks = struct.union(['object', 'function'], {})

  const server = struct(
    {
      host: 'string?',
      port: 'number?'
    },
    {
      host: '0.0.0.0',
      port: 3000
    }
  )

  const build = struct(
    {
      publicUrl: 'string?',
      extractCSS: 'boolean?',
      loaderOptions: 'object?',
      cssSourceMap: 'boolean?',
      lazy: 'boolean?',
      outDir: 'string?',
      cache: 'boolean?'
    },
    {
      publicUrl: '/',
      extractCSS: false,
      loaderOptions: {},
      cssSourceMap: false,
      lazy: false,
      outDir: 'public',
      cache: true
    }
  )

  const locales = struct('object', {})

  const theme = struct('string?')

  const template = struct(
    {
      openLinkInNewTab: 'boolean',
      plugins: ['any']
    },
    {
      openLinkInNewTab: true,
      plugins: []
    }
  )

  const schema = struct({
    build,
    siteConfig,
    themeConfig,
    locales,
    theme,
    plugins,
    markdown,
    permalinks,
    server,
    template
  })

  const [err, result] = schema.validate(config)

  if (err) {
    throw new Error(`Invalid Saber config: ${err.message}`)
  }

  if (dev) {
    // Always use  / in dev mode
    result.build.publicUrl = '/'
  } else {
    // Ensure that build.publicUrl ends with slash
    result.build.publicUrl = result.build.publicUrl.replace(/\/?$/, '/')
  }

  return result
}

import { Saber } from '.'
import { CreatePageInput } from './Pages'

export type TODO = any

export type NonUndefined<A> = A extends undefined ? never : A

export interface SaberConstructorOptions {
  cwd?: string
  verbose?: boolean
  dev?: boolean
  inspectWebpack?: boolean
}

export interface SaberOptions {
  cwd: string
  verbose?: boolean
  dev?: boolean
  inspectWebpack?: boolean
}

export interface SiteConfig {
  /** Apply to <html> tag */
  lang: string
  [k: string]: any
}

export interface ThemeConfig {
  [k: string]: any
}

export interface SaberPlugin {
  name: string
  apply: (api: Saber, options: any) => void | Promise<void>
  filterPlugins?: (
    plugins: ResolvedSaberPlugin[],
    options?: any
  ) => ResolvedSaberPlugin[]
}

export interface SaberConfigPlugin {
  resolve: string
  options?: { [k: string]: any }
}

export interface ResolvedSaberPlugin extends SaberPlugin {
  location: string
  options?: any
}

export interface WebpackContext {
  type: 'client' | 'server'
  [k: string]: any
}

export type PageType = 'page' | 'post'

export interface Permalinks {
  /**
   * Permalink format for normal pages
   * @default `/:slug`
   */
  page?: string
  /**
   * Permalink format for posts
   * @default `/posts/:slug`
   */
  post?: string
}

export interface SaberConfig {
  /** The path or name of your theme */
  theme?: string
  siteConfig?: SiteConfig
  themeConfig?: object
  locales?: {
    [localePath: string]: {
      siteConfig?: SiteConfig
      themeConfig?: ThemeConfig
    }
  }
  /**
   * Customize permalink format based on page types (page or post)
   */
  permalinks?: Permalinks | ((page: CreatePageInput) => Permalinks)
  /** Build configurations */
  build?: {
    /**
     * The path to output generated files
     * Defaul to `./public`
     */
    outDir?: string
    /**
     * The root path where your website is localed
     * Default to `/`
     */
    publicUrl?: string
    /**
     * Extract CSS into standalone files
     * Default to `false`
     */
    extractCSS?: boolean
    /**
     * Toggle sourcemap for CSS
     * Default to `false`
     */
    cssSourceMap?: boolean
    /**
     * Options for CSS loaders
     */
    loaderOptions?: {
      /** sass-loader */
      sass?: any
      /** less-loader */
      less?: any
      /** stylus-loader */
      stylus?: any
      /** css-loader */
      css?: any
      /** postcss-loader */
      postcss?: any
    }
    /**
     * Toggle cache for webpack
     * Default to `true`
     */
    cache?: boolean
    /**
     * Compile pages on demand
     * @beta
     */
    lazy?: boolean
  }
  server?: {
    host?: string
    port?: number
  }
  plugins?: Array<string | SaberConfigPlugin>
  markdown?: {
    /** The path to a module that will be used to highlight code in markdown */
    highlighter?: string
    /** The path to a module or npm package name that slugifies the markdown headers. */
    slugify?: string
    /**
     * Options for the internal markdown-it plugin for generating markdown headings and heading anchors.
     */
    headings?: {
      /**
       * Inject markdown headings as `page.markdownHeadings`
       * @default `true`
       */
      markdownHeadings?: boolean
      /**
       * Generating permalinks
       * @default `false`
       */
      permalink?: boolean
      permalinkComponent?: string
      /**
       * Inject permalink before heading text.
       * @default `true`
       */
      permalinkBefore?: string
      /**
       * The permalink symbol.
       * @default `'#'`
       */
      permalinkSymbol?: string
    }
    /**
     * Show line numbers in code blocks
     * @default `false`
     */
    lineNumbers?: boolean
    /** markdown-it plugins */
    plugins?: MarkdownPlugin[]
    /** markdown-it options */
    options?: {
      [k: string]: any
    }
  }
  template?: {
    /**
     * Whether to open external links in new tab.
     * @default `true`
     */
    openLinkInNewTab?: boolean
    /**
     * A set of plugins that are used to transform Vue template.
     */
    plugins?: any[]
  }
}

export interface MarkdownPlugin {
  resolve: string
  options?: {
    [k: string]: any
  }
}

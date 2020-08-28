import { CreatePageInput, Page } from './Pages'
import { parseFrontmatter } from './utils/parseFrontmatter'

export interface Transformer {
  extensions: string[]
  transform?: (page: CreatePageInput) => void
  getPageComponent: (page: Page) => string
}

export class Transformers {
  transformers: Map<string, Transformer>

  constructor() {
    this.transformers = new Map()
  }

  get parseFrontmatter() {
    return parseFrontmatter
  }

  add(contentType: string, transformer: Transformer) {
    this.transformers.set(contentType, transformer)
  }

  get(contentType: string) {
    return this.transformers.get(contentType)
  }

  get supportedExtensions() {
    let extensions: string[] = []
    for (const transformer of this.transformers.values()) {
      extensions = [...extensions, ...(transformer.extensions || [])]
    }

    return extensions
  }

  getContentTypeByExtension(extension: string) {
    for (const [contentType, transformer] of this.transformers.entries()) {
      if (
        transformer.extensions &&
        transformer.extensions.includes(extension)
      ) {
        return contentType
      }
    }
  }
}

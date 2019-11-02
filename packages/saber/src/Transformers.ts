import { ICreatePageInput, IPage } from './Pages'

export interface ITransformer {
  extensions: string[]
  transform?: (page: ICreatePageInput) => void
  getPageComponent: (page: IPage) => string
}

export class Transformers {
  transformers: Map<string, ITransformer>

  constructor() {
    this.transformers = new Map()
  }

  get parseFrontmatter() {
    return require('./utils/parseFrontmatter')
  }

  add(contentType: string, transformer: ITransformer) {
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

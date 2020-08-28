import { Collection } from 'lokijs'
import { Saber } from '.'

export type DataFactory = (options: any, context: Saber) => any

export class DataStore {
  store: Map<string, { factory: DataFactory }> = new Map()

  addData(name: string, factory: DataFactory) {
    this.store.set(name, {
      factory
    })
  }

  removeData(name: string) {
    this.store.delete(name)
  }

  hasData(name: string) {
    return this.store.has(name)
  }

  getData(name: string) {
    return this.store.get(name)
  }

  createCollection<T extends object = object>(
    options: Partial<CollectionOptions<T>>
  ) {
    const collection = new Collection('', {
      disableMeta: true,
      ...options
    })

    return collection
  }

  /**
   * Find data from collection with optional sorting support
   */
  findAndSort<T extends object = object>(
    collection: Collection<T>,
    options: LokiQuery<T> & {
      $sort?: { [k: string]: boolean | string }
    }
  ) {
    const sort = options.$sort
    delete options.$sort

    let chain = collection.chain().find(options)

    if (sort && typeof sort === 'object') {
      chain = chain.compoundsort(
        Object.keys(sort).map(key => {
          let value = sort[key]
          if (typeof value === 'string') {
            value = value.toLowerCase()
          }
          return [
            key,
            value === 'desc' ? true : value === 'asc' ? false : value
          ] as [keyof T, boolean]
        })
      )
    }

    return chain.data()
  }
}

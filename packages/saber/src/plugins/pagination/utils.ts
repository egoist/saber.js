import urlJoin from 'url-join'

export function getPaginationLink(pageIndex: number, permalink: string) {
  if (pageIndex === 1) {
    return permalink
  }

  if (pageIndex === 0) {
    return
  }

  return urlJoin(permalink, `page/${pageIndex}`)
}

type PaginationOptions = {
  size?: number
  first?: number
}

export function paginateArray<T = any>(
  arr: T[],
  options: PaginationOptions
): T[][] {
  const { size = 30, first } = options

  if (first) {
    return [arr.slice(0, first)]
  }

  const totalPages = Math.ceil(arr.length / size)
  const result = []
  for (let i = 0; i < totalPages; i++) {
    result[i] = arr.slice(i * size, (i + 1) * size)
  }

  return result
}

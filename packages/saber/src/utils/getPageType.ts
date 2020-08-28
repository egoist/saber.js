export default (relative: string) => {
  if (relative.startsWith('_posts/')) {
    return 'post'
  }

  return 'page'
}

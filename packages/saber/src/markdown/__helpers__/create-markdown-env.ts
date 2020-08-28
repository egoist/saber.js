export function createMarkdownEnv(_page?: any) {
  const page = { ..._page, internal: { ...(_page && _page.internal) } }
  return {
    page,
    env: {
      page
    }
  }
}

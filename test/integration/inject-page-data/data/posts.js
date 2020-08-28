module.exports = ({ draft }) => {
  return [
    {
      title: 'a'
    },
    {
      title: 'c',
      draft: true
    },
    {
      title: 'e'
    },
    {
      title: 'dd'
    }
  ].filter(post => {
    // Exclude draft posts
    if (draft === false && post.draft) {
      return false
    }
    return true
  })
}

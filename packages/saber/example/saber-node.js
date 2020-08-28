exports.postCreatePage = function(page) {
  if (page.permalink === '/') {
    page.foo = 'ass'
  }
}

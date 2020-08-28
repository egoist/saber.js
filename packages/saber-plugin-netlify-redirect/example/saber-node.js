exports.postCreatePages = function() {
  this.pages.createRedirect({
    fromPath: '/redirect-to-about',
    toPath: '/about.html',
    redirectInBrowser: true
  })
}

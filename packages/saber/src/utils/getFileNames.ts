export default (useHash: boolean) => {
  return {
    js: useHash ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
    css: useHash ? 'css/[name].[chunkhash:8].css' : 'css/[name].css',
    font: useHash ? 'fonts/[name].[hash:8].[ext]' : 'fonts/[path][name].[ext]',
    image: useHash
      ? 'images/[name].[hash:8].[ext]'
      : 'images/[path][name].[ext]'
  }
}

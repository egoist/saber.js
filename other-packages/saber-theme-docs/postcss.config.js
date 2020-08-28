module.exports = {
  plugins: [
    require('tailwindcss')(__dirname + '/tailwind.config.js'),
    require('autoprefixer')()
  ]
}

module.exports = {
  purge: [`${__dirname}/src/**/*.vue`],
  theme: {
    extend: {
      colors: {
        theme: `var(--theme-color)`
      }
    }
  },
  variants: {
    display: ['responsive', 'group-hover'],
    backgroundColor: ['responsive', 'hover', 'focus', 'focus-within']
  },
  plugins: [require('@tailwindcss/ui')()]
}

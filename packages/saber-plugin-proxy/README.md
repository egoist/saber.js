# saber-plugin-proxy

Add a [WebPack devServer](https://webpack.js.org/configuration/dev-server/) like proxy to your `saber-config.js`

## Install

```bash
yarn add saber-plugin-proxy
```

## Usage

In your `saber-config.js`:

```js
module.exports = {
    plugins: [
        {
            resolve: 'saber-plugin-proxy',
            options: {
                routes: {
                    '/api': {target: 'http://localhost:5000'}
                }
            }
        },
    ]
}
```

For more configuration options refer to the WebPack devServer [proxy documentation](https://webpack.js.org/configuration/dev-server/#devserverproxy).  

## License

MIT.

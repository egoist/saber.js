module.exports = {
    plugins: [
        {
            resolve: '../',
            options: {
                routes: {
                    '/api': {target: 'http://localhost:5000'}
                }
            }
        },
    ]
}

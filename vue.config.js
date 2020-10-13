module.exports = {
  lintOnSave: false,
  devServer: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        ws: false,
        target: 'http://localhost:1337',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/upload': {
        ws: false,
        target: 'http://157.122.54.189:9095/',
        changeOrigin: true,
        pathRewrite: {
          '^/upload': ''
        }
      },
    }
  }
}

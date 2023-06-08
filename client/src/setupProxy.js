const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
      '/api',
      createProxyMiddleware({
        target: process.env.API_URL_DOCKER ? process.env.API_URL_DOCKER  : 'http://localhost:5000/',
        changeOrigin: true,
      })
    );
  };
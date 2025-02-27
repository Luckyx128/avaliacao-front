const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/playground4',
    createProxyMiddleware({
      target: 'http://172.32.0.102:8080',
      changeOrigin: true,
      pathRewrite: { '^/playground4': '' }, // Remove o prefixo
    })
  );
};
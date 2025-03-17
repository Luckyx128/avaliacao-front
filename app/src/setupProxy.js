const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/playground4",
    createProxyMiddleware({
      target: "http://localhost:8080/",
      changeOrigin: true,
      pathRewrite: { "^/playground4": "/playground4" }, // Remove o prefixo
    }),
  );
};

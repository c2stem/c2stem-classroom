module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule("html")
      .test(/\.html$/)
      .use("html-loader")
      .loader("html-loader");
  },
  // Development only: forward /spice-api/* to the production API so calls
  // from http://localhost:8080 are same-origin and not blocked by CORS.
  devServer: {
    proxy: {
      "/spice-api": {
        target: "https://spice.c2-stem.org",
        changeOrigin: true,
        secure: true,
        pathRewrite: { "^/spice-api": "" },
        // the API answers with its own Origin-based CORS headers; the
        // browser sees a same-origin response, so drop the mismatching one
        onProxyRes(proxyRes) {
          delete proxyRes.headers["access-control-allow-origin"];
          delete proxyRes.headers["access-control-allow-credentials"];
        },
      },
    },
  },
};

const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // @를 src 디렉토리에 매핑
      },
    },
  },
  transpileDependencies: true,
  devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:18080',
        changeOrigin: true,
      },
      '^/wk': {
        // 백앤드 주소 작성
        target: 'http://localhost:18080',
        target: 'http://127.0.0.1:18080',
        changeOrigin: true,
        secure: false,
        // wk로 시작하는 거에 대해서 wk지우고 
        pathRewrite: { '^/wk': '/wk' },
        logLevel: 'debug',
      },
    },
  },
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.use("vue-svg-loader").loader("vue-svg-loader");
  },
});

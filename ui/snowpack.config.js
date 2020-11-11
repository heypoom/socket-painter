/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-dotenv',
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-postcss',
  ],
  install: [
    /* ... */
  ],
  installOptions: {
    namedExports: ['socket.io-client', 'lodash'],
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {},
  proxy: {
    /* ... */
  },
  alias: {
    'socket.io-client': 'socket.io-client/dist/socket.io.js',
  },
}

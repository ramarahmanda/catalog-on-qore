const withSass = require("@zeit/next-sass");
const withLess = require("@zeit/next-less");
const withCSS = require("@zeit/next-css");

const isProd = process.env.NODE_ENV === "production";

// fix: prevents error when .less files are required by node
if (typeof require !== "undefined") {
  require.extensions[".less"] = (file) => {};
}

module.exports = (phase, {defaultConfig})=> {
  const config = withLess({
    webpack(config, options) {
      config.module.rules.push({
        test: /\.css$/,
        use: [
          "css-loader",
          "postcss-loader",
        ],
      })
      return config
    },
        lessLoaderOptions: {
          lessOptions:{javascriptEnabled: true}
        }
  })

  return {...defaultConfig,...config}};
const { Transformer } = require("@parcel/plugin");

exports.default = new Transformer({
  async canReuseAST({ ast, options, logger }) {
    return false;
  },

  async loadConfig({ config, options, logger }) {
    // ...
    return config;
  },

  async parse({ asset, config, logger, resolve, options }) {
    // ...
    return asset;
  },

  async transform({ asset, ast, config, logger, resolve, options }) {
    // ...
    return [asset];
  },

  async generate({ asset, ast, resolve, options }) {
    // ...
    return { code, map };
  },

  async postProcess({ assets, config, options, resolve, logger }) {
    return assets;
  },
});

// @flow strict-local

import startFable from "fable-compiler";
import type { Asset, Transformer } from "@parcel/types";
import { Transformer as transformer } from "@parcel/plugin";
import { spawn } from "child_process";
import path from "path";

export default (new transformer({
  async canReuseAST({ load }) {
    return false;
  },

  async loadConfig({ config, options, logger }) {
    // ...
    // this one gets called
    return config;
  },

  async parse({ asset, config, logger, resolve, options }) {
    // ...
    return asset;
  },

  async transform({ asset, ast, config, logger, resolve, options }) {
    // ...
    console.log({ asset });
    spawn("dotnet", ["fable", asset.filePath], {
      cwd: path.dirname(asset.filePath),
    });
    return [asset];
  },
}): Transformer);

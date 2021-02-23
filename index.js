// @flow

import { Transformer as transformer } from "@parcel/plugin";
import type { Transformer } from "@parcel/types";
import { spawn } from "cross-spawn";
import { dirname, basename, join as joinPath } from "path";
import fs from "fs";
import { tmpdir } from "os";

const { readdir, readFile } = fs.promises;

const outDir = joinPath(tmpdir(), "parcel-transformer-fable");

const compile = (fsProj) =>
  new Promise((resolve, reject) => {
    let stdout = "";
    let stderr = "";
    const cmd = spawn(
      "dotnet",
      ["fable", fsProj.filePath, "--sourceMaps", "--outDir", outDir],
      {
        cwd: dirname(fsProj.filePath),
      }
    );
    cmd.stdout.on("data", (data) => {
      stdout += data;
    });

    cmd.stderr.on("data", (data) => {
      stderr += data;
    });

    cmd.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(stderr);
      }
    });
  });

function toAssets(fileNames) {
  async function toAsset(file) {
    const filePath = joinPath(outDir, file);
    const content = await readFile(filePath, { encoding: "utf-8" });
    return { filePath, type: "js", content };
  }

  return fileNames.reduce((acc, file) => {
    if (/\.js$/.test(file)) {
      return acc.concat(toAsset(file));
    } else {
      return acc;
    }
  }, []);
}

export default (new transformer({
  async transform({ asset, ast, config, logger, resolve, options }) {
    try {
      const stdout = await compile(asset);
      const files: Array<string> = await readdir(outDir);
      const assets = await Promise.all(toAssets(files));
      return assets;
    } catch (e) {
      console.log(e);
      logger.error("compilation failed:", e);
    }
    // ...
  },
}): Transformer);

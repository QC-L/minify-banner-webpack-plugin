"use strict";

const ConcatSource = require("webpack-sources").ConcatSource;
const CustomDate = require("./util/dateformat");

const wrapComment = (author) => {
  const nowDate = new CustomDate().format("yyyy-MM-dd");
  return `/*! Created by ${author} on ${nowDate}. */`;
};

class MinifyBannerWebpackPlugin {
  constructor(options) {
    if (arguments.length > 1) {
      throw new Error("MinifyBannerWebpackPlugin only takes one argument (pass an options object)");
    }
    if (typeof options === "string") {
      options = {
        author: options
      };
    }
    this.options = options || {};
    this.banner = this.options.isShow ? null : wrapComment(this.options.author);
  }
  
  apply(compiler) {
    const banner = this.banner;
    const options = this.options;
    compiler.plugin("compilation", (compilation) => {
      compilation.plugin("optimize-chunk-assets", (chunks, callback) => {
        chunks.forEach((chunk) => {
          if(!chunk.isInitial()) return;
				  chunk.files.forEach((file) => {
            return compilation.assets[file] = new ConcatSource(banner, "\n", compilation.assets[file]);
          });
        })
        callback();
      })
    })
  }
}

module.exports = MinifyBannerWebpackPlugin;

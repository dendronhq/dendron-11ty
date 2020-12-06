const { Liquid } = require("liquidjs");

const md = require('./libs/markdown');
const liquidParser = require('./libs/templates');

module.exports = function (eleventyConfig) {
  eleventyConfig.setLibrary("liquid", liquidParser);
  eleventyConfig.setLibrary("md", md);
  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};

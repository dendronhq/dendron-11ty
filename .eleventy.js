const { Liquid } = require("liquidjs");
const fs = require("fs-extra");
const path = require("path");
const _ = require("lodash");

const md = require("./libs/markdown");
const liquidParser = require("./libs/templates");

module.exports = function (eleventyConfig) {
  eleventyConfig.setLibrary("liquid", liquidParser);
  eleventyConfig.setLibrary("md", md);

  eleventyConfig.addFilter("absolute_url", function (variable) {
      const site = fs.readJSONSync("_data/site.json");
      return path.join(site.url, variable)
  });
  eleventyConfig.addLiquidFilter("group_by", function(collection, groupByKey) {
    return _.groupBy(collection, groupByKey)
  });
  eleventyConfig.addLiquidFilter("where_exp", function(collection, expr) {
      // TODO
    //{%- assign ordered_pages_list = group.items | 
    //where_exp:"item", "item.nav_order != nil" -%}
    //return _.groupBy(collection, groupByKey)
    return collection;
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};

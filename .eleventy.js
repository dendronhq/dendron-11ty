const { Liquid } = require("liquidjs");
const fs = require("fs-extra");
const path = require("path");
const _ = require("lodash");

const md = require("./libs/markdown");
const liquidParser = require("./libs/templates");
const {EngineConnector} = require("@dendronhq/engine-server");

module.exports = function (eleventyConfig) {
  eleventyConfig.setLibrary("liquid", liquidParser);
  eleventyConfig.setLibrary("md", md);
  eleventyConfig.setTemplateFormats([
    "scss",
    "md"
  ]);

  // --- filters
  eleventyConfig.addFilter("absolute_url", function (variable) {
      const site = fs.readJSONSync("_data/site.json");
      console.log("bond", site);
      return path.join(site.url, variable)
  });

  eleventyConfig.addLiquidFilter("group_by", function(collection, groupByKey) {
    const gp = _.groupBy(collection, groupByKey)
    return _.map(gp, (v, k) => ({name: k, items: v}))
  });
  eleventyConfig.addLiquidFilter("jsonfy", function(obj) {
      return JSON.stringify(obj, null, 4);
  });
  eleventyConfig.addLiquidFilter("where_exp", function(collection, expr) {
      // TODO
    //{%- assign ordered_pages_list = group.items | 
    //where_exp:"item", "item.nav_order != nil" -%}
    //return _.groupBy(collection, groupByKey)
    return collection;
  });

  // --- shortcodes
    eleventyConfig.addLiquidShortcode("domains", async function() {
        const ec = new EngineConnector({wsRoot: "/Users/kevinlin/projects/dendronv2/dendron-site"})
        await ec.init({portOverride: 3006})
        const resp = await ec.engine.queryNotes({qs: "root"})
        const domains = resp.data[0].children.map(id => JSON.stringify(ec.engine.notes[id]));
        return domains;
    });

    eleventyConfig.addPairedShortcode("user2", async function(content, name, twitterUsername) {
        return await fetchAThing();
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

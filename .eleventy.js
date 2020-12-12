const { Liquid } = require("liquidjs");
const fs = require("fs-extra");
const path = require("path");
const _ = require("lodash");
const liquidParser = require("./libs/templates");
const eleventyRemark = require("./libs/remark2");
const shortcodes = require("./libs/shortcodes");
const { EngineConnector, MDUtilsV4 } = require("@dendronhq/engine-server");
const remark = require("remark");
const remarkRehype = require("remark-rehype");
const rehypeStringify = require("rehype-stringify");

module.exports = function (eleventyConfig) {
  // --- tempaltes
  // eleventyConfig.addPlugin(eleventyRemark);
  // eleventyConfig.setLibrary("liquid", liquidParser);
  eleventyConfig.setTemplateFormats(["scss", "css", "liquid", "md"]);
  eleventyConfig.setLiquidOptions({
    dynamicPartials: false,
    strict_filters: true,
    root: ["_includes"],
    extname: ".liquid",
  });

  // --- filters
  eleventyConfig.addFilter("absolute_url", async function (variable) {
    const site = require(`${__dirname}/_data/site.js`)();
    // TODO: this isn't right
    const out = _.join([site.url, variable], "/");
    return out;
  });

  eleventyConfig.addLiquidFilter("group_by", function (collection, groupByKey) {
    const gp = _.groupBy(collection, groupByKey);
    return _.map(gp, (v, k) => ({ name: k, items: v }));
  });
  eleventyConfig.addLiquidFilter("jsonfy", function (obj) {
    return JSON.stringify(obj, null, 4);
  });
  eleventyConfig.addLiquidFilter("sort", function (array, field) {
    return _.sortBy(array, field);
  });

  // eleventyConfig.addLiquidFilter("toMd", function(content) {
  //   return MDUtilsV4.proc({wsRoot: "/Users/kevinlin/projects/dendronv2/dendron-site"}).process(content)
  // });

  eleventyConfig.addLiquidFilter("toHTML", function (content) {
    let processor = remark().use(remarkRehype).use(rehypeStringify);
    return processor.process(content);
  });
  eleventyConfig.addLiquidFilter("where_exp", function (collection, expr) {
    // TODO
    //{%- assign ordered_pages_list = group.items |
    //where_exp:"item", "item.nav_order != nil" -%}
    //return _.groupBy(collection, groupByKey)
    return collection;
  });

  // --- shortcodes
  eleventyConfig.addPlugin(shortcodes);
  eleventyConfig.addLiquidShortcode("domains", async function () {
    const ec = new EngineConnector({
      wsRoot: "/Users/kevinlin/projects/dendronv2/dendron-site",
    });
    await ec.init({ portOverride: 3006 });
    const resp = await ec.engine.queryNotes({ qs: "root" });
    const domains = resp.data[0].children.map((id) =>
      JSON.stringify(ec.engine.notes[id])
    );
    return domains;
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

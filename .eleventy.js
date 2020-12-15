const _ = require("lodash");
const path = require("path");
const shortcodes = require("./libs/shortcodes");
const remark = require("remark");
const remarkRehype = require("remark-rehype");
const rehypeStringify = require("rehype-stringify");
const { buildSearch } = require("./bin/build-search.js");
const { buildStyles } = require("./bin/build-styles.js");
const env = require("./_data/processEnv");

module.exports = function (eleventyConfig) {
  // --- tempaltes
  eleventyConfig.setTemplateFormats(["scss", "css", "liquid", "md"]);
  eleventyConfig.setLiquidOptions({
    dynamicPartials: false,
    strict_filters: true,
    root: ["_includes"],
    extname: ".liquid",
  });

  // --- filters
  eleventyConfig.addFilter("absolute_url", async function (variable) {
    const site = require(`${__dirname}/_data/site.js`);
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
  // dendron specific
  eleventyConfig.addLiquidFilter("noteURL", function (note) {
    const site = require(`${__dirname}/_data/site.js`);
    // TODO: only for proto
    const id = _.get(note, 'id', '')
    return path.join(site().notePrefix, id + ".html");
  });

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

  eleventyConfig.on('afterBuild', () => {
    buildStyles();
    buildSearch();
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

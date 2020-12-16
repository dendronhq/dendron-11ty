const _ = require("lodash");
const path = require("path");
const shortcodes = require("./libs/shortcodes");
const remark = require("remark");
const remarkRehype = require("remark-rehype");
const rehypeStringify = require("rehype-stringify");
const { buildSearch } = require("./bin/build-search.js");
const { buildStyles } = require("./bin/build-styles.js");
const { copyAssets } = require("./bin/copy-assets.js");
const env = require("./_data/processEnv");
const site = require("./_data/site")();

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
  // dendron specific
  eleventyConfig.addLiquidFilter("noteURL", function (note) {
    const out = _.get(note, "custom.permalink", `${site.notePrefix}${note.id}.html`)
    return out;
  });
  eleventyConfig.addLiquidFilter("toNote", function (id) {
    const notes = require(`${__dirname}/_data/notes.js`);
    // TODO: only for proto
    const note = _.get(notes, id, '')
    return note;
  });
  eleventyConfig.addLiquidFilter("urlToNote", function (url, notes) {
    const noteId = removeExtension(url.split("/").slice(-1)[0], ".html")
    const note = _.get(notes, noteId, '')
    return note;
  });
  eleventyConfig.addLiquidFilter("toNotes", async function (ids) {
    const notes = await require(`${__dirname}/_data/notes.js`)();
    const out = _.map(ids, id => notes[id]);
    return out;
  });

  eleventyConfig.addLiquidFilter("noteParent", function (note, notes) {
    if (_.isNull(note.parent) || _.isUndefined(note.parent)) {
      return;
    } else {
      return notes[note.parent]
    }
  });
  eleventyConfig.addLiquidFilter("noteParents", function (note, notes) {
    const out = [];
    if (!note) { return []}
    while (note.parent !== null) {
      out.push(note);
      note = notes[note.parent];
    }
    out.push(note);
    let res = _.reverse(out).map(ent => ent.id).join(",")
    return res;
  });

  // --- shortcodes
  eleventyConfig.addPlugin(shortcodes);

  eleventyConfig.on('afterBuild', () => {
    buildStyles();
    buildSearch();
    copyAssets();
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

function removeExtension(nodePath, ext) {
  const idx = nodePath.lastIndexOf(ext);
  if (idx > 0) {
    nodePath = nodePath.slice(0, idx);
  }
  return nodePath;
}

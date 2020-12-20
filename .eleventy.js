const _ = require("lodash");
const path = require("path");
const shortcodes = require("./libs/shortcodes");
const markdown = require("./libs/markdown");
const remark = require("remark");
const remarkRehype = require("remark-rehype");
const rehypeStringify = require("rehype-stringify");
const { buildSearch } = require("./bin/build-search.js");
const { buildStyles } = require("./bin/build-styles.js");
const { buildNav } = require("./bin/build-nav.js");
const { copyAssets } = require("./bin/copy-assets.js");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const site = require("./_data/site")();
const { getSiteOutputPath, NOTE_UTILS } = require("./libs/utils");

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false);

  // --- libraries
  eleventyConfig.addPlugin(markdown);

  // --- tempaltes
  eleventyConfig.setTemplateFormats(["scss", "css", "liquid", "md"]);
  eleventyConfig.setLiquidOptions({
    dynamicPartials: false,
    strict_filters: true,
    root: ["_includes"],
    extname: ".liquid",
  });
  eleventyConfig.addPassthroughCopy("assets/js/vendor");

  // --- filters
  eleventyConfig.addLiquidFilter("absolute_url", function (variable) {
    return NOTE_UTILS.getAbsUrl(variable);
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
    return NOTE_UTILS.getUrl(note);
  });
  eleventyConfig.addLiquidFilter("noteIdsToNotes", function (noteIds, notes) {
    return noteIds.map(id => notes[id]);
  });
  eleventyConfig.addLiquidFilter("toNote", function (id) {
    const notes = require(`${__dirname}/_data/notes.js`);
    // TODO: only for proto
    const note = _.get(notes, id, "");
    return note;
  });
  eleventyConfig.addLiquidFilter("urlToNote", function (url, notes) {
    const noteId = removeExtension(url.split("/").slice(-1)[0], ".html");
    const note = _.get(notes, noteId, "");
    return note;
  });

  eleventyConfig.addLiquidFilter("noteParent", function (note, notes) {
    if (_.isNull(note.parent) || _.isUndefined(note.parent)) {
      return;
    } else {
      return notes[note.parent];
    }
  });
  eleventyConfig.addLiquidFilter("noteParents", function (note, notes) {
    const out = [];
    if (!note) {
      return [];
    }
    while (note.parent !== null) {
      out.push(note);
      note = notes[note.parent];
    }
    out.push(note);
    let res = _.reverse(out)
      .map((ent) => ent.id)
      .join(",");
    return res;
  });

  // --- plugins
  eleventyConfig.addPlugin(shortcodes);
  eleventyConfig.addPlugin(syntaxHighlight);

  // --- events
  eleventyConfig.on("beforeBuild", async () => {
    await buildNav();
  });

  eleventyConfig.on("afterBuild", () => {
    buildStyles();
    buildSearch();
    copyAssets();
  });

  return {
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: getSiteOutputPath(),
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

const remark = require("remark");
const remarkRehype = require("remark-rehype");
const rehypeStringify = require("rehype-stringify");
const {
  MDUtilsV4,
  DendronASTDest,
} = require("@dendronhq/engine-server");
const path = require("path");
const { getEngine } = require("./utils");
const env = require(path.join(__dirname, "..", "_data", "processEnv.js"));

async function toMarkdown2(contents, vault) {
  const linkPrefix = "/notes/";
  const engine = await getEngine();
  const proc = MDUtilsV4.procFull({
    engine,
    dest: DendronASTDest.HTML,
    vault,
    wikiLinksOpts: { dest: DendronASTDest.HTML, useId: true, prefix: linkPrefix },
  });
  return proc.process(contents);
}

function toHTML(contents) {
  let processor = remark().use(remarkRehype).use(rehypeStringify);
  return processor.process(contents);
}

module.exports = {
  configFunction: function (eleventyConfig, options = {}) {
    eleventyConfig.addPairedShortcode("html", toHTML);
    eleventyConfig.addPairedShortcode("markdown", toMarkdown2);
  },
};

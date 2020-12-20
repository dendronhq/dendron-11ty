const remark = require("remark");
const remarkRehype = require("remark-rehype");
const rehypeStringify = require("rehype-stringify");
const raw = require("rehype-raw");
const { MDUtilsV4, DendronASTDest } = require("@dendronhq/engine-server");
const path = require("path");
const { getEngine, getSiteConfig, NOTE_UTILS } = require("./utils");
const env = require(path.join(__dirname, "..", "_data", "processEnv.js"));
const fs = require("fs");

async function toMarkdown2(contents, vault) {
  const absUrl = NOTE_UTILS.getAbsUrl();
  const siteNotesDir = getSiteConfig().siteNotesDir;
  const linkPrefix = absUrl + "/" + siteNotesDir + "/";
  const engine = await getEngine();
  const wikiLinksOpts = { useId: true, prefix: linkPrefix };
  const proc = MDUtilsV4.procFull({
    engine,
    dest: DendronASTDest.HTML,
    vault,
    wikiLinksOpts,
    noteRefOpts: { wikiLinkOpts: wikiLinksOpts, prettyRefs: true },
  });
  return proc.process(contents);
}

async function toHTML(contents) {
  const engine = await getEngine();
  let processor = MDUtilsV4.proc(engine)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(raw)
    .use(rehypeStringify);
  return processor.process(contents);
}

function toNav(note) {
  const navTemplate = fs.readFileSync("/tmp/nav.html");
  return navTemplate;
}

module.exports = {
  configFunction: function (eleventyConfig, options = {}) {
    eleventyConfig.addPairedShortcode("html", toHTML);
    eleventyConfig.addPairedShortcode("markdown", toMarkdown2);
    eleventyConfig.addLiquidFilter("toNav", toNav); 
  },
};

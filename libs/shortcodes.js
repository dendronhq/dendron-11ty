const remark = require("remark");
const remarkRehype = require("remark-rehype");
const rehypeStringify = require("rehype-stringify");
const { EngineConnector } = require("@dendronhq/engine-server");
const {
  ParserUtilsV2,
  dendronNoteRefPlugin,
  replaceRefs,
  MDUtilsV4,
  DendronASTDest,
} = require("@dendronhq/engine-server");
const path = require("path");
const env = require(path.join(__dirname, "..", "_data", "processEnv.js"));

async function toMarkdown2(contents, vault) {
  console.log("dirname", __dirname, JSON.stringify(env))
  const linkPrefix = "/notes/";
  const engineConnector = EngineConnector.getOrCreate({
    wsRoot: env.wsRoot
  });
  if (!engineConnector.initialized) {
    console.log("engine init");
    await engineConnector.init({ portOverride: env.enginePort});
  }
  const engine = engineConnector.engine;
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

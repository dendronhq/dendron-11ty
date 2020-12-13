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

async function toMarkdown2(contents, vault) {
  console.log("got vault", vault)
  const linkPrefix = "/notes/";
  const engineConnector = EngineConnector.getOrCreate({
    wsRoot: "/Users/kevinlin/projects/dendronv2/dendron-site",
  });
  if (!engineConnector.initialized) {
    console.log("engine init");
    await engineConnector.init({ portOverride: 3006 });
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

async function toMarkdown(contents) {
  const linkPrefix = "/notes/";
  const engineConnector = EngineConnector.getOrCreate({
    wsRoot: "/Users/kevinlin/projects/dendronv2/dendron-site",
  });
  if (!engineConnector.initialized) {
    console.log("engine init");
    await engineConnector.init({ portOverride: 3006 });
  }
  const engine = engineConnector.engine;

  const opts = {
    assetsPrefix: undefined,
    engine,
  };

  let proc = ParserUtilsV2.getRemark().use(dendronNoteRefPlugin, {
    renderWithOutline: opts.usePrettyRefs || false,
    replaceRefOpts: {
      wikiLink2Md: true,
      wikiLinkPrefix: linkPrefix,
      imageRefPrefix: opts.assetsPrefix,
      wikiLinkUseId: true,
      engine: opts.engine,
      forNoteRefInSite: true,
    },
    engine: opts.engine,
  });

  proc = proc.use(replaceRefs, {
    wikiLink2Md: true,
    wikiLinkPrefix: linkPrefix,
    imageRefPrefix: opts.assetsPrefix,
    wikiLinkUseId: true,
    engine: opts.engine,
    forNoteRefInSite: true,
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

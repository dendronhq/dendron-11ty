const remark = require("remark");
const remarkRehype = require("remark-rehype");
const rehypeStringify = require("rehype-stringify");
const { EngineConnector } = require("@dendronhq/engine-server");
const {
  ParserUtilsV2,
  dendronNoteRefPlugin,
  replaceRefs,
  dendronLinksPlugin,
  enrichNode,
  DendronASTData,
  DendronASTDest
} = require("@dendronhq/engine-server");

function requirePlugins(plugins) {
  if (!Array.isArray(plugins)) {
    throw new Error("plugins option is not an array");
  }

  const requirePlugin = (item) => {
    if (typeof item === "function") {
      return item;
    } else if (typeof item === "string") {
      return require(item);
    }

    throw new Error(
      `plugin has to be a function or a string, ${typeof item} type passed`
    );
  };

  const list = plugins.map((item) => {
    let options = {};
    let fn;
    if (typeof item === "object" && item !== null && item.plugin) {
      fn = requirePlugin(item.plugin);
      options = item.options ? item.options : {};
    } else {
      fn = requirePlugin(item);
    }

    return [fn, options];
  });

  return list;
}

function eleventyRemark() {
  const linkPrefix = "notes";
    const engine = new EngineConnector({
      wsRoot: "/Users/kevinlin/projects/dendronv2/dendron-site",
    });

  const opts = {
    assetsPrefix: undefined,
  };
  let processor = ParserUtilsV2.getRemark({
    dendronLinksOpts: {
      toMd: true,
    },
  })
  .data("engine", engine)
  .data("dendron", {dest: DendronASTDest.HTML})
  .use(enrichNode)
  .use(dendronNoteRefPlugin, {
    renderWithOutline: true,
    replaceRefOpts: {
      wikiLink2Md: true,
      wikiLinkPrefix: linkPrefix,
      imageRefPrefix: opts.assetsPrefix,
      wikiLinkUseId: true,
      engine: engine,
      //scratch: scratchPad1,
      forNoteRefInSite: true,
    },
    engine,
  })
    .use(replaceRefs, {
      wikiLink2Md: true,
      wikiLinkPrefix: linkPrefix,
      imageRefPrefix: opts.assetsPrefix,
      wikiLinkUseId: true,
      engine: engine,
      //scratch: "/tmp/out",
      forNoteRefInSite: true,
    })
    .use(remarkRehype)
    .use(rehypeStringify);

  return {
    set: () => {},
    render: async (str) => {
      const { contents } = await processor.process(str);
      return contents;
    },
  };
}

const defaultEleventyRemarkOptions = {
  plugins: [],
};

module.exports = {
  initArguments: {},
  configFunction: (eleventyConfig, pluginOptions = {}) => {
    const options = Object.assign(
      {},
      defaultEleventyRemarkOptions,
      pluginOptions
    );
    eleventyConfig.setLibrary("md", eleventyRemark());
  },
};

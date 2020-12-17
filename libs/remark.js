const remark = require("remark");
const remarkRehype = require("remark-rehype");
const rehypeStringify = require("rehype-stringify");
const { MDUtilsV4 } = require("@dendronhq/engine-server");
const raw = require("rehype-raw");

function eleventyRemark(options) {
  let processor = MDUtilsV4.proc({ engine: null })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(raw)
    .use(rehypeStringify);

  return {
    set: () => {},
    render: async (str) => {
      const { contents } = await processor.process(str);
      return contents;
    },
  };
}

module.exports = function (eleventyConfig) {
  eleventyConfig.setLibrary("md", eleventyRemark());
};

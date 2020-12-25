const remark = require("remark");
const { MDUtilsV4 } = require("@dendronhq/engine-server");
const highlight = require('remark-highlight.js')

function eleventyRemark(options) {
  
  const processor = MDUtilsV4.procRehype({mdPlugins: [highlight], mathjax: true});

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

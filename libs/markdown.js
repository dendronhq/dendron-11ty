const markdown = require('markdown-it');

module.exports = (() => {
  const options = {
    html: true,
    breaks: true,
    linkify: false,
  };


  const parser = markdown(options);

  // Disable pre/code based on indentation.
  parser.disable('code');

  return parser;
})();

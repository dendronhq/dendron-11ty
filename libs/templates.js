const { Liquid } = require('liquidjs');

module.exports = (() => {
  const liquidParser = new Liquid({
    root: ['_includes/layouts'],
    extname: '.liquid',
    dynamicPartials: false,
    strictFilters: true,
  });

  return liquidParser;
})();

const path = require("path");
const Eleventy = require("@11ty/eleventy");
const _ = require("lodash");

function compile(cwd, overrides) {
  const argv = _.merge({
    config: ".eleventy.js",
    port: 8080,
  }, overrides);

  process.chdir(cwd);

  //
  let elev = new Eleventy(argv.input, argv.output, {
    quietMode: argv.quiet,
  });

  elev.setConfigPathOverride(argv.config);
  elev.setPathPrefix(argv.pathprefix);
  elev.setDryRun(argv.dryrun);
  elev.setIncrementalBuild(argv.incremental);
  elev.setPassthroughAll(argv.passthroughall);
  elev.setFormats(argv.formats);

  // careful, we can’t use async/await here to error properly
  // with old node versions in `please-upgrade-node` above.
  elev
    .init()
    .then(function () {
      if (argv.version) {
        console.log(elev.getVersion());
      } else if (argv.help) {
        console.log(elev.getHelp());
      } else if (argv.serve) {
        elev.watch().then(function () {
          elev.serve(argv.port);
        });
      } else if (argv.watch) {
        elev.watch();
      } else {
        elev.write();
      }
    })
    .catch((err) => {
      console.log("error", JSON.stringify(err));
      throw err;
    });
}

module.exports = {
  compile,
};

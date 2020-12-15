const path = require("path");
const _ = require("lodash");
const { SiteUtils } = require("@dendronhq/engine-server");
const { env, getEngine, getDendronConfig } = require(path.join(
  __dirname,
  "..",
  "libs",
  "utils.js"
));

async function getNotes() {
  const engine = await getEngine();
  const config = getDendronConfig();
  let notes = await SiteUtils.filterByConfig({ engine, config: config.site });
  if (env.proto) {
    const _notes = {};
    _.keys(notes)
      .slice(0, 10)
      .forEach((k) => {
        _notes[k] = notes[k];
      });
    notes = _notes;
  }
  return notes;
}

module.exports = async function () {
  notes: return getNotes();
};

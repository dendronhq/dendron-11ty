const path = require("path");
const fs = require("fs-extra");
const _ = require("lodash");
const { SiteUtils } = require("@dendronhq/engine-server");
const { env, getEngine, getDendronConfig } = require(path.join(
  __dirname,
  "..",
  "libs",
  "utils.js"
));

async function getNotes() {
  if (env.proto) {
    const notes = fs.readJSONSync(path.join(__dirname, "notes-proto.json"));
    return notes;
  }
  const engine = await getEngine();
  const config = getDendronConfig();
  let {notes, domains} = await SiteUtils.filterByConfig({ engine, config: config.site });
  // // TODO: DEBUG
  // fs.writeJSONSync("/tmp/notes-debug.txt", notes, {spaces: 4});
  return {notes, domains};
}

module.exports = async function () {
  return getNotes();
};

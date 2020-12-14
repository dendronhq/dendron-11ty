const path = require("path");
const _ = require("lodash");
const { env, getEngine } = require(path.join(
  __dirname,
  "..",
  "libs",
  "utils.js"
));

async function getNotes() {
  const engine = await getEngine();
  let notes = engine.notes;
  if (env.proto) {
    notes = {};
    _.keys(engine.notes)
      .slice(0, 10)
      .forEach((k) => {
        notes[k] = engine.notes[k];
      });
  }
  return notes;
}

module.exports = async function () {
  notes: return getNotes();
};

const { getSiteOutputPath, NOTE_UTILS } = require("../libs/utils");
const _ = require("lodash");
const fs = require("fs");

function createNav(noteIdsAtLevel, notesDict) {
  let out = [`<ul class="nav-list">`];
  let notesAtLevel = noteIdsAtLevel.map((ent) => notesDict[ent]);
  notesAtLevel = _.filter(notesAtLevel, (ent) => {
    return !_.get(ent, "custon.nav_exclude", false);
  });
  console.log(JSON.stringify({ctx: "createNav:enter", noteIdsAtLevel}))
  const allLevels = _.map(notesAtLevel, (node) => {
    let level = [];
    let permalink = _.get(node, "custom.permalink", "");
    level.push(`<li class="nav-list-item" id="${(permalink === "/" ? "root" : node.id)}">`);
    // $("ul").find(`[data-slide='${current}']`)
    if (node.children.length > 0 && permalink != "/") {
      level.push(
        `<a href="" class="nav-list-expander"><svg viewBox="0 0 24 24"><use xlink:href="#svg-arrow-right"></use></svg></a>`
      );
    }
    let href = NOTE_UTILS.getAbsUrl(NOTE_UTILS.getUrl(node));
    level.push(`<a href="${href}" class="nav-list-link">${node.title}</a>`);
    if (node.children.length > 0) {
      level.push(_.flatMap(createNav(node.children, notesDict)));
    } 
    level.push(`</li>`);
    return _.flatMap(level);
  });
  console.log(JSON.stringify({ctx: "createNav:exit", noteIdsAtLevel, allLevels}))
  return out.concat(_.flatMap(allLevels)).concat(['</ul>'])
}

async function buildNav() {
  const notes = await require("../_data/notes.js")();
  const domains = await require("../_data/domains.js")();
  const nav = createNav(
    domains,
    notes
  );
  console.log({ctx: "buildNav", nav})
  fs.writeFileSync("/tmp/nav.html", nav.join("\n"), {encoding: "utf8"});
}

module.exports = { buildNav };

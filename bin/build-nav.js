const { NOTE_UTILS, getNavOutput, getMetaPath} = require("../libs/utils");
const _ = require("lodash");
const fs = require("fs");

function createNav(noteIdsAtLevel, notesDict) {
  let out = [`<ul class="nav-list">`];
  let notesAtLevel = noteIdsAtLevel.map((ent) => notesDict[ent]);
  notesAtLevel = _.filter(notesAtLevel, (ent) => {
    return !_.get(ent, "custom.nav_exclude", false);
  });
  // copied at libs/shortcodes.js
  notesAtLevel = _.sortBy(notesAtLevel, ["custom.nav_order", "title"]);
  const allLevels = _.map(notesAtLevel, (node) => {
    let level = [];
    let permalink = _.get(node, "custom.permalink", "");
    const elemId = (permalink === "/" ? "root" : node.id);
    level.push(`<li class="nav-list-item" id="${elemId}">`);
    // $("ul").find(`[data-slide='${current}']`)
    if (node.children.length > 0 && permalink != "/") {
      level.push(
        `<a href="" class="nav-list-expander"><svg viewBox="0 0 24 24"><use xlink:href="#svg-arrow-right"></use></svg></a>`
      );
    }
    let href = NOTE_UTILS.getAbsUrl(NOTE_UTILS.getUrl(node));
    level.push(`<a id="a-${elemId}" href="${href}" class="nav-list-link">${node.title}</a>`);
    if (node.children.length > 0 && permalink !== "/") {
      level.push(_.flatMap(createNav(node.children, notesDict)));
    } 
    level.push(`</li>`);
    return _.flatMap(level);
  });
  return out.concat(_.flatMap(allLevels)).concat(['</ul>'])
}

async function buildNav() {
  const notes = await require("../_data/notes.js")();
  const domains = await require("../_data/domains.js")();
  const nav = createNav(
    domains,
    notes
  );
  const navPath = getNavOutput();
  fs.writeFileSync(navPath, nav.join("\n"), {encoding: "utf8"});
  fs.writeFileSync(getMetaPath(), _.now());
}

module.exports = { buildNav };

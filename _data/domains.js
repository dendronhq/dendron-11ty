const {EngineConnector} = require("@dendronhq/engine-server");
const fs = require("fs-extra");
const path = require("path");
const site = require(`${__dirname}/site`)

async function getDomains() {
    // const ec = new EngineConnector({wsRoot: "/Users/kevinlin/projects/dendronv2/dendron-site"})
    // await ec.init({portOverride: 3006})
    // const resp = await ec.engine.queryNotes({qs: "root"})
    const noteList = fs.readJSONSync(path.join(__dirname, "notes.json"));
    const notes = {}
    noteList.forEach(n => {
        notes[n.id] = n;
    });
    const root = notes['root'];
    const domains = root.children.map(id => (enhanceNodeForLiquid(notes[id])));
    return domains;
}

function enhanceNodeForLiquid(node) {
    node.url = path.join(site().notePrefix, node.id + ".html");
    return node;
}

module.exports = async function () {
    return getDomains();
};

const fs = require("fs-extra");
const path = require("path");
const site = require(`${__dirname}/site`)
const {env, getEngine} = require(path.join(__dirname, "..", "libs", "utils.js"));
const _ = require("lodash");

async function getDomains() {
    const notes = await require("./notes.js")();
    const root = _.find(notes, {fname: "root"});
    let allChildren = root.children;
    if (env.proto) {
        allChildren = _.filter(allChildren, id => id in notes);
    }
    const domains = allChildren.map(id => (enhanceNodeForLiquid(notes[id])));
    return domains;
}

function enhanceNodeForLiquid(node) {
    node.url = path.join(site().notePrefix, node.id + ".html");
    return node;
}

module.exports = async function () {
    return getDomains();
};

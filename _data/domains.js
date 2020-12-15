const fs = require("fs-extra");
const path = require("path");
const site = require(`${__dirname}/site`)
const {env, getEngine} = require(path.join(__dirname, "..", "libs", "utils.js"));
const _ = require("lodash");

async function getDomains() {
    const notes = await require("./notes.js")();
    const allChildren = _.filter(notes, {parent: null});
    const domains = allChildren.map(note => (note.id));
    // const domains = allChildren.map(note => (enhanceNodeForLiquid(note)));
    // return domains;
    return domains;
}

function enhanceNodeForLiquid(node) {
    node.url = path.join(site().notePrefix, node.id + ".html");
    return node;
}

module.exports = async function () {
    return getDomains();
};

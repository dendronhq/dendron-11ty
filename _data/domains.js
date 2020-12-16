const fs = require("fs-extra");
const path = require("path");
const site = require(`${__dirname}/site`)
const {env, getEngine} = require(path.join(__dirname, "..", "libs", "utils.js"));
const _ = require("lodash");

async function getDomains() {
    const notes = await require("./notes.js")();
    const allChildren = _.filter(notes, {parent: null});
    let domains = allChildren.map(note => (note.id));
    return domains;
}

module.exports = async function () {
    return getDomains();
};

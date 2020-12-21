const fs = require("fs-extra");
const path = require("path");
const site = require(`${__dirname}/site`)
const { SiteUtils } = require("@dendronhq/engine-server");
const {env, getEngine} = require(path.join(__dirname, "..", "libs", "utils.js"));
const _ = require("lodash");

async function getDomains() {
    const notes = await require("./notes.js")();
    const config = await require("./dendronConfig.js")();
    const domains = SiteUtils.getDomains({config: config.site, notes: notes});
    return domains.map(ent => ent.id);
}

module.exports = async function () {
    return getDomains();
};

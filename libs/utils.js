const path = require("path");
const { createLogger, resolvePath } = require("@dendronhq/common-server");
const _env = require(path.join(__dirname, "..", "_data", "processEnv.js"));
const { EngineConnector, DConfig } = require("@dendronhq/engine-server");
const fs = require("fs-extra");
const _ = require("lodash");

const getEngine = async () => {
  const engineConnector = EngineConnector.getOrCreate({
    wsRoot: env.wsRoot,
  });
  if (!engineConnector.initialized) {
    console.log("init engine");
    await engineConnector.init({ portOverride: env.enginePort });
  }
  const engine = engineConnector.engine;
  return engine;
};

const getDendronConfig = () => {
  const wsRoot = env.wsRoot;
  const config = DConfig.getOrCreate(wsRoot);
  config.site = DConfig.cleanSiteConfig(config.site);
  return config;
};

const getSiteConfig = () => {
  return getDendronConfig().site;
};

const logger = () => {
  const logger = createLogger();
  return logger;
};

const getSiteOutputPath = () => {
  const wsRoot = env.wsRoot;
  const config = getDendronConfig();
  let siteRootPath;
  if (env.stage === "dev") {
    siteRootPath = path.join(wsRoot, "build", "site");
    fs.ensureDirSync(siteRootPath);
  } else {
    siteRootPath = resolvePath(config.site.siteRootDir, wsRoot);
  }
  return siteRootPath;
};

const env = {
  ..._env,
};

class NOTE_UTILS {
  static getUrl = (note) => {
    return _.get(
      note,
      "custom.permalink",
      `${path.join(getSiteConfig().siteNotesDir, note.id)}.html`
    );
  };

  static getAbsUrl= (suffix) => {
    suffix = suffix || "";
    const siteUrl = getSiteConfig().siteUrl;
    if (siteUrl && env.stage !== "dev") {
      const out = getSiteConfig().siteProtocol + "://" + path.join(siteUrl, suffix);
      return out;
    } else {
      return "http://" + path.join("localhost:8080", suffix);
    }
  };
}


module.exports = {
  getEngine,
  env,
  getDendronConfig,
  getSiteConfig,
  logger,
  resolvePath,
  getSiteOutputPath,
  NOTE_UTILS,
};
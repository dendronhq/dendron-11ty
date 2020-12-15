const path = require("path");
const env = require(path.join(__dirname, "..", "_data", "processEnv.js"));
const {
    EngineConnector,
    DConfig
} = require("@dendronhq/engine-server");


const getEngine = async () => {
  const engineConnector = EngineConnector.getOrCreate({
    wsRoot: env.wsRoot,
  });
  if (!engineConnector.initialized) {
    await engineConnector.init({ portOverride: env.enginePort });
  }
  const engine = engineConnector.engine;
  return engine;
};

const getDendronConfig = () => {
    const wsRoot = env.wsRoot
    return DConfig.getOrCreate(wsRoot)
}
module.exports = { getEngine, env, getDendronConfig };

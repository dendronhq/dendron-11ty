const { SiteUtils } = require("@dendronhq/engine-server");
const fs = require("fs-extra");
const path = require("path");
const { env, getDendronConfig, logger } = require("../libs/utils");

async function copyAssets() {
  const ctx = "copyAssets";
  const site = await require("../_data/site.js")();
  const wsRoot = env.wsRoot;
  const config = getDendronConfig();
  const vaults = config.vaults;
  const siteAssetsDir = path.join(config.site.siteRootDir, "assets");
  if (!config.site.copyAssets) {
    logger().info({ ctx, msg: "skip copying" });
    return;
  }
  logger().info({ ctx, msg: "copying" });
  await Promise.all(
    vaults.map((vault) => {
      return SiteUtils.copyAssets({ wsRoot, vault, siteAssetsDir });
    })
  );
}

module.exports = { copyAssets };

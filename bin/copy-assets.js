const { SiteUtils } = require("@dendronhq/engine-server");
const fs = require("fs-extra");
const path = require("path");
const {
  env,
  getDendronConfig,
  logger,
  getSiteOutputPath,
  getSiteConfig,
  getCustomHeaderOutput,
} = require("../libs/utils");

async function copyAssets() {
  const ctx = "copyAssets";
  const wsRoot = env.wsRoot;
  const config = getDendronConfig();
  const vaults = config.vaults;
  const siteAssetsDir = path.join(getSiteOutputPath(), "assets");
  // copy site assets
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
  // get raw-assets
  const rawAssetPath = path.join(__dirname, "..", "raw-assets");
  fs.copySync(rawAssetPath, path.join(getSiteOutputPath(), "raw-assets"));
  // get custom header
  if (config.site.customHeaderPath) {
    const headerPath = path.join(wsRoot, getSiteConfig().customHeaderPath);
    if (fs.existsSync(headerPath)) {
      fs.copySync(headerPath, getCustomHeaderOutput());
    }
  }
  // get favicon
  const faviconPath = path.join(wsRoot, getSiteConfig().siteFaviconPath);
  if (fs.existsSync(faviconPath)) {
    fs.copySync(faviconPath, path.join(getSiteOutputPath(), "favicon.ico"));
  }
  // get logo
  if (getSiteConfig().logo) {
    const logoPath = path.join(wsRoot, getSiteConfig().logo);
    fs.copySync(
      logoPath,
      path.join(getSiteOutputPath(), path.basename(logoPath))
    );
  }
  // /get cname
  if (getSiteConfig().githubCname) {
    fs.writeFileSync(
      path.join(getSiteOutputPath(), "CNAME"),
      getSiteConfig().githubCname,
      { encoding: "utf8" }
    );
  }
}

module.exports = { copyAssets };

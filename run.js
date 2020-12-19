const { compile } = require("@dendronhq/dendron-11ty");

// process.env["ENGINE_PORT"] = _.toString(port);
// process.env["WS_ROOT"] = wsRoot;
// process.env["STAGE"] = stage;
const serve = process.env["SERVE"] || false;
await compile({ cwd: "." }, { serve, input: "." });
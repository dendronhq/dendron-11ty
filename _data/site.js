const path = require("path");
const {getSiteConfig} = require(path.join(
    __dirname,
    "..",
    "libs",
    "utils.js"
  ));

module.exports = function () {
    return getSiteConfig();
};
  
// module.exports = function () {
//   return {
//     title: "Dendron",
//     url: "",
//     logo: "/assets/images/logo.png",
//     // TODO: deprecate
//     notePrefix: "/notes/",
//     search_enabled: true,
//     pages: [
//       {
//         children: "",
//         url: "node_url",
//       },
//     ],
//   };
// };

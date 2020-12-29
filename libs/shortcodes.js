const remarkRehype = require("remark-rehype");
const rehypeStringify = require("rehype-stringify");
const raw = require("rehype-raw");
const { MDUtilsV4, DendronASTDest } = require("@dendronhq/engine-server");
const path = require("path");
const { DateTime } = require("luxon");
const {
  getEngine,
  getSiteConfig,
  getDendronConfig,
  NOTE_UTILS,
  getNavOutput,
  getMetaPath,
  env
} = require("./utils");
const fs = require("fs");
const _ = require("lodash");
const xmlFiltersPlugin = require('eleventy-xml-plugin')

async function formatNote(note) {
  const layout = _.get(note, "custom.layout", false);
  // if (layout === "single") {
  //   return "single"
  // } else {
    return toMarkdown2(note.body, note.vault, note.fname);
  // }
}

function ms2Date(ts) {
  const dt = DateTime.fromMillis(ts);
  //return dt.toLocaleString(DateTime.DATETIME_HUGE)
  return dt.toJSDate();
}

async function markdownfy(contents) {
  const proc = MDUtilsV4.remark();
  return await MDUtilsV4.procRehype({proc}).process(contents);
}
async function toMarkdown2(contents, vault, fname) {
  const absUrl = NOTE_UTILS.getAbsUrl();
  const config = getDendronConfig();
  const sconfig = getSiteConfig();
  const siteNotesDir = sconfig.siteNotesDir;
  const linkPrefix = absUrl + "/" + siteNotesDir + "/";
  const engine = await getEngine();
  const wikiLinksOpts = { useId: true, prefix: linkPrefix };
  const proc = MDUtilsV4.procFull({
    engine,
    dest: DendronASTDest.HTML,
    vault,
    fname,
    wikiLinksOpts,
    noteRefOpts: { wikiLinkOpts: wikiLinksOpts, prettyRefs: true },
    publishOpts: {
      assetsPrefix: (env.stage === "prod") ? sconfig.assetsPrefix : undefined,
      insertTitle: config.useFMTitle
    },
    mathOpts: {katex: true}
  });
  return MDUtilsV4.procRehype({proc, mathjax: true}).process(contents);
}


let _NAV_CACHE = undefined;

function toNav() {
  let ts;
  if (!fs.existsSync(getMetaPath)) {
    ts = -1;
  } else {
    ts = fs.readFileSync(getMetaPath(), {encoding: "utf-8"})
  }
  if (!_NAV_CACHE || _NAV_CACHE[0] !== ts) {
    _NAV_CACHE = [ts, fs.readFileSync(getNavOutput(), {encoding: "utf-8"})];
  }
  return _NAV_CACHE[1];
}

function toToc(note, notesDict) {
  if (note.children.length <= 0) {
    return "";
  }
  const out = [`<hr>`, `<h2 class="text-delta">Table of contents</h2>`, `<ul>`];
  // copied from bin/build-nav.js
  let notesAtLevel = note.children.map((ent) => notesDict[ent]);
  notesAtLevel = _.filter(notesAtLevel, (ent) => {
    return !_.get(ent, "custom.nav_exclude", false);
  });
  notesAtLevel = _.sortBy(notesAtLevel, ["custom.nav_order", "title"]);
  const allLevels = _.map(notesAtLevel, (node) => {
    let level = [`<li>`];
    let href = NOTE_UTILS.getAbsUrl(NOTE_UTILS.getUrl(node));

    level.push(`<a href="${href}">${node.title}</a>`);
    level.push(`</li>`);
    return level;
  });
  return _.flatMap(out.concat(allLevels).concat(["</ul>"])).join("\n");
}

function genTemplate(node) {
  let out = [];
  
  /*
{% if post.header.teaser %}
  {% capture teaser %}{{ post.header.teaser }}{% endcapture %}
{% else %}
  {% assign teaser = site.teaser %}
{% endif %}

{% if post.id %}
  {% assign title = post.title | markdownify | remove: "<p>" | remove: "</p>" %}
{% else %}
  {% assign title = post.title %}
{% endif %}
*/
let include = {};
out.push(`<div class="${include.type || "list"}__item">`);
out.push(`<article class="archive__item" itemscope itemtype="https://schema.org/CreativeWork">`);
/*
    {% if include.type == "grid" and teaser %}
      <div class="archive__item-teaser">
        <img src="{{ teaser | relative_url }}" alt="">
      </div>
    {% endif %}
  */
 out.push(`<h2 class="archive__item-title no_toc" itemprop="headline">`);

      // {% if post.link %}
      //   <a href="{{ post.link }}">{{ title }}</a> <a href="{{ post.url | relative_url }}" rel="permalink"><i class="fas fa-link" aria-hidden="true" title="permalink"></i><span class="sr-only">Permalink</span></a>
      // {% else %}
    let href = NOTE_UTILS.getAbsUrl(NOTE_UTILS.getUrl(node));
  out.push(`<a href="${href}" rel="permalink">${ node.title }</a>`);
      // {% endif %}
  out.push(`</h2>`);
  out.push(`<p class="page__meta"><i class="far fa-clock" aria-hidden="true"></i> ${node.custom.date}</p>`);
  /*
    {% if post.read_time %}
      <p class="page__meta"><i class="far fa-clock" aria-hidden="true"></i> {% include read-time.html %}</p>
    {% endif %}
    */
   if (_.get(node, "custom.excerpt", false)) {
    out.push(`<p class="archive__item-excerpt" itemprop="description">${node.custom.excerpt}</p>`);
   }
  out.push(`</article></div>`);
  return out.join("\n");
}


function toCollection(note, notesDict) {
  if (note.children.length <= 0) {
    return [];
  }
  let children = note.children.map(id => notesDict[id])
  children = _.sortBy(children, "created");
  if (_.get(note, "custom.sort_order", "normal") === "reverse") {
    children = _.reverse(children);
  }

  return children.map(ch => genTemplate(ch)).join("\n");
  // if (note.children.length <= 0) {
  //   return "";
  // }
  // const out = [`<hr>`, `<h2 class="text-delta">Table of contents</h2>`, `<ul>`];
  // // copied from bin/build-nav.js
  // let notesAtLevel = note.children.map((ent) => notesDict[ent]);
  // notesAtLevel = _.filter(notesAtLevel, (ent) => {
  //   return !_.get(ent, "custom.nav_exclude", false);
  // });
  // notesAtLevel = _.sortBy(notesAtLevel, ["custom.nav_order", "title"]);
  // const allLevels = _.map(notesAtLevel, (node) => {
  //   let level = [`<li>`];
  //   let href = NOTE_UTILS.getAbsUrl(NOTE_UTILS.getUrl(node));

  //   level.push(`<a href="${href}">${node.title}</a>`);
  //   level.push(`</li>`);
  //   return level;
  // });
  // return _.flatMap(out.concat(allLevels).concat(["</ul>"])).join("\n");
}


module.exports = {
  configFunction: function (eleventyConfig, options = {}) {
    eleventyConfig.addPairedShortcode("markdown", toMarkdown2);
    eleventyConfig.addLiquidShortcode("dendronMd", formatNote);
    eleventyConfig.addLiquidShortcode("nav", toNav);
    eleventyConfig.addLiquidFilter("toToc", toToc);
    eleventyConfig.addLiquidFilter("ms2Date", ms2Date);
    eleventyConfig.addLiquidFilter("markdownify", markdownfy);
    eleventyConfig.addLiquidFilter("toCollection", toCollection);
    eleventyConfig.addPlugin(xmlFiltersPlugin)
  },
};

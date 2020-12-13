fs = require('fs')
path = require("path")

async function buildSearch() {
  // Inside the function for async/await functionality.
  const site = await require('../_data/site.js')();

  const noteData = fs.readFileSync(path.join(__dirname, "../_data/notes.json"), 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    return data
  });

  const search_data = JSON.parse(noteData).map((note, idx) => {
    const noteUrl = `/docs/${note.id}.html`
    return {
      doc: note.title,
      title: note.title,
      hpath: note.fname,
      content: note.body,
      url: `${site.url}${noteUrl}`,
      relUrl: noteUrl
    }
  })

  fs.writeFileSync('./_data/search-data.js', JSON.stringify(search_data))

  // Create the assets/js directory if it hasn't already been created.
  if (!fs.existsSync(path.join(__dirname, "../_site/assets/js/"))) {
    fs.mkdirSync(path.join(__dirname, "../_site/assets/js/"), 0744)
  }

  // Copies over the lunr library.
  if (!fs.existsSync(path.join(__dirname, "../_site/assets/js/lunr.min.js"))) {
    fs.copyFileSync(path.join(__dirname, "../assets/js/vendor/lunr.min.js"), path.join(__dirname, "../_site/assets/js/lunr.min.js"))
  }
}

module.exports = { buildSearch }

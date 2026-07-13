const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "..", ".output", "public");
const indexHtml = path.join(publicDir, "index.html");

if (fs.existsSync(indexHtml)) {
  console.log("index.html already exists, skipping.");
  process.exit(0);
}

// Find the actual asset filenames (they can change per build)
const assetsDir = path.join(publicDir, "assets");
const files = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];

const cssFile = files.find((f) => f.startsWith("styles-") && f.endsWith(".css"));
const indexJs = files.find((f) => f.startsWith("index-") && f.endsWith(".js"));

if (!cssFile || !indexJs) {
  console.error("Could not find CSS or JS bundle. Assets found:", files.join(", "));
  process.exit(1);
}

const html = `<!DOCTYPE html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gaji Harian</title>
    <link rel="icon" href="/favicon.ico" />
    <link rel="stylesheet" href="/assets/${cssFile}" />
    <script type="module" crossorigin src="/assets/${indexJs}"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

fs.writeFileSync(indexHtml, html);
console.log("index.html created with", cssFile, "and", indexJs);
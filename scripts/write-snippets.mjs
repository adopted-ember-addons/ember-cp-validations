import * as fs from "fs";
import * as path from "path";

const extractAndAppendSnippets = (filepath, snippetsData) => {
  console.log(filepath);
  let content = fs.readFileSync(filepath, "utf-8");
  let rows = content.split("\n");

  while (rows.length) {
    let row = rows.shift();
    let match = row.match(/BEGIN-SNIPPET ([^\s*]+)/);
    if (match) {
      let snippetContent = [];
      while (rows.length) {
        row = rows.shift();
        if (/END-SNIPPET/.test(row)) {
          break;
        }
        snippetContent.push(row);
      }
      snippetsData[match[1]] = {
        source: filepath,
        content: snippetContent.join("\n"),
      };
    }
  }
};

const buildSnippetsListData = (dir, snippetsData = {}) => {
  const files = fs.readdirSync(dir);

  for (let file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      buildSnippetsListData(filepath, snippetsData);
    } else if (file !== "snippets.js" && file.match(/\.(js|hbs)$/)) {
      extractAndAppendSnippets(filepath, snippetsData);
    }
  }
};

let snippetsData = {};
buildSnippetsListData("tests/dummy/app/", snippetsData);

fs.writeSync(
  fs.openSync("tests/dummy/app/snippets.js", "w"),
  `export default ${JSON.stringify(snippetsData)}`,
  0,
  "utf8",
);

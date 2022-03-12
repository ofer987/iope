import TurndownService from "turndown";
import { join } from "path";
import { JSDOM } from "jsdom";
import { Dir, opendirSync, readFileSync, Dirent } from "fs";

class Html {
  readonly dom: JSDOM;

  get document(): Document {
    return this.dom.window.document;
  }

  get title(): string {
    return (this.document.querySelector("#title-text > a") as HTMLAnchorElement)?.textContent || "";
  }

  get htmlInformation(): string {
    return (this.document.querySelector("#content") as HTMLDivElement)?.innerHTML || "";
  }

  constructor(raw: string) {
    this.dom = new JSDOM(raw);
  }
}

let readHtmlFiles = (directory: string): string[] => {
  let results: string[] = [];
  let dir = opendirSync(directory);

  let file: Dirent | null;
  while (file = dir.readSync()) {
    file.isFile() && /\.html$/.test(file.name);
    let path = join(directory, file.name);
    console.log(path);

    let result = readFileSync(`${directory}/1.html`).toString();
    results.push(result);
  }

  return results;
}

let service = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
});
readHtmlFiles("html").forEach(item => {
  let html = new Html(item);
  let markdown = service.turndown(html.htmlInformation);

  console.log(html.title);
  console.log(markdown);
});

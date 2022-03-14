import TurndownService from "turndown";
import { join } from "path";
import { JSDOM } from "jsdom";
import { snakeCase, last, toNumber } from "lodash";
import { opendirSync, writeFileSync, readFileSync, Dirent, existsSync, mkdirSync, appendFileSync } from "fs";

class Markdown {
  readonly dom: JSDOM;

  get document(): Document {
    return this.dom.window.document;
  }

  get title(): string {
    return (this.document.querySelector("#title-text > a") as HTMLAnchorElement)?.textContent || "";
  }

  get body(): string {
    return (this.document.querySelector("#content > #main-content") as HTMLDivElement)?.innerHTML || "";
  }

  constructor(raw: string) {
    this.dom = new JSDOM(raw);
  }

  toString(): string {
    let markdown = service.turndown(this.body);

    return `# ${this.title}\n\n${markdown}`;
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

    try {
      let result = readFileSync(path).toString();
      results.push(result);
    } catch (error) {
      console.error(`Failed to read ${path}`);
    }
  }

  return results;
};

let writeMarkdownFile = (directory: string, input: Markdown): void => {
  let filename = `${snakeCase(input.title)}.md`;
  let path = join(directory, filename);

  console.log(`Creating ${path}`);

  if (!existsSync(directory)) {
    try {
      mkdirSync(directory, { recursive: true });
    } catch (error) {
      console.error(`Failed to create ${directory}`);
      process.exit(1);
    }
  }

  try {
    writeFileSync(path, input.toString());

    console.log("Success");
  } catch (error) {
    console.error(`Failed to create ${path}`);
    console.error("Continuing to next markdown file");
  }
};

let getCurrentExecution = (directory: string): number => {
  if (!existsSync(directory)) {
    try {
      mkdirSync(directory, { recursive: true });
    } catch (error) {
      console.error(`Failed to create ${directory}`);
      process.exit(1);
    }
  }

  const filename = "executions.txt";
  const filepath = join(directory, filename);
  if (!existsSync(filepath)) {
    try {
      writeFileSync(filepath, "0");
    } catch (error) {
      console.error(`Unable to create ${filepath}`);
      process.exit(1);
    }
  }

  let data: string;
  try {
    data = readFileSync(filepath).toString();
  } catch (error) {
    console.error("File does not exist");
    process.exit(1);
  }

  let executions = data.split("\n");
  let current = toNumber(last(executions)) + 1;
  try {
    appendFileSync(filepath, `\n${current}`);
  } catch (error) {
    console.error(`Failed to write to ${filepath}`);
    process.exit(1);
  }

  console.log(`Current Execution is: ${current}`);

  return current;
};

let service = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
});

const execution = getCurrentExecution("markdown");
const markdownDirectory = join("markdown", execution.toString());

const htmlDirectory = "html";

console.log(`Reading html files at "${htmlDirectory}"`);
readHtmlFiles(htmlDirectory).forEach(item => {
  console.log();

  let markdown = new Markdown(item);
  writeMarkdownFile(markdownDirectory, markdown);
});

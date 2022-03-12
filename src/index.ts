import TurndownService from "turndown";

let raw = process.stdin.read();

class Html {
  readonly raw: string;
  readonly document: Document;

  get title(): string {
    return (document.querySelector("#title-text > a") as HTMLAnchorElement).text;
  }

  get htmlInformation(): string {
    return (document.querySelector("#content") as HTMLDivElement).innerHTML;
  }

  constructor(raw: string) {
    this.raw = raw;
    this.document = new Document();
    this.document.createElement("html");
    let root = new HTMLElement();
    root.innerHTML = "<html><body><div>hello</div></body></html";
    this.document.appendChild(root);
    debugger;
    this.document.textContent;
  }
}

let service = new TurndownService();
service.turndown(raw);

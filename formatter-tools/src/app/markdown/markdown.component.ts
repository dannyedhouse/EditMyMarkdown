import { Component, OnInit, ViewChild} from '@angular/core';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';

@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss']
})
export class MarkdownComponent implements OnInit {
  @ViewChild('codeEditor', { static: false }) codeEditor: CodemirrorComponent;

  tools: tools[];

  constructor() { 
    
  }

  ngOnInit(): void {
    this.tools = [
      { type: "Undo", icon: "fas fa-undo"},
      { type: "Redo", icon: "fas fa-redo"},
      { type: "Bold", icon: "fas fa-bold"}, 
      { type: "Italic", icon: "fas fa-italic"},
      { type: "Strikethrough", icon: "fas fa-strikethrough"},
      { type: "Quote", icon: "fas fa-quote-left"},
      { type: "Emoji", icon: "fas fa-laugh"}
    ];
  }

  ngAfterViewInit() {
    setTimeout(() => this.runQuery());
  }

  runQuery() {
    const editor = this.codeEditor.codeMirror;

    editor.setSize("100%", "100%");
  }

  source_code = "# Formatter Tools - Markdown\n----\n1. Click me and edit the markdown.\n2. See rendered HTML!\n----\nReference:"
    +"\n#H1\n#H2\n#H3\n#H4\n#H5\n#H6\n\n**strong**\n*emphasis*\n"

  private bold() {
    console.log("test");
  }
}

export interface tools {
  type: string;
  icon: string;
}

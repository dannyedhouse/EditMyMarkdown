import { Component, OnInit, ViewChild, ElementRef, SecurityContext} from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import marked from 'marked';

@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss']
})
export class MarkdownComponent implements OnInit {
  @ViewChild('codeEditor', { static: false }) codeEditor: CodemirrorComponent;
  @ViewChild('preview', {static: true}) preview: ElementRef;

  tools: tools[];
  editor;

  constructor(private elementRef: ElementRef, private sanitizer: DomSanitizer) {}

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
    setTimeout(() => this.setPreview());
  }

  /**
   * Return the function for the tool type clicked
   * @param toolName Name of the tool which matches lowercase function
   */
  callFunction(toolName: string) {  
    var functionName = toolName.toLowerCase();
    if (this[functionName]) {
      return this[functionName]();
    }
  }

  /**
   * Update the preview when there is a change in the codemirror
   */
  updatePreview() {
    const editor = this.codeEditor.codeMirror;
    var md = marked.setOptions({gfm: true, breaks: true, smartyLists: true, smartpants: true, xhtml: true});
    this.preview.nativeElement.innerHTML = md.parse(editor.getValue());
  }

  /**
   * Sets the HTML preview to the rendered default source_code
   */
  private setPreview() {
    this.editor = this.codeEditor.codeMirror;
    this.editor.setSize("100%", "100%");
    var md = marked.setOptions({});
    this.preview.nativeElement.innerHTML = md.parse(this.editor.getValue());
  }

  undo() {
    this.editor.undo();
  }

  redo() {
    this.editor.redo();
  }

  bold() {
    var selection = this.editor.getSelection();
    var cursor = this.editor.getCursor();
    var line = this.editor.getLine(cursor.line);
    var pos = cursor.ch;
    var length = selection.length;

    if (selection == "") {      
      this.editor.setCursor(cursor.line, cursor.ch+2);
      this.editor.replaceSelection("**Bold**");
    } else if (line.charAt(pos) == "*" && line.charAt(pos+1) == "*" && line.charAt(pos-length-1) == "*" && line.charAt(pos-length-2) == "*") {
      this.editor.replaceRange(selection, {line: cursor.line, ch: pos-length-2}, {line: cursor.line, ch: pos+2});
    } else {
      this.editor.replaceSelection("**" + selection + "**");
    }
  }

  source_code = "# Formatter Tools - Markdown\n----\n1. Click me and edit the markdown.\n2. See rendered HTML!\n----\nReference:"
    +"\n#H1\n##H2\n###H3\n####H4\n#####H5\n######H6\n\n**strong**\n*emphasis*\n"
}

export interface tools {
  type: string;
  icon: string;
}

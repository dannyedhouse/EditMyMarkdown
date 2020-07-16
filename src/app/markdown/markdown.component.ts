import { Component, OnInit, ViewChild, ElementRef, SecurityContext, SimpleChanges} from '@angular/core';
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

  updatePreview() {
    const editor = this.codeEditor.codeMirror;
    var md = marked.setOptions({gfm: true, breaks: true, smartyLists: true, smartpants: true, xhtml: true});
    this.preview.nativeElement.innerHTML = md.parse(editor.getValue());
  }

  /**
   * Sets the HTML preview to the rendered default source_code
   */
  private setPreview() {
    const editor = this.codeEditor.codeMirror;
    editor.setSize("100%", "100%");
    var md = marked.setOptions({});
    this.preview.nativeElement.innerHTML = md.parse(editor.getValue());
  }

  source_code = "# Formatter Tools - Markdown\n----\n1. Click me and edit the markdown.\n2. See rendered HTML!\n----\nReference:"
    +"\n#H1\n##H2\n###H3\n####H4\n#####H5\n######H6\n\n**strong**\n*emphasis*\n"
}

export interface tools {
  type: string;
  icon: string;
}

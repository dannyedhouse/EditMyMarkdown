import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import { AppService, Emoji } from '../app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { KatexOptions } from 'ngx-markdown';

@Component({
  selector: 'app-markdown',
  templateUrl: './markdown.component.html',
  styleUrls: ['./markdown.component.scss'],
  providers: [AppService]
})
export class MarkdownComponent implements OnInit {
  @ViewChild('codeEditor', { static: false }) private codeEditor: CodemirrorComponent;
  @ViewChild('insert') private insertContent: NgbModal;
  @ViewChild('emoji') private emojiContent: NgbModal;
  @ViewChild('help') private helpContent: NgbModal;

  tools: tools[];
  shortcuts: any[];
  emojis: Emoji[] = [];
  preview: string = "";
  query: string = "";
  editor: CodeMirror.Editor;
  selection: string;
  cursor: CodeMirror.Position;
  line: string;
  pos: number = 0;
  length: number;
  ul: boolean = false;
  ol: boolean = false;
  tl: boolean = false;
  count: number;
  difference: number;
  linkAddress: string = "";
  linkTitle: string = "";
  mode: string = "";
  wordCount: number = 0;
  lineCount: number = 1;
  lineNum: number = 1;
  htmlWordCount: number = 1;
  hideEditor: boolean = false;
  display: string = "display";
  isOnMobile: boolean = false;
  editorTimeout: any;
  previewTimeout: any;
  syncEditor = false;
  syncPreview = false;

  public katexOptions: KatexOptions = {
    throwOnError: false,
    displayMode: true
  };

  /**
   * Map keys to functions
   */
  extraKeys = {
    Enter: () => this.enterKey(),
    "Ctrl-B": () => this.bold(),
    "Ctrl-I": () => this.italic(),
    "Shift-Ctrl-S": () => this.strikethrough(),
    "Ctrl-Q": () => this.quote(),
    "Shift-Ctrl-O": () => this.unordered_list(),
    "Shift-Ctrl-U": () => this.ordered_list(),
    "Shift-Ctrl-L": () => this.task_list(),
    "Shift-Ctrl--": () => this.horizontal_rule(),
  }

  constructor(private modalService: NgbModal, private service: AppService, private sanitizer: DomSanitizer, private cdRef: ChangeDetectorRef,
    private elRef: ElementRef) {}

  ngOnInit(): void {
    this.count = 1;
    this.tools = [
      { type: "Undo", icon: "fas fa-undo", break: false},
      { type: "Redo", icon: "fas fa-redo", break: true},
      { type: "Bold", icon: "fas fa-bold", break: false}, 
      { type: "Italic", icon: "fas fa-italic", break: false},
      { type: "Strikethrough", icon: "fas fa-strikethrough", break: false},
      { type: "Quote", icon: "fas fa-quote-left", break: false},
      { type: "Unordered List", icon: "fas fa-list-ul", break: false},
      { type: "Ordered List", icon: "fas fa-list-ol", break: false},
      { type: "Task List", icon: "fas fa-tasks", break: false},
      { type: "Horizontal Rule", icon: "fas fa-minus", break: true},
      { type: "H1", icon: "heading-icon h1", break: false},
      { type: "H2", icon: "heading-icon h2", break: false},
      { type: "H3", icon: "heading-icon h3", break: false},
      { type: "H4", icon: "heading-icon h4", break: false},
      { type: "H5", icon: "heading-icon h5", break: false},
      { type: "H6", icon: "heading-icon h6", break: true},
      { type: "Link", icon: "fas fa-link", break: false},
      { type: "Image", icon: "fas fa-image", break: false},
      { type: "Code", icon: "fas fa-code", break: false},
      { type: "Emoji", icon: "fas fa-laugh", break: true},
    ];
    this.shortcuts = [ // Keyboard shortcuts for help modal
      { key: "Ctrl + B", action: "Bold"},
      { key: "Ctrl + I", action: "Italic"},
      { key: "Ctrl + Q", action: "Quote"},
      { key: "Ctrl + Shift + S", action: "Strikethrough"},
      { key: "Ctrl + Shift + O", action: "Ordered List"},
      { key: "Ctrl + Shift + U", action: "Unordered List"},
      { key: "Ctrl + Shift + L", action: "Task List"},
      { key: "Ctrl + Shift + -", action: "Horizontal Rule"},
    ];
    this.getEmojisFromService();
    this.toggleMobile();
    
    window.onresize = () => {
      this.toggleMobile();
    } 
  }

  /**
   *  Hides the html preview if viewing on mobile (only if editor not hidden)
   */
  private toggleMobile(): void {
    this.isOnMobile = this.isMobile();
    if (this.isOnMobile) {
      if (this.hideEditor == false) {
        this.display = "none";
      }
    } else {
      this.hideEditor = false;
      this.display = "initial";
    }
  }
  
  /**
   * Checks if viewing on mobile (determined by bootstrap width of 992px)
   */
  private isMobile(): boolean {
    var width = document.documentElement.clientWidth;
    if (width < 992) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Get the list of Emojis from the app service, put into array of Emoji objects
   */
  private getEmojisFromService():void {
    this.service.getEmojis().subscribe(emoji => {
      for (const [key, value] of Object.entries(emoji)) {
        this.emojis.push({name: ":" + key + ":", url: value, active: false});
      }
    })
  }

  ngAfterViewInit() {
    setTimeout(() => this.setPreview());
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
  }

  /**
   * Return the function for the tool type clicked
   * @param toolName Name of the tool which matches lowercase function
   */
  callFunction(toolName: string) {  
    var functionName = toolName.toLowerCase().replace(/ /g,"_");
    if(functionName == "h1" || functionName == "h2" || functionName == "h3" || functionName == "h4" || functionName == "h5" || functionName == "h6") {
      var headingNum = parseInt(functionName.charAt(1));
      return this["heading"](headingNum);
    } else if (this[functionName]) {
      return this[functionName]();
    }
  }

  /**
   * Sets the HTML preview to the rendered default source_code
   */
  private setPreview(): void {
    this.editor = this.codeEditor.codeMirror;
    this.editor.setSize("100%", "100%");
    this.editor.focus();
    this.editor.refresh();
    this.line = this.editor.getLine(this.cursor.line);
    this.pos = this.editor.getCursor().ch;
    this.lineNum = this.editor.getCursor().line+1;
    this.lineCount = this.editor.lineCount();
    this.wordCount = this.getWordCount(this.editor);
    this.getHTMLStats();
    this.preview = this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(this.editor.getValue()));
  }

  /**
   * Update the preview when there is a change in the codemirror
   */
  updatePreview(): void {
    const editor = this.codeEditor.codeMirror;
    editor.focus();
    this.preview = this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(editor.getValue()));
    this.selection = editor.getSelection();
    this.cursor = editor.getCursor();
    this.line = editor.getLine(this.cursor.line);
    this.pos = this.cursor.ch;
    this.lineNum = this.cursor.line+1;
    this.length = this.selection.length;
    this.lineCount = editor.lineCount();
    this.wordCount = this.getWordCount(editor);
    this.getHTMLStats();
  }

  /**
   * Return the word count from document
   */
  getWordCount(editor): number {
    var doc = editor.getDoc().getValue();
    if (doc.length == 0) {
      return 0;
    }
    return doc.trim().replace(/\s+/gi, ' ').split(' ').length;
  }

  /**
   * Get the line and word count from rendered HTML
   */
  getHTMLStats(): void {
    var doc = document.getElementById('preview').innerText;
    this.htmlWordCount = doc.trim().replace(/\s+/gi, ' ').split(' ').length;
  }

  /**
   * Called each time the editor is scrolled, syncronises the scroll position of the preview div
   */
  scrollEditor() {
    const previewDiv = this.elRef.nativeElement.querySelectorAll(".markdown-body");
    const preview = previewDiv[0] as HTMLElement;

    clearTimeout(this.editorTimeout);
    if (!this.syncEditor) {
      this.syncPreview = true;

      var height = this.editor.getScrollInfo().height - this.editor.getScrollInfo().clientHeight;
      var ratio  = parseFloat(this.editor.getScrollInfo().top) / height;
      var pos = (preview.scrollHeight - preview.clientHeight) * ratio;
      preview.scrollTop = pos;
    }
    this.editorTimeout = setTimeout(() => this.syncPreview = false, 25);
  }

  /**
   * Called each time the preview is scrolled, syncronises the scroll position of the editor
   */
  scrollPreview() {
    const previewDiv = this.elRef.nativeElement.querySelectorAll(".markdown-body");
    const preview = previewDiv[0] as HTMLElement;

    clearTimeout(this.previewTimeout);
    if (!this.syncPreview) {
      this.syncEditor = true;

      var height = preview.scrollHeight - preview.clientHeight;
      var ratio  = preview.scrollTop / height;
      var pos = (this.editor.getScrollInfo().height - this.editor.getScrollInfo().clientHeight) * ratio;
      this.editor.scrollTo(0, pos);
    }
    this.previewTimeout = setTimeout(() => this.syncEditor = false, 25);
  }

  /**
   * Called when enter key is pressed, will add a new line followed by the markdown
   * syntax for one of the lists if this is currently toggled.
   */
  private enterKey() {
    if (this.ul == true && this.ul !==null) {
      this.editor.replaceSelection("\n- ");
    } else if (this.ol == true && this.ol !==null) {
      this.count++;
      if ((this.cursor.line+1 - this.count) == this.difference) {
        this.editor.replaceSelection("\n"+this.count+". ");
      } else {
        this.ordered_list();
        this.editor.replaceSelection("\n");
      }
    } else if (this.tl == true && this.tl !==null) {
      this.editor.replaceSelection("\n- [X] ");
    } else {
      this.editor.replaceSelection("\n");
    }
  }

  undo(): void {
    this.editor.undo();
  }

  redo(): void {
    this.editor.redo();
  }

  bold(): void {
    if (this.selection == "") {   
      this.editor.replaceSelection("**Bold**");
      this.editor.setSelection({line: this.cursor.line, ch: this.cursor.ch-6}, {line: this.cursor.line, ch: this.cursor.ch-2});
    } else if (this.line.charAt(this.pos) == "*" && this.line.charAt(this.pos+1) == "*" && this.line.charAt(this.pos-this.length-1) == "*" && this.line.charAt(this.pos-this.length-2) == "*") {
      this.editor.replaceRange(this.selection, {line: this.cursor.line, ch: this.pos-this.length-2}, {line: this.cursor.line, ch: this.pos+2});
    } else if (this.line.charAt(this.pos-1) == "*" && this.line.charAt(this.pos-2) == "*" && this.line.charAt(this.pos+this.length) == "*" && this.line.charAt(this.pos+this.length+1) == "*") {
      this.editor.replaceRange(this.selection, {line: this.cursor.line, ch: this.pos+this.length+2}, {line: this.cursor.line, ch: this.pos-2});
    } else {
      this.editor.replaceSelection("**" + this.selection + "**");
    }
  }

  italic(): void {
    if (this.selection == "") {      
      this.editor.replaceSelection("*Italic*");
      this.editor.setSelection({line: this.cursor.line, ch: this.cursor.ch-7}, {line: this.cursor.line, ch: this.cursor.ch-1});
    } else if (this.line.charAt(this.pos) == "*" && this.line.charAt(this.pos-this.length-1) == "*") {
      this.editor.replaceRange(this.selection, {line: this.cursor.line, ch: this.pos-this.length-1}, {line: this.cursor.line, ch: this.pos+1});
    } else if (this.line.charAt(this.pos-1) == "*" && this.line.charAt(this.pos+this.length) == "*") {
      this.editor.replaceRange(this.selection, {line: this.cursor.line, ch: this.pos+this.length+1}, {line: this.cursor.line, ch: this.pos-1});
    } else {
      this.editor.replaceSelection("*" + this.selection + "*");
    }
  }

  strikethrough(): void {
    if (this.selection == "") {      
      this.editor.replaceSelection("~~Strikethrough~~");
      this.editor.setSelection({line: this.cursor.line, ch: this.cursor.ch-15}, {line: this.cursor.line, ch: this.cursor.ch-2});
    } else if (this.line.charAt(this.pos) == "~" && this.line.charAt(this.pos+1) == "~" && this.line.charAt(this.pos-this.length-1) == "~" && this.line.charAt(this.pos-this.length-2) == "~") {
      this.editor.replaceRange(this.selection, {line: this.cursor.line, ch: this.pos-this.length-2}, {line: this.cursor.line, ch: this.pos+2});
    } else if (this.line.charAt(this.pos-1) == "~" && this.line.charAt(this.pos-2) == "~" && this.line.charAt(this.pos+this.length) == "~" && this.line.charAt(this.pos+this.length+1) == "~") {
      this.editor.replaceRange(this.selection, {line: this.cursor.line, ch: this.pos+this.length+2}, {line: this.cursor.line, ch: this.pos-2});
    } else {
      this.editor.replaceSelection("~~" + this.selection + "~~");
    }
  }
  
  quote(): void {
    if (this.selection == "") {      
      this.editor.replaceSelection(">Quote");
      this.editor.setSelection({line: this.cursor.line, ch: this.cursor.ch-5}, {line: this.cursor.line, ch: this.cursor.ch});
    } else if (this.line.charAt(this.pos-this.length-1) == ">") {
      this.editor.replaceRange(this.selection, {line: this.cursor.line, ch: this.pos-this.length-1}, {line: this.cursor.line, ch: this.pos+1});
    } else if (this.line.charAt(this.pos-1) == ">") {
      this.editor.replaceRange(this.selection, {line: this.cursor.line, ch: this.pos+this.length}, {line: this.cursor.line, ch: this.pos-1});
    } else {
      this.editor.replaceSelection(">" + this.selection);
    }
  }

  unordered_list(): void {
    this.ul = !this.ul;
    if (this.selection == "") {      
      if (this.ul) {
        this.editor.replaceSelection("- ");
      }
      this.editor.setCursor(this.cursor.line, this.cursor.ch + 2);
    } else {
      this.editor.replaceSelection("- " + this.selection);
    }
  }

  ordered_list(): void {
    this.ol = !this.ol;
    this.count = 1;
    this.difference = this.cursor.line - 1;
    if (this.selection == "") {      
      if (this.ol) {
        this.editor.replaceSelection("1. ");
      }
      this.editor.setCursor(this.cursor.line, this.cursor.ch + 2);
    } else {
      this.editor.replaceSelection("1. " + this.selection);
    }
  }

  task_list(): void {
    this.tl = !this.tl;
    if (this.selection == "") {      
      if (this.tl) {
        this.editor.replaceSelection("- [ ] ");
      }
      this.editor.setCursor(this.cursor.line, this.cursor.ch + 2);
    } else {
      this.editor.replaceSelection("\n- [ ] " + this.selection);
    }
  }

  horizontal_rule(): void {
    if (this.selection == "") {
      if (this.line.length !=0) {
        this.editor.replaceSelection("\n---\n");
      } else {
        this.editor.replaceSelection("---\n");
      } 
    } else {
      this.editor.replaceSelection("\n---\n");
    }
  }

  heading(n: number): void {
    var hashtag = "#".repeat(n);

    if (this.line.length ==0) { 
      this.editor.setCursor(this.cursor.line, this.cursor.ch+2);
      this.editor.replaceSelection(hashtag + " H" + n.toString()); 
    } else {
      this.editor.setCursor(this.cursor.line, 0);
      this.editor.replaceSelection(hashtag + " ");
    }
  }

  link(): void {
    this.mode = "Link";
    this.modalService.open(this.insertContent, {scrollable: true, centered: true});
  }

  image(): void {
    this.mode = "Image";
    this.modalService.open(this.insertContent, {scrollable: true, centered: true});
  }

  code(): void {
    if (this.selection == "") {      
      this.editor.replaceSelection("`Type code here`");
      this.editor.setSelection({line: this.cursor.line, ch: this.cursor.ch-15}, {line: this.cursor.line, ch: this.cursor.ch-1});
    } else if (this.line.charAt(this.pos) == "`" && this.line.charAt(this.pos-this.length-1) == "`") {
      this.editor.replaceRange(this.selection, {line: this.cursor.line, ch: this.pos-this.length-1}, {line: this.cursor.line, ch: this.pos+1});
    } else if (this.line.charAt(this.pos-1) == "`" && this.line.charAt(this.pos+this.length) == "`") {
      this.editor.replaceRange(this.selection, {line: this.cursor.line, ch: this.pos+this.length+1}, {line: this.cursor.line, ch: this.pos-1});
    } else {
      this.editor.replaceSelection("`" + this.selection + "`");
    }
  }
  
  helpModal(): void {
    this.modalService.open(this.helpContent, {scrollable: true, centered: true, windowClass: "lg-modal"});
  }

  emoji(): void {
    this.modalService.open(this.emojiContent, {scrollable: true, centered: true, windowClass: "lg-modal"});
  }

  /**
   * Insert link/image
   */
  insertLink(): void {
    if (this.linkTitle == "")
      this.linkTitle = this.linkAddress;

    var linkStr = "[" + this.linkTitle + "]" + "(" + this.linkAddress + ")";
    if (this.mode == "Image") {
      linkStr = "!" + linkStr;
    }

    if (this.selection == "") {      
      this.editor.setCursor(this.cursor.line, this.cursor.ch+2);
      this.editor.replaceSelection(linkStr);
    } else {
      this.editor.replaceSelection(linkStr);
    }
    this.closeModal();
  }

  closeModal(): void {
    this.query = "";
    this.linkAddress = "";
    this.linkTitle = "";
    this.modalService.dismissAll();
  }

  /**
   * Insert emoji code if active property is set to true
   */
  insertEmoji(): void {
    this.emojis.forEach(emoji => {
      if (emoji.active === true) {
        if (this.selection == "") {      
          this.editor.setCursor(this.cursor.line, this.cursor.ch+2);
          this.editor.replaceSelection(emoji.name);
        } else {
          this.editor.replaceSelection(emoji.name);
        }
        emoji.active = false;
      }
    });
    this.closeModal();
  }

  /**
   * Toggle the active property each time method is called
   * @param emoji Emoji selected
   */
  selectEmoji(emoji: Emoji): void {
    emoji.active = !emoji.active;
  }

  /**
   * Filter the emojis by search query
   */
  filter(): void {
    let term = this.query;
    const emojisCopy  = Object.assign([], this.emojis);
    this.emojis = emojisCopy.filter(function(tag) {
        return tag.name.indexOf(term) >= 0;
    }); 
  }

  /**
   * Toggle between showing the HTML preview/editor (only on mobile)
   */
  showPreview(): void {
    this.hideEditor = !this.hideEditor;
    if (this.hideEditor) {
      this.display = "initial";
    } else {
      this.display = "none";
    }
  }

  source_code = "# Welcome to EditMyMarkdown\n\n1. Click me and edit the markdown.\n2. See rendered HTML!\n----\nReference:"
    +"\n# H1\n## H2\n### H3\n#### H4\n##### H5\n###### H6\n\n**strong**\n*emphasis*"
}

export interface tools {
  type: string;
  icon: string;
  break: boolean; // Divider
}

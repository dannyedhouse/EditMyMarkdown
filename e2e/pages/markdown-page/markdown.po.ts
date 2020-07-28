import { browser, by, element, ElementFinder } from 'protractor';

export class MarkdownPage {
  navigateTo(): Promise<unknown> {
    return browser.get('/markdown') as Promise<unknown>;
  }

  getUndoButton(): ElementFinder {
    return element(by.css('i.fa-undo.fas'));
  }
}

import { MarkdownPage } from './markdown.po';
import { browser, logging } from 'protractor';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';

describe('Markdown Page', () => {
  let page: MarkdownPage;

  beforeEach(() => {
    page = new MarkdownPage();
    page.navigateTo();
  });
  
  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});

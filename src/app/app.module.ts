import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownComponent } from './markdown/markdown.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { SanitizeHtmlPipe } from './sanitize-html.pipe';
import { FilterPipe } from './filter.pipe';
import { AppService } from './app.service';

@NgModule({
  declarations: [
    AppComponent,
    MarkdownComponent,
    HeaderComponent,
    FooterComponent,
    SanitizeHtmlPipe,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    CodemirrorModule,
    HttpClientModule,
    MarkdownModule.forRoot({
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true,
          breaks: true,
          pedantic: false,
          smartLists: true,
          smartypants: true
        },
    }})
  ],
  exports: [
    HeaderComponent,
    FooterComponent
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkdownComponent } from './markdown.component';
import { AppService } from '../app.service';
import { HttpClientModule } from '@angular/common/http';

describe('MarkdownComponent', () => {
  let component: MarkdownComponent;
  let fixture: ComponentFixture<MarkdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [AppService],
      declarations: [ MarkdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});

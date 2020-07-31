import { TestBed } from '@angular/core/testing';
import { AppService } from './app.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';

describe('AppService', () => {
  let service: AppService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [AppService]
    });
    service = TestBed.inject(AppService);
    httpMock = TestBed.get(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should receive API requests', () => {
    service.getEmojis().subscribe(emojis => {
      expect(emojis.length).toBeGreaterThan(1);
    });
  });
});

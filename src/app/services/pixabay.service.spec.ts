import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PixabayService } from './pixabay.service';

describe('PixabayService', () => {
  let service: PixabayService;
  let httpMock: HttpTestingController;

  const mockResponse = {
    totalHits: 1,
    hits: [
      {
        id: 123,
        webformatURL: 'https://pixabay.com/photo1.jpg',
        tags: 'travel, landscape'
      }
    ]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PixabayService]
    });

    service = TestBed.inject(PixabayService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // vérifie qu'aucune requête en attente ne subsiste
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getImages and return data', () => {
    const query = 'paris';

    service.getImages(query).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const expectedUrl = `https://pixabay.com/api/?key=23459976-ec7f6f525f2daeb3ba00da7ee&q=paris%20travel%20landscape&category=travel&image_type=photo&orientation=horizontal&per_page=5`;

    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse); // simule une réponse de l'API
  });
});

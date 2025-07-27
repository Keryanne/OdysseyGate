import { TestBed } from '@angular/core/testing';
import { CitiesService } from './cities.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CitiesService', () => {
  let service: CitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

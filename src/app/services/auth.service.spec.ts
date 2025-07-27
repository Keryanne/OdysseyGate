import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Vérifie qu'aucune requête HTTP n’est en attente
    localStorage.clear(); // Réinitialise localStorage après chaque test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request on login()', () => {
    const mockResponse = { token: 'test-token' };

    service.login('email@test.com', 'pass123').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'email@test.com',
      password: 'pass123'
    });

    req.flush(mockResponse);
  });

  it('should send POST request on register()', () => {
    const mockResponse = { message: 'registered' };

    service.register('John', 'Doe', 'john@example.com', 'abc', 'abc').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      nom: 'John',
      prenom: 'Doe',
      email: 'john@example.com',
      password: 'abc',
      confirmPassword: 'abc'
    });

    req.flush(mockResponse);
  });

  it('should return user ID from token', () => {
    const fakePayload = { id: 123 };
    const base64Payload = btoa(JSON.stringify(fakePayload));
    const fakeToken = `header.${base64Payload}.signature`;

    localStorage.setItem('token', fakeToken);
    const id = service.getUserIdFromToken();
    expect(id).toBe(123);
  });

  it('should return null if token is invalid', () => {
    localStorage.setItem('token', 'invalid.token.structure');
    const id = service.getUserIdFromToken();
    expect(id).toBeNull();
  });

  it('should return true if token exists', () => {
    localStorage.setItem('token', 'fake');
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should return false if token is missing', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should remove token on logout', () => {
    localStorage.setItem('token', 'fake');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
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
    httpMock.verify();
    localStorage.clear();
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

  it('should return 0 if token is invalid', () => {
    localStorage.setItem('token', 'invalid.token.structure');
    const id = service.getUserIdFromToken();
    expect(id).toBe(0);
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

  it('should GET user by id', () => {
    const mockUser = { id: 1, nom: 'John', prenom: 'Doe', email: 'john@example.com' };
    service.getUserById(1).subscribe((res: any) => {
      expect(res).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/auth/user/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should GET current user', () => {
    const mockUser = { id: 2, nom: 'Jane', prenom: 'Doe', email: 'jane@example.com' };
    service.getUser().subscribe((res: any) => {
      expect(res).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/auth/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });
});
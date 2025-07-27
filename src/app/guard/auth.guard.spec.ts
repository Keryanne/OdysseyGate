import { AuthGuard } from './auth.guard';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jest.Mocked<AuthService>;
  let router: Router;

  beforeEach(() => {
    const authServiceMock: Partial<jest.Mocked<AuthService>> = {
      isLoggedIn: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));
  });

  it('should allow route activation if user is logged in', () => {
    authService.isLoggedIn.mockReturnValue(true);
    const result = guard.canActivate({} as any, {} as any);
    expect(result).toBe(true);
  });

  it('should block route activation and redirect if user is not logged in', () => {
    authService.isLoggedIn.mockReturnValue(false);
    const result = guard.canActivate({} as any, {} as any);
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/tabs/login']);
  });
});

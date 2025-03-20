import { AuthGuard } from './auth.guard';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (route, state) =>
      TestBed.runInInjectionContext(() => {
        const guard = TestBed.inject(AuthGuard);
        return guard.canActivate(route, state);
      });

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

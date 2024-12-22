import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => AuthGuard(...guardParameters));

  let navigateSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
      ],
    });

    const router = TestBed.inject(Router);
    navigateSpy = router.navigate as jasmine.Spy;
  });

  it('should allow access if user is authenticated', () => {
    spyOn(localStorage, 'getItem').and.returnValue('mockToken');

    const result = executeGuard({} as any, {} as any);
    expect(result).toBeTrue();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should deny access and navigate to login if user is not authenticated', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);

    const result = executeGuard({} as any, {} as any);
    expect(result).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});

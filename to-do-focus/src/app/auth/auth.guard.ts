import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (!isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

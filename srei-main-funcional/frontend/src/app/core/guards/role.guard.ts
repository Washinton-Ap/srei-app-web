import { CanActivateFn } from '@angular/router';

export const roleGuard: CanActivateFn = (route) => {

  const roles = route.data['roles'];

  const userRoles = JSON.parse(
    localStorage.getItem('roles') || '[]'
  );

  return roles.some((r: string) =>
    userRoles.includes(r)
  );

};
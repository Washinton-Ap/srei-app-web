/*import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const token = localStorage.getItem('token');

  return token != null;

};

*/
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  //const token = localStorage.getItem('token');

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {

    if (this.auth.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

}
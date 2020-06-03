import { Injectable } from '@angular/core';
import {User} from '../../api/server/models';
import {MeteorObservable} from 'meteor-rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userRes: {};
  constructor(private router: Router) { }

  validateLogin(user: User) {
    /*return this.http.post('http://localhost:4000/login', {
      username : user.username,
      password : user.password
    });*/
     MeteorObservable.call('validateUser', user).subscribe(
      res => this.userRes = res,
      err => console.log(err)
    );
     return this.userRes;
  }

  loggedIn () {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');

  }

  logoutUser() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}

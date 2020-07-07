import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService} from '../auth.service';
import {User} from '../models/user.model';
import {MeteorObservable} from 'meteor-rxjs';
import {Meteor} from 'meteor/meteor';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user: User
  res: {};
  constructor(private authservice: AuthService, private router: Router) {
    this.user = new User();
  }

  validateLogin() {
    if (this.user.username && this.user.password) {
      /*this.authservice.validateLogin(this.user).subscribe(result => {
        console.log('result is ', result);
        /!*if(result['status'] === 'success') {*!/
        localStorage.setItem('token', result['token'])
        this.router.navigate(['/home']);
        /!*} else {
          alert('Wrong username password');
        }*!/

      }, error => {
        console.log('error is ', error);
      });*/
      /*this.res = this.authservice.validateLogin(this.user);
      console.log(this.res);*/
      MeteorObservable.call('validateUser', this.user).subscribe(
        res => {
          // console.log(res)
          this.user.role = res['role']
          this.user.email = res['email']
          // localStorage.setItem('token', res['token'])
          localStorage.setItem('currentUser', JSON.stringify(this.user))
          // console.log(JSON.parse(localStorage.getItem('currentUser')))
          this.router.navigate(['/home']);
        },
        err => console.log(err)
      );
    } else {
      alert('enter user name and password');
    }
  }
  ngOnInit() {
  }

}

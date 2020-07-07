import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MeteorObservable} from 'meteor-rxjs';
import {User} from '../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  // email: any;
  // username: string;
  // password: string;
  public user: User
  constructor(private router: Router) {
    this.user = new User();
  }

  register() {
    console.log(this.user.email, this.user.username, this.user.password);
    this.user.role = 'admin';
    MeteorObservable.call('addUser', this.user).subscribe(
      res => console.log(res),
      err => console.log(err)
    );
    this.router.navigate(['/']);
  }
  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user: User
  constructor() {
    this.user = new User();
  }

  validateLogin() {
    console.log(this.user.username, this.user.password);
  }
  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email: any;
  username: string;
  password: string;
  constructor(private router: Router) { }

  register() {
    console.log(this.email, this.username, this.password);
    this.router.navigate(['/']);
  }
  ngOnInit() {
  }

}

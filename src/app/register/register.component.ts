import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  email: any;
  username: string;
  password: string;
  constructor() { }

  register() {
    console.log(this.email, this.username, this.password);
  }
  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import {MeteorObservable} from 'meteor-rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard-settings',
  templateUrl: './dashboard-settings.component.html',
  styleUrls: ['./dashboard-settings.component.scss']
})
export class DashboardSettingsComponent implements OnInit {
  users = [];
  roles = [];
  constructor( private router: Router) { }

  getUsers() {
    MeteorObservable.call('getUsers').subscribe(
      res => {
        console.log(res);
        for (const key in res) {
          if (res.hasOwnProperty(key)) {
            this.users.push(res[key].username);
            this.roles.push(res[key].role);
          }
        }
        console.log(this.users);
        console.log(this.roles);
      },
      err => {
        console.log(err);
        alert('No users, Please register');
        this.router.navigate(['/register']);
      }
    );
  }
  ngOnInit() {
    this.getUsers();
  }

}

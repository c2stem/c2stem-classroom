import { Component, OnInit } from '@angular/core';
import {MeteorObservable, MongoObservable} from 'meteor-rxjs';
import {Users} from '../../../api/server/collections';
import {ObservableCursor} from 'meteor-rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {
  constructor(private route: ActivatedRoute) {

  }
  title = 'Users'
  getUsers() {
    MeteorObservable.call('getUsers').subscribe(
      res => {
        console.log(res);
      },
      err => console.log(err)
    );
  }

  ngOnInit() {
    this.getUsers();
  }

}

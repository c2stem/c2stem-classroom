import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-dashboard-progress',
  templateUrl: './dashboard-progress.component.html',
  styleUrls: ['./dashboard-progress.component.scss']
})
export class DashboardProgressComponent implements OnInit {

  constructor(private route: ActivatedRoute) {
    this.route.parent.params.subscribe(params => console.log(params));
  }

  ngOnInit() {
  }

}

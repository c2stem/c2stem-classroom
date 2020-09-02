import {Component, OnDestroy, OnInit} from '@angular/core';
import {MeteorObservable, MongoObservable} from 'meteor-rxjs';
import {Action, View} from '../../../api/server/models';
import {SpeechRecognitionService} from '../speech-recognition.service';
import {LoggingService} from '../logging.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [LoggingService]
})
export class DashboardComponent implements OnInit{
  constructor() {}
  ngOnInit() {}

}

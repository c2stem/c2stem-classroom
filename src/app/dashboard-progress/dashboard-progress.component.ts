import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SpeechRecognitionService} from '../speech-recognition.service';

@Component({
  selector: 'app-dashboard-progress',
  templateUrl: './dashboard-progress.component.html',
  styleUrls: ['./dashboard-progress.component.scss']
})
export class DashboardProgressComponent implements OnInit, OnDestroy {
  showSearchButton: boolean;
  speechData: string;
  constructor(private route: ActivatedRoute, private speechRecognitionService: SpeechRecognitionService) {
    this.route.parent.params.subscribe(params => console.log(params));
    this.showSearchButton = true;
    this.speechData = "";
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.speechRecognitionService.DestroySpeechObject();
  }

  activateSpeechSearch(): void {
    this.showSearchButton = false;

    this.speechRecognitionService.record()
      .subscribe(
        // listener
        (value) => {
          this.speechData = value;
          console.log(value);
        },
        // errror
        (err) => {
          console.log(err);
          if (err.error === 'no-speech') {
            console.log('--restatring service--');
            this.activateSpeechSearch();
          }
        },
        // completion
        () => {
          this.showSearchButton = true;
          console.log('--complete--');
        });
  }

  deactivateSpeechSearch() {
    this.speechRecognitionService.DestroySpeechObject();
  }
}

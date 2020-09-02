import { Component, OnInit, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {LoggingService} from '../logging.service';
import {MeteorObservable} from 'meteor-rxjs';
import {Actions} from '../../../api/server/collections/actions';
import {Action, View} from '../../../api/server/models';
import {AssessmentAction} from '../models/actionLogger.models';
import {SpeechRecognitionService} from '../speech-recognition.service';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css'],
  providers: [LoggingService]
})

export class AssessmentComponent implements OnInit, OnDestroy {
  assessForm: FormGroup;
  view: View;
  action: Action;
  value = '';
  id = '';
  boxId = '';
  submitted: string;
  constructor(private loggingService: LoggingService, private formBuilder: FormBuilder,
              private speechRecognitionService: SpeechRecognitionService) {
    this.speechData = '';
  }

  showSearchButton: boolean;
  speechData: string;

  ngOnInit() {
    this.assessForm = new FormGroup({
      'radio1_2_3_a': new FormControl(null),
      'radio1_2_3_b': new FormControl(null),
      'radio1_2_3_c': new FormControl(null),
      'radio1_2_3_d': new FormControl(null),
      'box1' : new FormControl(null),
      'box2' : new FormControl(null),
      'box3' : new FormControl(null)
    });
    const formValues = sessionStorage.getItem('assessForm');
    if (formValues) {
      this.applyFormValues(this.assessForm, JSON.parse(formValues));
    }

    this.
    assessForm.
    valueChanges.
    subscribe( assessForm => {
      sessionStorage.setItem('assessForm', JSON.stringify(assessForm));
    });
    this.activateSpeechSearch();
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
          this.view = this.loggingService.generateView('AssessmentView', 'none');
          this.action = this.loggingService.generateAction('SpeechToText', 'Text', value, this.view);
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
          this.activateSpeechSearch();
        });
  }

  onSubmit() {
    this.loggingService.logToConsole(this.assessForm.value);
    this.submitted = 'SubmitAction';
    this.view = this.loggingService.generateView('AssessmentView', 'none');
    const act = this.loggingService.assessmentAction('SubmitAction', 'Aseessment1submit', 'submitted', this.view);
    console.log('action logged', act);
    /*console.log('This is the result data.');
    console.log(Actions.find().fetch());*/
  }


  update(id:  string, value: string) {
    this.value = value;
    this.boxId = id;
    this.view = this.loggingService.generateView('AssessmentView', 'none');
    this.action = this.loggingService.generateAction('TextAction', this.boxId, this.value, this.view);
    console.log('action logged', this.action);
  }

  getRadio(id, clickvalue) {
    this.view = this.loggingService.generateView('AssessmentView', 'none');
    this.action = this.loggingService.generateAction('RadioAction', id, clickvalue, this.view);
    console.log('action logged', this.action);
  }

  private applyFormValues (group, formValues) {
    console.log('here in form application');
    Object.keys(formValues).forEach(key => {
      const formControl = group.controls[key];

      if (formControl instanceof FormGroup) {
        this.applyFormValues(formControl, formValues[key]);
      } else {
          formControl.setValue(formValues[key]);
      }
    });
  }
}

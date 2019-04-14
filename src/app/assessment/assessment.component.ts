import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {LoggingService} from '../logging.service';
import {Actions} from '../../../api/server/collections/actionLog';
import {MeteorObservable} from 'meteor-rxjs';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css'],
  providers: [LoggingService]
})
export class AssessmentComponent implements OnInit {
  assessForm: FormGroup;
  value = '';
  id = '';
  submitted: string;
  constructor(private loggingService: LoggingService, private formBuilder: FormBuilder) { }

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
    const formValues = sessionStorage.getItem('form');
    if (formValues) {
      this.applyFormValues(this.assessForm, JSON.parse(formValues));
    }

    this.
    assessForm.
    valueChanges.
    subscribe( assessForm => {
      sessionStorage.setItem('assessForm', JSON.stringify(assessForm));
    });
  }

  onSubmit() {
    this.loggingService.logToConsole(this.assessForm.value);
    this.submitted = "SubmitAction";
    MeteorObservable.call('addAction', this.submitted).subscribe(
      res => console.log(res),
      err => console.log(err)
    );
    console.log("This is the result data.")
    console.log(Actions.find().fetch());
  }


  update(value: string) {
    this.value = value;
    this.loggingService.logToConsole(value);
  }

  getRadio(id, clickvalue) {
    this.loggingService.logIdValueToConsole(id, clickvalue);
  }

  private applyFormValues (group, formValues) {
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

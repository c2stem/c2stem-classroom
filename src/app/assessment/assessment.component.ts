import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormBuilder} from '@angular/forms';
import {LoggingService} from '../logging.service';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css'],
  providers: [LoggingService]
})
export class AssessmentComponent implements OnInit {
  signupForm: FormGroup;
  value = '';
  id = '';
  clickvalue = '';

  constructor(private loggingService: LoggingService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      'radio1_2_3_a': new FormControl(null),
      'radio1_2_3_b': new FormControl(null),
      'radio1_2_3_c': new FormControl(null),
      'radio1_2_3_d': new FormControl(null),
      'box1' : new FormControl(null),
      'box2' : new FormControl(null),
      'box3' : new FormControl(null)
    });
    const formValues = sessionStorage.getItem('form');
    if(formValues) {
      this.applyFormValues(this.signupForm, JSON.parse(formValues));
    }

    this.
      signupForm.
      valueChanges.
      subscribe( form => {
        sessionStorage.setItem('form', JSON.stringify(form));
    });
  }

  onSubmit() {
    this.loggingService.logToConsole(this.signupForm.value);
  }

  update(value: string) {
    this.value = value;
    this.loggingService.logToConsole(value);
  }

  getRadio(id, clickvalue) {
    this.loggingService.logIdValueToConsole(id, clickvalue);
  }
  private applyFormValues (group, formValues){
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

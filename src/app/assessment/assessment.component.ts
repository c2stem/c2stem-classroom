import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.css']
})
export class AssessmentComponent implements OnInit {
  signupForm: FormGroup;
  value = '';
  id = '';
  clickvalue = '';
  constructor() { }

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
  }

  onSubmit() {
    console.log(this.signupForm.value);
  }

  update(value: string) { this.value = value;
  console.log(value);
  }

  getRadio(id, clickvalue) {

    console.log(id, clickvalue);
  }
}

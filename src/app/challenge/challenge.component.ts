import { Component, OnInit } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FormControl, FormGroup} from '@angular/forms';
import {LoggingService} from '../logging.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-challenge',
  templateUrl: './challenge.component.html',
  styleUrls: ['./challenge.component.scss'],
  providers: [LoggingService]
})
export class ChallengeComponent implements OnInit {

  events: string[] = [];
  opened: boolean;
  challengeForm: FormGroup;
  value = '';
  closeResult: string;
  constructor( private loggingService: LoggingService, private modalService: NgbModal) { }

  ngOnInit() {
    this.challengeForm = new FormGroup({
      'box1' : new FormControl(null)
    });
    const formValues = sessionStorage.getItem('challengeform');
    if (formValues) {
      this.applyFormValues(this.challengeForm, JSON.parse(formValues));
    }

    this.
    challengeForm.
    valueChanges.
    subscribe( challengeform => {
      sessionStorage.setItem('challengeform', JSON.stringify(challengeform));
    });
  }

  // logging on submit
  onSubmit() {
    this.loggingService.logToConsole(this.challengeForm.value);
  }

  update(value: string) {
    this.value = value;
    this.loggingService.logToConsole(value);
  }

  // modal open/close events listener
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      console.log('closed');
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // modal dismissal function
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  // on reload apply value from database to the form.
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


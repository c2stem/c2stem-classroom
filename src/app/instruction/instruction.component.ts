import { Component, OnInit } from '@angular/core';
import {LoggingService} from '../logging.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-instruction',
  templateUrl: './instruction.component.html',
  styleUrls: ['./instruction.component.css'],
  providers: [LoggingService]
})
export class InstructionComponent implements OnInit {

  events: string[] = [];
  opened: boolean;
  instructionForm: FormGroup;
  value = '';
  closeResult: string;
  constructor( private loggingService: LoggingService, private modalService: NgbModal) { }

  ngOnInit() {
    this.instructionForm = new FormGroup({
      'box1' : new FormControl(null)
    });
    const formValues = sessionStorage.getItem('instructionForm');
    if (formValues) {
      this.applyFormValues(this.instructionForm, JSON.parse(formValues));
    }

    this.
    instructionForm.
    valueChanges.
    subscribe( instructionForm => {
      sessionStorage.setItem('instructionForm', JSON.stringify(instructionForm));
    });
  }

  // logging on submit
  onSubmit() {
    this.loggingService.logToConsole(this.instructionForm.value);
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


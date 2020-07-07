import {View} from '../../../api/server/models';

export class AssessmentAction {

  constructor(
    actionID: string,
  timestamp: any,
  actionType?: string,
  actionName?: string,
  value?: string,
  view?: View
  ) { }
}

/*----add more models here----example
* For usage refer to assessment.component.ts*/

/*export class simpleBlock {
  ID: string;
  timestamp: any;
  Type?: string;
  Name?: string;
  value?: string;
  view?: View;
  constructor() {
    this.ID = '';
    this.timestamp = '';
    this.Type = '';
    this.Name = '';
    this.value = '';
    this.view = new View();
  }
}*/

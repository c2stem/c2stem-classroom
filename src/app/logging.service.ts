import {Action, View} from '../../api/server/models';
import {UUID} from 'angular2-uuid';
import {MeteorObservable} from 'meteor-rxjs';

const now = new Date();

export class LoggingService {
  action = new Action();
  view = new View();

  constructor() { }

  logToConsole(logMessage: string) {
    console.log(logMessage);
  }
  logIdValueToConsole(id: string, value: string) {
    console.log(id, value);
  }
  generateView(currentView: string, subView: string) {
    this.view.currentview = currentView;
    this.view.subview = subView;
    return this.view;
  }
  generateAction(actionType: string, actionName: string, value: string, view: View) {
    this.action.actionID = UUID.UUID();
    this.action.timestamp = now;
    this.action.actionType = actionType;
    this.action.actionName = actionName;
    this.action.value = value;
    this.action.view = view;
    MeteorObservable.call('addAction', this.action).subscribe(
      res => console.log(res),
      err => console.log(err)
    );
    return this.action;
  }
}


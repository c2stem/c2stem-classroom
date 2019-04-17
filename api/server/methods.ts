import {Action} from './models';
import {Actions} from './collections/actions';


Meteor.methods({

  addAction(action: Action) {
     return Actions.insert({
       actionID: action.actionID,
       timestamp: action.timestamp,
       actionType: action.actionType,
       actionName: action.actionName,
       value: action.value,
       view: action.view
     });
  }
});


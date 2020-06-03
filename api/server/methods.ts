import {Action, User} from './models';
import {Actions} from './collections/actions';
import {Users} from './collections';


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
  },

  validateUser(user: User) {
    return Users.find().fetch();
  }
});


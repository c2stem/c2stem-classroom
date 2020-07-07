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

  addUser(user: User) {
    return Users.insert({
      username: user.username,
      password: user.password,
      email: user.email,
      role: user.role
    });
  },
  validateUser(user: User) {
    // return Users.find().fetch();
    return Users.findOne({'username': user.username});
  },
  getUsers() {
    const usernames = [];
    const data = Users.find();
    data.forEach( function(datadoc) { usernames.push(datadoc); } );
    return usernames;

  }
});


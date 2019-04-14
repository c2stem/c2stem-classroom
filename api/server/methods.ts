import {Actions} from './collections/actionLog';

Meteor.methods({

  addAction(name: string) {
     return Actions.insert({
       name
     });
  }
});


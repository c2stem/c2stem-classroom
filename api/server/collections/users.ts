import {MongoObservable} from 'meteor-rxjs';
import {User} from '../models';

export const Users = new MongoObservable.Collection<User>('Users');

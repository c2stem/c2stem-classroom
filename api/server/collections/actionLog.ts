import {MongoObservable} from 'meteor-rxjs';
import {Action} from '../models';

export const Actions = new MongoObservable.Collection<Action>('actions');

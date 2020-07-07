export class User {
  username: string;
  password: string;
  role: Role;
  email?: string;
}

export class Action {
  actionID: string;
  timestamp: any;
  actionType?: string;
  actionName?: string;
  value?: string;
  view?: View;

}

export class View {
  currentview?: string;
  subview?: string;
}

export enum Role {
  User = 'User',
  Admin = 'ADmin'
}

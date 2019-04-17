export class User {
  username: string;
  password: string;
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

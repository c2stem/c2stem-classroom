import {BrowserModule} from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatNativeDateModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {UserComponent} from './user/user.component';
import { AssessmentComponent } from './assessment/assessment.component';
import { InquiryComponent } from './inquiry/inquiry.component';
import { ModelbuildComponent } from './modelbuild/modelbuild.component';
import { InstructionComponent } from './instruction/instruction.component';
import {HttpModule} from '@angular/http';
import { PlaygroundComponent } from './playground/playground.component';
import { HomeComponent } from './home/home.component';
import { ResourcesComponent } from './resources/resources.component';
import { IframeComponent } from './iframe/iframe.component';
import { ChallengeComponent } from './challenge/challenge.component';


import { DraggableDirective } from './draggale-modal/draggable.directive';
import { MovableDirective } from './draggale-modal/movable.directive';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardProgressComponent } from './dashboard-progress/dashboard-progress.component';
import { DashboardSettingsComponent } from './dashboard-settings/dashboard-settings.component';

const appRoutes: Routes = [

  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  { path: 'home', component: HomeComponent},
  { path: 'user', component: UserComponent},
  { path: 'instruction', component: InstructionComponent, children:[
      {path: 'exercise1', component: InstructionComponent},
      {path: 'exercise2', component: InstructionComponent},
      {path: 'exercise3', component: InstructionComponent},
      {path: 'exercise4', component: InstructionComponent}
   ]},
  { path: 'inquiry', component: InquiryComponent},
  { path: 'modelbuild', component: ModelbuildComponent},
  { path: 'assessment', component: AssessmentComponent},
  { path: 'playground', component: PlaygroundComponent},
  {path: 'challenge', component: ChallengeComponent},
  {path: 'dashboard', component: DashboardComponent, children : [
      {path: '', component: DashboardProgressComponent},
      {path: 'progress', component: DashboardProgressComponent},
      {path: 'settings', component: DashboardSettingsComponent}
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    AssessmentComponent,
    InquiryComponent,
    ModelbuildComponent,
    InstructionComponent,
    PlaygroundComponent,
    HomeComponent,
    ResourcesComponent,
    IframeComponent,
    ChallengeComponent,
    DraggableDirective,
    MovableDirective,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    DashboardProgressComponent,
    DashboardSettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    /*RouterModule.forRoot(appRoutes, { enableTracing: true}),*/
    RouterModule.forRoot(appRoutes),
    MDBBootstrapModule.forRoot(),
    MatTabsModule,
    MatSidenavModule,
    MatNativeDateModule,
    BrowserAnimationsModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {MDBBootstrapModule} from 'angular-bootstrap-md';

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

const appRoutes: Routes =[
  { path: '', component: HomeComponent},
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
  { path: 'playground', component: PlaygroundComponent}
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
    ResourcesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    MDBBootstrapModule.forRoot()
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserProfileComponent } from './user-profile/user-profile.component';
import { OtpSentComponent } from './otp-sent/otp-sent.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login_otp/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { ViewContactComponent } from './view-contact/view-contact.component';
import { NoteBookComponent } from './note-book/note-book.component';
import{ViewNotesComponent} from './view-notes/view-notes.component';


const routes: Routes = [
  { path: 'login', component: UserProfileComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'otp-sent', component: OtpSentComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'loginOTP', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-contact', component: AddContactComponent },
  { path: 'view-contact', component: ViewContactComponent },
  { path: 'note-book', component: NoteBookComponent },
   { path: 'view-notes', component: ViewNotesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

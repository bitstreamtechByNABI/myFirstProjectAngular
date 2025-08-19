import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UserProfileComponent } from './user-profile/user-profile.component';
import { OtpSentComponent } from './otp-sent/otp-sent.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login_otp/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddContactComponent } from './add-contact/add-contact.component';
import { ViewContactComponent } from './view-contact/view-contact.component';
import { NoteBookComponent } from './note-book/note-book.component';
import { ViewNotesComponent } from './view-notes/view-notes.component';

@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    OtpSentComponent,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    AddContactComponent,
    ViewContactComponent,
    NoteBookComponent,
    ViewNotesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { UserComponent } from './user/user.component';
import { DefaultComponent } from './pages/default/default.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HttpClientModule } from '@angular/common/http';
import { AdduserComponent } from './adduser/adduser.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TodoComponent } from './todo/todo.component';
import { TodoaddComponent } from './todoadd/todoadd.component';
import { TodoeditComponent } from './todoedit/todoedit.component';
import { TodoviewComponent } from './todoview/todoview.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    UserComponent,
    DefaultComponent,
    SigninComponent,
    SignupComponent,
    AdduserComponent,
    SidebarComponent,
    TodoComponent,
    TodoaddComponent,
    TodoeditComponent,
    TodoviewComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatDialogModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    NoopAnimationsModule
  
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

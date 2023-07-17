import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { UserComponent } from './user/user.component';
import { DefaultComponent } from './pages/default/default.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AdduserComponent } from './adduser/adduser.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TodoComponent } from './todo/todo.component';
import { TodoaddComponent } from './todoadd/todoadd.component';
import { TodoeditComponent } from './todoedit/todoedit.component';
import { TodoviewComponent } from './todoview/todoview.component';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  { 
    path: '', 
    component: NavbarComponent,
    children: [ 
      { path: '', component: DefaultComponent },
      { path: 'signin', component: SigninComponent },
      { path: 'signup', component: SignupComponent },    
]},
{
  path: '',
  component: SidebarComponent,
  children: [
    { path: 'user', component: UserComponent, canActivate: [AuthGuard]},
    { path: 'adduser', component: AdduserComponent, canActivate: [AuthGuard]},
    { path: 'todo', component: TodoComponent, canActivate: [AuthGuard]},
    { path: 'todoadd', component: TodoaddComponent, canActivate: [AuthGuard]},
    { path: 'todoedit', component: TodoeditComponent, canActivate: [AuthGuard]},
    { path: 'todoview', component: TodoviewComponent, canActivate: [AuthGuard]}
  ]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

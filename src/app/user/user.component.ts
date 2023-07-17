import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AdduserComponent } from '../adduser/adduser.component';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  users: any = [];
  filteredUsers: any = [];
  @Output() editEvents = new EventEmitter<any>();
  Name: any;
  Email: any;
  Contact: any;
  user: any;
  p: number = 1;
  searchText: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private MatDialog: MatDialog) {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(this.user);
    let api_key = this.user.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${api_key}`
    });
    const requestOptions = { headers: headers };
    this.http.get('http://localhost:9090/user', requestOptions).subscribe((data) => this.showData(data));
  }

  showData(data: any) {
    console.log(data);
    this.users = data;
    this.filteredUsers = this.users;
  }

  editClick(id: number) {
    if (this.user.user.roleid == 1) {
      this.editEvents.emit(id);
    }
  }

  removeClick(userid: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      let api_key = this.user.token;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${api_key}`
      });
      const requestOptions = { headers: headers };
      
      // Delete user
      this.http.delete('http://localhost:9090/user/' + userid, requestOptions).subscribe((data) => {
        // After deleting the user, delete their associated tasks
        this.deleteUserTasks(userid);
      });
    }
  }
  
  deleteUserTasks(userid: string) {
    let api_key = this.user.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${api_key}`
    });
    const requestOptions = { headers: headers };
  
    // Get the tasks associated with the user
    this.http.get<any[]>('http://localhost:9090/todo/user/' + userid, requestOptions).subscribe((data) => {
      const tasks: any[] = data;
      const deleteRequests = [];
  
      // Create an array of delete requests for each task
      for (const task of tasks) {
        deleteRequests.push(
          this.http.delete('http://localhost:9090/todo/' + task.todoid, requestOptions)
        );
      }
  
      // Delete all the tasks
      forkJoin(deleteRequests).subscribe(() => {
        // Tasks deleted successfully
        location.reload();
      }, (error) => {
        // Handle error if any of the delete requests fail
        console.error('Error deleting tasks:', error);
        location.reload();
      });
    });
  }
  
  

  searchData() {
    this.p = 1; // Reset pagination to the first page when filtering
    if (this.searchText !== '') {
      this.filteredUsers = this.users.filter((user: any) => {
        const name = user.username ? user.username.toLowerCase() : '';
        return name.includes(this.searchText.toLowerCase());
      });
    } else {
      this.filteredUsers = this.users;
    }
  }
  userreload() {
    location.reload();
  }
  addUser() {
    this.MatDialog.open(AdduserComponent)
  }
  
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-todoedit',
  templateUrl: './todoedit.component.html',
  styleUrls: ['./todoedit.component.css']
})
export class TodoeditComponent implements OnInit {
  Date = "";
  Task = "";
  Description = "";
  Name = "";
  Todoid = "";
  user: any;
  UserId: any;
  User: any;
  Title: any;
  isfavourite: any;
  todoid: any;
  todo: any;
  users: any;
  userid: any;
  title: any;



  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { todo: any, users: any }, // Include the 'users' property in the data object
    private matDialogRef: MatDialogRef<TodoeditComponent>,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) {
    this.todo = data.todo;
    this.users = data.users; // Assign the 'users' property to the local variable
    this.user = JSON.parse(localStorage.getItem("user") || "{}");
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.Todoid = params['id'];
      var user = JSON.parse(localStorage.getItem("user") || "{}");
      this.UserId = user.UserId;
      let api_key = user.token;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
      });

      const requestOptions = { headers: headers };
      this.http.get('http://localhost:9090/todo/' + this.Todoid, requestOptions).subscribe(data => this.showData(data));
      this.http.get('http://localhost:9090/user/', requestOptions).subscribe(data => this.showUser(data));
    });
  }

  showData(data: any) {
    if (data) {
      this.Date = data.date;
      this.Task = data.task;
      this.Title = data.title;
      this.Description = data.description;
      this.UserId = data.tblUser.userid;
    }
  }

  showUser(data: any) {
    this.User = data;
  }

  onCloseClick() {
    this.router.navigate(['/todo']);
  }

  deleteTodo() {
    if (confirm("Are you sure you want to delete this todo?")) {
      const api_key = this.user.token;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
      });
      const requestOptions = { headers: headers };

      if (this.Todoid) {
        this.http.delete(`http://localhost:9090/todo/${this.Todoid}`, requestOptions)
          .subscribe(
            () => {
              console.log('Todo deleted successfully');
              this.router.navigate(['../todo']);
            },
            (error) => {
              console.log('Failed to delete todo:', error);
            }
          );
      }
    }
  }

  ngOnDestroy() {
    this.matDialogRef.close();
  }

  deleteCard() {
    if (confirm('Are you sure you want to delete this todo?')) {
      const api_key = this.user.token;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${api_key}`
      });
      const requestOptions = { headers: headers };

      if (this.todo?.todoid) {
        this.http
          .delete(`http://localhost:9090/todo/${this.todo.todoid}`, requestOptions)
          .subscribe(
            () => {
              console.log('Todo deleted successfully');
              this.router.navigate(['/todo']);
              location.reload();
            },
            error => {
              console.log('Failed to delete todo:', error);
              this.snackBar.open('Failed to delete todo', 'Close', {
                duration: 3000
              });
            }
          );
      }
    }
  }

  OnSubmit() {
  
    
    var user = JSON.parse(localStorage.getItem("user") || "{}");
    let api_key = user.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api_key}`
    });
    const requestOptions = { headers: headers };
    console.log(headers);
    if (this.Todoid) {
      this.http.put('http://localhost:9090/todo/' + this.Todoid,
        { date: this.Date, userid: this.userid, title: this.title, task:this.Task, description: this.Description }, requestOptions)
        .subscribe(
          data => { 
            console.log(data);
        
          },
          error => {
            console.log(error);
          }
        );
    } else {
      this.http.post('http://localhost:9090/todo', { date: this.Date, userid: this.UserId, title: this.Title, task: this.Task, description: this.Description }, requestOptions)
      .subscribe(
        data => {
          console.log(data);
          
        },
        error => {
          console.log(error);
        }
    );
      }
    }
    }



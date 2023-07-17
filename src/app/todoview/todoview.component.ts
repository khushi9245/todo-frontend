import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';





@Component({
  selector: 'app-todoview',
  templateUrl: './todoview.component.html',
  styleUrls: ['./todoview.component.css']
})
export class TodoviewComponent {

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
  p: any;


  constructor(private http: HttpClient, 
    private route: ActivatedRoute, 
    private router: Router, 
    @Inject(MAT_DIALOG_DATA) public data: {todo:any}, 
    private matDialogRef: MatDialogRef<TodoviewComponent>,
    private snackBar: MatSnackBar) {
    this.todo = data.todo;
    this.user = JSON.parse(localStorage.getItem("user") || "{}");
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params); // { orderby: "price" }
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
      this.UserId = data.tblUser?.userid; // Use data.tblUser?.userid instead of data.userid
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

  reloadTodosdelete(page: number) {
    let api_key = this.user.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${api_key}`
    });
    const requestOptions = { headers: headers };
    this.http.get('http://localhost:9090/todo', requestOptions).subscribe((data) => {
      this.showData(data);
      this.p = page; // Set the current page number
    });
  
}
}

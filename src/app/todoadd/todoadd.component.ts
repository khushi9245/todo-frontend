import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
  selector: 'app-todoadd',
  templateUrl: './todoadd.component.html',
  styleUrls: ['./todoadd.component.css']
})
export class TodoaddComponent {

  Date = "";
  Task = "";
  Description = "";
  Name = "";
  Title="";
  Todoid = "";
  user: any;
  UserId: any;
  User: any;
  isfavourite: any;
  registerForm!: FormGroup
  submitted = false;
  editdata: any;

  

  constructor(private http: HttpClient, 
    private route: ActivatedRoute, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private matDialog: MatDialog, 
    private matDialogRef: MatDialogRef<TodoaddComponent>) {
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

    this.registerForm = this.formBuilder.group({
      Date: ['', [Validators.required, this.validateDate]],
      Task: ['', Validators.required],
      Title: ['', Validators.required],
      Description: ['', Validators.required],
      Name: ['', Validators.required]
    });

  }
  validateDate(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set the time component of currentDate to 0
  
    if (selectedDate.getTime() < currentDate.getTime()) {
      return { pastDate: true }; // Return an error object if the date is before the current date
    }
  
    return null; // Return null if the date is valid
  }
  
  showData(data: any) {
    if (data) {
      this.Date = data.date;
      this.Task = data.task;
      this.Title = data.title;
      this.Description = data.description;
    }
  }

  showUser(data: any) {
    this.User = data;
  }


  OnSubmit() {
    this.submitted= true
    if(this.registerForm.invalid) {
      return
    }
    
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
        { date: this.Date, userid: this.UserId, title: this.Title, task:this.Task, description: this.Description }, requestOptions)
        .subscribe(
          data => { 
            console.log(data);
           this.router.navigate(['../todo']);
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
          location.reload();
          this.router.navigateByUrl('../todo'); // Navigate to the "todo" route after alert is closed
        },
        error => {
          console.log(error);
        }
    );
      }
    }
    
  onCloseClick() {
    this.router.navigate(['/todo']);
  }
  isInvalidDate() {
    if (this.Date) {
      const selectedDate = new Date(this.Date);
      const currentDate = new Date();
      return selectedDate < currentDate;
    }
    return false;
  }
  ngOnDestroy() {
    this.matDialogRef.close();
  }
 
}

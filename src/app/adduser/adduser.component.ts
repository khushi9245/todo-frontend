import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css']
})
export class AdduserComponent {

  UserName = "";
  Email = "";
  Password = "";
  Contact = "";
  user: any;
  Userid: string | undefined;
  registerForm!: FormGroup;
  submitted = false;


  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router,  private formBuilder: FormBuilder, private MatDialogRef: MatDialogRef<AdduserComponent>) {
    this.user = JSON.parse(localStorage.getItem("user") || "{}");
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params); // { orderby: "price" }
      this.Userid = params['id'];
      var user = JSON.parse(localStorage.getItem("user") || "{}");
      let api_key = user.token;
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
      });

      const requestOptions = { headers: headers };
      this.http.get('http://localhost:9090/user/' + this.Userid, requestOptions).subscribe(data => this.showData(data));
    });

    this.registerForm = this.formBuilder.group({
      UserName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Contact: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      Password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  showData(data: any) {
    if (data) {
      this.UserName = data.username;
      this.Contact = data.contact;
      this.Email = data.email;
      this.Password = data.password;
    }
  }

  OnSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.user = JSON.parse(localStorage.getItem("user") || "{}");
    let api_key = this.user.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api_key}`
    });

    const requestOptions = { headers: headers };
    console.log(headers);

    if (this.Userid) {
      this.http.put('http://localhost:9090/user/' + this.Userid,
        { username: this.UserName, email: this.Email, password: this.Password, contact: this.Contact, roleid: 2 }, requestOptions)
        .subscribe(
          data => {
            console.log(data);
            this.router.navigate(['../user']);
          },
          error => {
            console.log(error);
          }
        );
    } else {
      this.http.post('http://localhost:9090/user',
        { username: this.UserName, email: this.Email, password: this.Password, contact: this.Contact, roleid: 2 }, requestOptions)
        .subscribe(
          data => {
            console.log(data);
           this.router.navigate(['../user']);
          },
          error => {
            console.log(error);
          }
        );
    }
  }
  ngOnDestroy() {
    this.MatDialogRef.close();
  }
}

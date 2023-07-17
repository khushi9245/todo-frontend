import {  ElementRef, Renderer2 } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {

  Email: string = "";
  Password: string = "";
  Contact: string = "";
  Error: string = "";
  AdminName: string = "";
  id: any;
  registerForm!: FormGroup;
  submitted = false;
  signinForm!: FormGroup;
  signupForm!: FormGroup;
  submittedSignin = false;
  submittedSignup = false;


  constructor(
    private elementRef: ElementRef,
    private http: HttpClient,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    const switchers = this.elementRef.nativeElement.querySelectorAll('.switcher');

    switchers.forEach((item: any) => {
      item.addEventListener('click', () => {
        switchers.forEach((item: any) => item.parentElement.classList.remove('is-active'));
        item.parentElement.classList.add('is-active');
      });
    });

    this.signinForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.signupForm = this.formBuilder.group({
      AdminName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Contact: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10), Validators.maxLength(10)]],
      Password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  submitSignup() {
    this.submittedSignup = true;

    if (this.signupForm.invalid) {
      return;
    }
    const { AdminName, Email, Password, Contact } = this.signupForm.value;

    this.http.post('http://localhost:9090/admin', {
      id: this.id,
      adminname: AdminName,
      email: Email,
      password: Password,
      contact: Contact
    }).subscribe(() => {
      alert('Success');
    });
  }

  submitSignin() {
    this.submittedSignin = true;
  
    if (this.signinForm.invalid) {
      return;
    }
  
    const { Email, Password } = this.signinForm.value;
  
    this.http.post('http://localhost:9090/admin/logintoken/', {
      email: Email,
      password: Password
    }).subscribe((data: any) => {
      console.log(data);
      if (!data) {
        this.Error = 'Invalid Credential';
      } else {
        localStorage.setItem('user', JSON.stringify(data));
        this.router.navigateByUrl('/user');
      }
    });
  }
  
}

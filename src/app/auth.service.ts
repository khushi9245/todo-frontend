import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedIn() {

    const user = localStorage.getItem('user'); 
    //const token = localStorage.getItem('user');

    //const payload = atob(token.split(‘.’)[1]); // decode payload of token

    //const parsedPayload = JSON.parse(payload); // convert payload into an Object

    //return parsedPayload.exp > Date.now() / 1000; // check if token is expired
    if(user)
      return true;
    else
      return false;
  }
}

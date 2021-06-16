import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';

// Making the service
@Injectable({
  providedIn: 'root'
})

/*
posts to the DB and set the new password based on the email.
 */
export class ForgotPasswordService {
  private emailURL = 'http://localhost:3000/users/forgot/';
  constructor(private http: HttpClient) {
  }

  public resetPass(emailString: string): void {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };
    this.http.post<any>(this.emailURL + emailString,  httpOptions ).subscribe(data => {
    });
  }
}

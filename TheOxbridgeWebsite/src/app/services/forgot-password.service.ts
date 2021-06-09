import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
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
    const body = { title: 'Angular POST Request Example' };
    this.http.post<any>(this.emailURL + emailString, body,  httpOptions ).subscribe(data => {
    });
  }
}

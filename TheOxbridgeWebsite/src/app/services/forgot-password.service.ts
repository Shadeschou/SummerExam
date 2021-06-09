import { Injectable } from '@angular/core';
<<<<<<< HEAD
=======
import {HttpClient} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';

>>>>>>> 6bf3cfa7c87db9dc91cb20ec7085b45b15b6f820

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
<<<<<<< HEAD

  constructor() { }
=======
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
>>>>>>> 6bf3cfa7c87db9dc91cb20ec7085b45b15b6f820
}

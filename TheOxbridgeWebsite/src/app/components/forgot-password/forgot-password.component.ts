import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
=======
import {ForgotPasswordService} from '../../services/forgot-password.service';
>>>>>>> 6bf3cfa7c87db9dc91cb20ec7085b45b15b6f820

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
<<<<<<< HEAD

  constructor() { }
=======
  public mail: string;

  constructor(private forgotPasswordService: ForgotPasswordService) { }
>>>>>>> 6bf3cfa7c87db9dc91cb20ec7085b45b15b6f820

  ngOnInit(): void {
  }

<<<<<<< HEAD
=======
  OnSubmit() {
    console.log(this.mail);
    this.forgotPasswordService.resetPass(this.mail);
  }
>>>>>>> 6bf3cfa7c87db9dc91cb20ec7085b45b15b6f820
}

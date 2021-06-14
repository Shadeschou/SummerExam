import { Component, OnInit } from '@angular/core';
import {ForgotPasswordService} from '../../services/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public mail: string;

  constructor(private forgotPasswordService: ForgotPasswordService) { }

  ngOnInit(): void {
  }

  OnSubmit() {
    console.log(this.mail);
    this.forgotPasswordService.resetPass(this.mail);
  }

}

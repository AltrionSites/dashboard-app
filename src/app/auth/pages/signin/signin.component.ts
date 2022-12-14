import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { User } from '../../../shared/interfaces/user';
import { faExclamationCircle, faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  faExclamationCircle = faExclamationCircle;
  faSpinner = faSpinner;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  user: User|null;

  signinForm!: FormGroup;
  show: boolean = false;;
  submitting: boolean = false;
  btnValue:string = 'Ingresar';
  unknowError:boolean = false;
  invalidCredentials: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.user = this.authService.getUser();
    this.signinForm = this.fb.group({
      username: [this.user?this.user.username: ''],
      password: [''],
    });
  }

  ngOnInit(): void {
  }

  login() {
    this.invalidCredentials = false;
    this.unknowError = false;
    const oldBtnValue = this.btnValue;
    this.startSubmittingForm();
    const { username, password } = this.signinForm.value;
    this.authService.login(username, password)
      .subscribe(
        result => {
          if(result.error) { 
            this.invalidCredentials = true;
            this.endSubmittingForm(oldBtnValue);
          } else { 
            this.router.navigateByUrl('/app/dashboard');
          }
        }
      )
  }

  startSubmittingForm() {
    this.submitting = true;
    this.btnValue = "";
  }
  
  endSubmittingForm(btnValue: string) {
    this.submitting = false;
    this.btnValue = btnValue;
  }

  removeAccount() {
    this.authService.clearStorage();
    window.location.reload();
  } 

  toggleShow() {
    this.show = !this.show;
  }

}

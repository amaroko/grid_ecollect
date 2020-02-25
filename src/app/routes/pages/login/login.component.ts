import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomValidators } from 'ng2-validation';
import { EcolService } from '../../../services/ecol.service';
import { getDefaultService } from 'selenium-webdriver/chrome';
import { environment } from '../../../../environments/environment';

const ADLOGIN = environment.adlogin;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss', './style.css', './font-awesome-4.7.0/css/font-awesome.css'] //
})
export class LoginComponent implements OnInit {

    valForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    data: any;
    menuArray = ['Home'];

    constructor(
        public settings: SettingsService,
        fb: FormBuilder,
        public ecolService: EcolService,
        public router: Router,
        private route: ActivatedRoute) {

        this.valForm = fb.group({
            // 'email': [null, Validators.compose([Validators.required, CustomValidators.email])],
            'username': [null, Validators.required],
            'password': [null, Validators.required]
        });

    }

    submitForm($ev, value: any) {
        $ev.preventDefault();
        // console.log(value);
        this.submitted = true;

        // stop here if form is invalid
        if (this.valForm.invalid) {
            return;
        }

        this.loading = true;
        /*for (let c in this.valForm.controls) {
            this.valForm.controls[c].markAsTouched();
        }
        if (this.valForm.valid) {
            console.log('Valid!');
            console.log(value);
        }*/
        // AD login
        if (ADLOGIN) {
            const body = {
                username : (value.username).toLowerCase(),
                password: value.password
            };
            this.ecolService.auth(body).subscribe(response => {

                if (response.auth) {
                    // get user
                    this.getuser(value.username, value.password);
                } else {
                    this.error = 'Wrong username and/or password';
                    this.loading = false;
                }
            }, error => {
                console.log(error);
                this.error = 'Error during login';
                this.loading = false;
            });
        } else {
            this.getuser((value.username).toLowerCase(), value.password);
        }
    }

    ngOnInit() {
        // reset login status
        this.ecolService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    }

    getuser(username, password) {
        this.ecolService.login(username).subscribe(user => {
            if (user.length > 0) {
                // store user details and basic auth credentials in local storage
                // to keep user logged in between page refreshes
              // get user permission
                this.ecolService.getpermissions(user[0].ROLE).subscribe(permission => {
                  // console.log(permission);
                  user.authdata = window.btoa(username + ':' + password);
                  localStorage.setItem('currentUser', JSON.stringify(user[0]));
                  localStorage.setItem('userpermission', JSON.stringify(permission));
                  localStorage.setItem('profile', '1');

                  sessionStorage.setItem('currentUser', JSON.stringify(user[0]));
                  sessionStorage.setItem('userpermission', JSON.stringify(permission));
                  sessionStorage.setItem('profile', '1');
                  this.router.navigate([this.returnUrl]); // prevents page reload
                  // this.router.navigate(['/home']);
                });
                //
            } else {
                this.error = 'User not created on E-Collect';
                this.loading = false;
            }

           // return user;
        }, error => {
          console.log(error);
         if (error.statusText === 'Not Found') {
            this.error = 'User not created on E-Collect';
            this.loading = false;
          } else {
            this.error = 'Error during login';
            this.loading = false;
          }
        });
    }
}

import { Component, HostBinding, OnInit } from '@angular/core';

import { SettingsService } from './core/settings/settings.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { NgxSmartModalService } from 'ngx-smart-modal';
import {
  NavigationCancel,
  Event,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  ActivatedRoute
} from '@angular/router';
import { EcolService } from './services/ecol.service';
import swal from 'sweetalert2';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {environment} from '../environments/environment';
const ADLOGIN = environment.adlogin;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  username: string | null;
  USERNAME: any;
  vallForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  data: any;
  code: any;

  @HostBinding('class.layout-fixed') get isFixed() {
    return this.settings.getLayoutSetting('isFixed');
  }

  @HostBinding('class.aside-collapsed') get isCollapsed() {
    return this.settings.getLayoutSetting('isCollapsed');
  }
  @HostBinding('class.layout-boxed') get isBoxed() { return this.settings.getLayoutSetting('isBoxed'); }
  @HostBinding('class.layout-fs') get useFullLayout() { return this.settings.getLayoutSetting('useFullLayout'); }
  @HostBinding('class.hidden-footer') get hiddenFooter() { return this.settings.getLayoutSetting('hiddenFooter'); }
  @HostBinding('class.layout-h') get horizontal() { return this.settings.getLayoutSetting('horizontal'); }
  @HostBinding('class.aside-float') get isFloat() { return this.settings.getLayoutSetting('isFloat'); }
  @HostBinding('class.offsidebar-open') get offsidebarOpen() { return this.settings.getLayoutSetting('offsidebarOpen'); }
  @HostBinding('class.aside-toggled') get asideToggled() { return this.settings.getLayoutSetting('asideToggled'); }
  @HostBinding('class.aside-collapsed-text') get isCollapsedText() { return this.settings.getLayoutSetting('isCollapsedText'); }

  // constructor(public settings: SettingsService) { }
  // constructor(public settings: SettingsService) { }

  constructor(public settings: SettingsService,
              private route: ActivatedRoute,
              fb: FormBuilder,
              public router: Router,
              public ngxSmartModalService: NgxSmartModalService,
              private _loadingBar: SlimLoadingBarService,
              private _router: Router,
              public ecolService: EcolService,
              private bnIdle: BnNgIdleService) {
    this._router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
      this.vallForm = fb.group({
        // 'email': [null, Validators.compose([Validators.required, CustomValidators.email])],
        'username': [null, Validators.required],
        'password': [null, Validators.required]
      });

    });

    // idle logout
    this.bnIdle.startWatching(3600).subscribe((res) => {
      if (res && !localStorage.getItem('currentUser')) {
        this.newsession();
        this.closetimeoutModal();
        // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // if (currentUser === 'null') {
        //   this.username = 'coop';
        // }
        // this.username = currentUser.USERNAME;
        // this.ecolService.logout();

      } else if (res && localStorage.getItem('currentUser')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.username = currentUser.USERNAME;
        this.opentimeoutModal();
        localStorage.setItem('timeout', '1'); // creates timeout tracker

        // localStorage.removeItem('currentUser'); // loggs out the user incase they reload page when timeout has reached
      }
    });
  }
  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this._loadingBar.start();
    }
    if (event instanceof NavigationEnd) {
      this._loadingBar.complete();
    }
    if (event instanceof NavigationCancel) {
      this._loadingBar.stop();
    }
    if (event instanceof NavigationError) {
      this._loadingBar.stop();
    }
  }
  submitFormm($ev, value: any) {
    $ev.preventDefault();
    // console.log(value);
    this.submitted = true;

    // stop here if form is invalid
    if (this.vallForm.invalid) {
      return;
    }

    this.loading = true;
    // AD login
    if (ADLOGIN) {
      const body = {
        username : (value.username).toLowerCase(),
        password: value.password
      };
      this.ecolService.auth(body).subscribe(response => {

        if (response.auth) {
          // get user
          this.gettuser(value.username, value.password);
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
      this.gettuser((value.username).toLowerCase(), value.password);
    }
  }

  ngOnInit() {
    // check if logged!
    this.onreload();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.ecolService.ifLogged();
    this.ecolService.ifclosed();
    const currentUser = JSON.parse(localStorage.getItem('currentUser')); // to get username in localstorage..
    this.username = currentUser.USERNAME;
    console.log(this.username);

    document.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') {
        e.preventDefault();
      }
    });
  }

  opentimeoutModal() {
    // open modal
    this.ngxSmartModalService.getModal('lockModal').open();
  }
  // openpersistanceModal() {
  //   // open modal
  //   this.ngxSmartModalService.getModal('lockModal').open();
  // }

  closetimeoutModal() {
    // close modal
    this.ngxSmartModalService.getModal('lockModal').close();
  }

  newsession() {
    // Logs out user when they claim the timeout page was not theirs
    this.ecolService.logout();
    this.closetimeoutModal();
    this.router.navigate(['/login']);
    localStorage.removeItem('timeout');

  }

  onreload() {
    if (localStorage.getItem('timeout')) {
      swal({title: 'You reloaded the Timeout',
        imageUrl: 'assets/img/user/notlogg.png',
        text: 'Kindly, log in to continue!',

        confirmButtonColor: '#7ac142',
        confirmButtonText: 'Okay'});
      this.router.navigate( ['/login'] );
      localStorage.removeItem('timeout');
    }
  }

  gettuser(username, password) {
    this.ecolService.login(username).subscribe(user => {
      if (user.length > 0 && this.username === username) { // checks for correct username and username session
        // store user details and basic auth credentials in local storage
        // to keep user logged in between page refreshes
        // get user permissions
        this.ecolService.getpermissions(user[0].ROLE).subscribe(permission => {
          // console.log(permission);
          user.authdata = window.btoa(username + ':' + password);
          this.code = localStorage.getItem('currentUser');
          // localStorage.getItem('currentUser');
          // localStorage.getItem('userpermission');
          // localStorage.getItem('profile');
          //
          // sessionStorage.getItem('currentUser');
          // sessionStorage.getItem('userpermission');
          // sessionStorage.getItem('profile');
          // this.router.navigate([this.returnUrl]);
          this.closetimeoutModal();
          localStorage.removeItem('timeout'); // removes timeout tracker
        });
        //
      } else {
        this.error = 'User not created on E-Collect or This is not your session';
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

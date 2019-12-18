import { Component, OnInit, ViewChild } from '@angular/core';
const screenfull = require('screenfull');

import { UserblockService } from '../sidebar/userblock/userblock.service';
import { SettingsService } from '../../core/settings/settings.service';
import { MenuService } from '../../core/menu/menu.service';
import { EcolService } from '../../services/ecol.service';
import swal from 'sweetalert2';
import { Router} from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    navCollapsed = true; // for horizontal layout
    menuItems = []; // for horizontal layout
    nu_of_alerts = 4;
    nu_of_brokenptps = 0;
    nu_of_demandsdue = 0;
    nu_of_overdue = 0;
    nu_of_cc_demands = 0;
    userdata: any;
    userperm: any;
    user: any;
    totalBrokenPtps: any;
    str: string;
    str1: string;
    str2: string;

    isNavSearchVisible: boolean;
    @ViewChild('fsbutton') fsbutton;  // the fullscreen button

    constructor(
        public menu: MenuService,
        public userblockService: UserblockService,
        public settings: SettingsService,
        public ecolService: EcolService,
        public router: Router) {

        // show only a few items on demo
        this.menuItems = menu.getMenu().slice(0, 4); // for horizontal layout
        // get notifications
       // ptps, overdue and demand letters
      // this.getnotification();

      this.userdata = JSON.parse(localStorage.getItem('currentUser'));
      this.userperm = JSON.parse(localStorage.getItem('userpermission'));

      this.user = {
          picture: 'assets/img/user/coop.jpg',
          username: this.userdata.USERNAME,
          division: this.userdata.TEAM,
          role: this.userdata.ROLE
      };

    }

    ngOnInit() {
        this.getbrokenptps(); // gets count of broken ptps
        this.getcardlettersdue(); // gets count of demand letters due for creditcards
        this.lettersdue();

        this.isNavSearchVisible = false;

        const ua = window.navigator.userAgent;
        if (ua.indexOf('MSIE ') > 0 || !!ua.match(/Trident.*rv\:11\./)) { // Not supported under IE
            this.fsbutton.nativeElement.style.display = 'none';
        }

        // Switch fullscreen icon indicator
        const el = this.fsbutton.nativeElement.firstElementChild;
        screenfull.on('change', () => {
            if (el) {
                el.className = screenfull.isFullscreen ? 'fa fa-compress' : 'fa fa-expand';
            }
        });

    }

    toggleUserBlock(event) {
        event.preventDefault();
        this.userblockService.toggleVisibility();
    }

    openNavSearch(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setNavSearchVisible(true);
    }

    getbrokenptps() {
        this.ecolService.getbrokenptps().subscribe((data: any) => {

          this.str = JSON.stringify(data, null, 4);

          const obj: any = JSON.parse(this.str);
          this.totalBrokenPtps = obj.data[0].TOTAL;
          console.log(typeof obj.data[0].TOTAL);

        }, error => {
          console.log(error);
        });
      }

      lettersdue() {
        this.ecolService.lettersdue().subscribe((data: any) => {
          this.str2 = JSON.stringify(data, null, 4);

          const obj1: any = JSON.parse(this.str2);
          this.nu_of_demandsdue = obj1.data[0].TOTALVIEWALL;

        }, error => {
          console.log(error);
        });
      }


      getcardlettersdue() {
        this.ecolService.totalcarddue().subscribe((data: any) => {
          this.str1 = JSON.stringify(data, null, 4);

          const obj1: any = JSON.parse(this.str1);
          this.nu_of_cc_demands = obj1.data[0].TOTALVIEWALL;

        }, error => {
          console.log(error);
        });
      }

    setNavSearchVisible(stat: boolean) {
        // console.log(stat);
        this.isNavSearchVisible = stat;
    }

    getNavSearchVisible() {
        return this.isNavSearchVisible;
    }

    toggleOffsidebar() {
        this.settings.toggleLayoutSetting('offsidebarOpen');
    }

    toggleCollapsedSideabar() {
        this.settings.toggleLayoutSetting('isCollapsed');
    }

    isCollapsedText() {
        return this.settings.getLayoutSetting('isCollapsedText');
    }

    toggleFullScreen(event) {
        if (screenfull.enabled) {
            screenfull.toggle();
        }
    }

    logout() {
        swal({
            title: (this.user.username).toUpperCase() + ', are you sure?',
            imageUrl: 'assets/img/user/coop.jpg',
            text: 'You want to logout!',
            showCancelButton: true,
            confirmButtonColor: '#7ac142',
            cancelButtonColor: '#00543d',
            confirmButtonText: 'Yes, Logout!'
        }).then((result) => {
            if (result.value) {
                this.ecolService.logout();
                this.router.navigate(['/login']);
            }
        });
    }
}

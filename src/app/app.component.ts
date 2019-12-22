import { Component, HostBinding, OnInit } from '@angular/core';

import { SettingsService } from './core/settings/settings.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import {
  NavigationCancel,
  Event,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';
import { EcolService } from './services/ecol.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @HostBinding('class.layout-fixed') get isFixed() { return this.settings.getLayoutSetting('isFixed'); }
  @HostBinding('class.aside-collapsed') get isCollapsed() { return this.settings.getLayoutSetting('isCollapsed'); }
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
    private _loadingBar: SlimLoadingBarService,
    private _router: Router,
    public ecolService: EcolService,
    private bnIdle: BnNgIdleService) {
    this._router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });

    // idle logout
    this.bnIdle.startWatching(3600).subscribe((res) => {
      if (res) {
        this.ecolService.logout();
        this._router.navigate(['/login']);
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

  ngOnInit() {
    // check if logged!
    this.ecolService.ifLogged();
    this.ecolService.ifclosed();

    document.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A') { e.preventDefault(); }
    });
  }
}

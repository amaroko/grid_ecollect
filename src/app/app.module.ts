import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // this is needed!
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule } from '@angular/forms';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { BnNgIdleService } from 'bn-ng-idle';
import { AppComponent } from './app.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { RoutesModule } from './routes/routes.module';
import { license } from '../../env';

import '@ag-grid-enterprise/all-modules';
// License goes here
import { LicenseManager } from '@ag-grid-enterprise/all-modules'; // enterprise grid

LicenseManager.setLicenseKey(license.value);

// https://github.com/ocombe/ng2-translate/issues/218
export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule, // required for ng2-tag-input ..
        CoreModule,
        LayoutModule,
        SharedModule.forRoot(),
        RoutesModule,
        SlimLoadingBarModule,
        NgxSmartModalModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            }
        })
    ],
    providers: [BnNgIdleService],
    bootstrap: [AppComponent]
})

export class AppModule {

}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { SharedModule } from '../../shared/shared.module';
import { NewcaseComponent } from './newcase/newcase.component';
import { AllCasesComponent } from './allcases/allcases.component';
import {AgGridModule} from '@ag-grid-community/angular';
import {NgSelectModule} from '@ng-select/ng-select';
import {CustomFormsModule} from 'ng2-validation';
import {NgxSmartModalModule} from 'ngx-smart-modal';
import {NgbDatepickerModule, NgbTypeaheadModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';

const routes: Routes = [
    { path: '', redirectTo: 'allcases' },
    { path: 'newcase', component: NewcaseComponent },
    { path: 'allcases', component: AllCasesComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        AgGridModule,
        NgSelectModule,
        CustomFormsModule,
        NgxSmartModalModule,
        NgbDatepickerModule,
        NgxPaginationModule,
        NgbTypeaheadModule
    ],
    declarations: [
        AllCasesComponent,
        NewcaseComponent
    ],
    exports: [
        RouterModule
    ]
})
export class DebtcollectorsModule { }

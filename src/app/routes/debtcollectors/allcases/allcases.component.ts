import {Component, Injectable, OnInit} from '@angular/core';
import * as _ from 'lodash';
declare var $: any;
import { environment } from '../../../../environments/environment';
// import { HttpClient} from '@angular/common/http';
import {AllModules} from '@ag-grid-enterprise/all-modules';

@Component({
    selector: 'app-allcases',
    templateUrl: './allcases.component.html',
    styleUrls: ['./allcases.component.scss']
})
export class AllCasesComponent implements OnInit {

  public gridApi;
  public gridColumnApi;
  private statusBar;
  public columnDefs;
  public defaultColDef;
  public rowModelType;
  public cacheBlockSize;
  public maxBlocksInCache;
  public rowData: [];

  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  username: string;
  searchText: string;
  model: any = {};
  pivotPanelShow = true;

  modules = AllModules;

  constructor() {
    this.columnDefs = [
      { field: 'CUSTNUMBER', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      {
        field: 'ACCNUMBER',
        cellRenderer: function (params) {
          if (params.value !== undefined) {
            return '<a  href="#" target="_blank">' + params.value + '</a>';
          } else {
            return ''; // <img src="assets/img/user/loading.gif" alt="Loading Icon">
          }
        },
        filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true
      },
      { field: 'CUSTNAME', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },

      { field: 'LOANSETTLEMENTACC', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'FILENO', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'ACCBALANCE', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      // {
      //   field: 'DATEINPUT',
      //   cellRenderer: function (params) {
      //     if (params.value !== undefined) {
      //       return (Math.floor(params.value * 100) / 100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      //     } else {
      //       return '';
      //     }
      //   },
      //   filter: 'agNumberColumnFilter', filterParams: { newRowsAction: 'keep' }, aggFunc: 'sum', resizable: true
      // },
      // {
      //   field: 'DATEINST',
      //   cellRenderer: function (params) {
      //     if (params.value !== undefined) {
      //       return (Math.floor(params.value * 100) / 100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      //     } else {
      //       return '';
      //     }
      //   },
      //   filter: 'agNumberColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true
      // },
      { field: 'CANCELCOMMENT', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'AROCODE', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'REGION', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'STAGEDATE', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'DATEINPUT', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'OWNER', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'TOWN', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'ADDRESS', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'NEWSTATUS', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
    ];
    this.defaultColDef = {
      width: 120,
      resizable: true,
      sortable: true,
      floatingFilter: true,
      unSortIcon: true,
      suppressResize: false,
      enableRowGroup: true,
      enablePivot: true,
      pivot: true
    };
    this.rowModelType = 'serverSide';
    this.cacheBlockSize = 50;
    this.maxBlocksInCache = 0;
    this.statusBar = {
      statusPanels: [
        {
          statusPanel: 'agTotalAndFilteredRowCountComponent',
          align: 'left'
        },
        {
          statusPanel: 'agTotalRowCountComponent',
          align: 'center'
        },
        { statusPanel: 'agFilteredRowCountComponent' },
        { statusPanel: 'agSelectedRowCountComponent' },
        { statusPanel: 'agAggregationComponent' }
      ]
    };
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const datasource = {
      // tslint:disable-next-line:no-shadowed-variable
      getRows(params) {
        console.log(JSON.stringify(params.request, null, 1));

        fetch(environment.nodeapi + '/griddebtcollectors/viewall', {
          method: 'post',
          body: JSON.stringify(params.request),
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        })
          .then(httpResponse => httpResponse.json())
          .then(response => {
            // check if null return zero
            if (response.lastRow === null) {
              response.lastRow = 0;
            }
            // end of check
            params.successCallback(response.rows, response.lastRow);
          })
          .catch(error => {
            console.error(error);
            params.failCallback();
          });
      }
    };

    params.api.setServerSideDatasource(datasource);
  }
  currencyFormatter(params) {
    if (params.value !== undefined) {
      return (Math.floor(params.value * 100) / 100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    } else {
      return '';
    }
  }

  onRowDoubleClicked(event: any) {
    this.model = event.node.data;
    // console.log(this.model);
    // tslint:disable-next-line:max-line-length
    window.open(environment.applink + '/activitylog?accnumber=' + this.model.ACCNUMBER + '&custnumber=' + this.model.CUSTNUMBER + '&username=' + this.currentUser.USERNAME + '&sys=collections', '_blank');
  }


  public ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser.USERNAME;
  }


}

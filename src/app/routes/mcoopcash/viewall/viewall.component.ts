import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
// import { HttpClient} from '@angular/common/http';
import {AllModules} from '@ag-grid-enterprise/all-modules';

@Component({
  selector: 'app-viewall',
  templateUrl: './viewall.component.html',
  styleUrls: ['./viewall.component.scss']
})

export class ViewallComponent implements OnInit {
  public gridApi;
  public gridColumnApi;

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
      {
        field: 'LOANACCNUMBER',
        cellRenderer: function (params) {
          if (params.value !== undefined) {
            return '<a  href="#" target="_blank">' + params.value + '</a>';
          } else {
            return ''; // <img src="assets/img/user/loading.gif">
          }
        },
        filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true
      },
      { field: 'CLIENTNAME', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'IDNUMBER', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'ARREARS_CATEGORY', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'LOAN_TYPE', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'AROCODE', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'DISBURSALDATE', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      {
        field: 'AMOUNTDISBURSED',
        cellRenderer: function (params) {
          if (params.value !== undefined) {
            return (Math.floor(params.value * 100) / 100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          } else {
            return '';
          }
        },
        filter: 'agNumberColumnFilter', filterParams: { newRowsAction: 'keep' }, aggFunc: 'sum', resizable: true
      },
      {
        field: 'REPAYMENTAMOUNT',
        cellRenderer: function (params) {
          if (params.value !== undefined) {
            return (Math.floor(params.value * 100) / 100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          } else {
            return '';
          }
        },
        filter: 'agNumberColumnFilter', filterParams: { newRowsAction: 'keep' }, aggFunc: 'sum', resizable: true
      },
      { field: 'EMPLOYER', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'LASTPAYMENTDATE', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'DUEDATE', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'LOANSTATUS', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'ADDRESS', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'PHONENUMBER', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
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
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const datasource = {
      // tslint:disable-next-line:no-shadowed-variable
      getRows(params) {
        console.log(JSON.stringify(params.request, null, 1));

        fetch(environment.nodeapi + '/gridmcoopcashviewall/viewall', {
          method: 'post',
          body: JSON.stringify(params.request),
          headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
          .then(httpResponse => httpResponse.json())
          .then(response => {
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
    // tslint:disable-next-line:max-line-length
    window.open(environment.applink + '/activitylog?accnumber=' + this.model.LOANACCNUMBER + '&custnumber=' + this.model.LOANACCNUMBER + '&username=' + this.username + '&sys=mcoopcash', '_blank');
  }


  public ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser.USERNAME;
  }


}

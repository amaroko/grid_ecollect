
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
// import { HttpClient} from '@angular/common/http';
import {AllModules} from '@ag-grid-enterprise/all-modules';

@Component({
  selector: 'app-ptps',
  templateUrl: './ptps.component.html',
  styleUrls: ['./ptps.component.scss']
})
export class PtpsComponent implements OnInit {
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
        headerName: 'ACCNUMBER',
        field: 'ACCNUMBER',
        cellRenderer: function (params) {
          if (params.value !== undefined) {
            return '<a  href="#" target="_blank">' + params.value + '</a>';
          } else {
            return ''; // <img src="assets/img/user/loading.gif" alt="Loading Icon">
          }
        },
        filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true,
      },
      {
        headerName: 'STATUS',
        field: 'MET',
        filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true
      },
      {
        headerName: 'CUST_NAME',
        field: 'CLIENT_NAME',
        filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true
      },
      {
        headerName: 'PTPAMOUNT',
        field: 'PTPAMOUNT',
        filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true
      },
      {
        headerName: 'PTPDATE',
        field: 'PTPDATE',
        filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true
      },
      {
        headerName: 'ACTIONDATE',
        field: 'ACTIONDATE',
        filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true
      },
      {
        headerName: 'PAYMETHOD',
        field: 'PAYMETHOD',
        filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true
      },
      {
        headerName: 'OWNER',
        field: 'OWNER',
        filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true
      }
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

        fetch(environment.nodeapi + '/gridbrokenptps/viewall', {
          method: 'post',
          body: JSON.stringify(params.request),
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
        })
          .then(httpResponse => httpResponse.json())
          .then(response => {
            // check if null return zero
            if (response.lastRow === null) {
              response.lastRow = '0';
            }
            params.successCallback(response.rows, response.lastRow);

            console.log(response.lastRow);
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
    return (Math.floor(params.value * 100) / 100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
  onRowDoubleClicked(event: any) {
    this.model = event.node.data;
    // console.log(this.model);
    // tslint:disable-next-line:max-line-length
    window.open(environment.applink + '/activitylog?accnumber=' + this.model.accnumber + '&custnumber=' + this.model.custnumber + '&username=' + this.currentUser.USERNAME + '&sys=collections', '_blank');
  }


  public ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser.USERNAME;
  }


}

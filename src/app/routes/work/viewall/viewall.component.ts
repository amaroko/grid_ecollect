
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
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
    { field: 'CLIENT_NAME', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
    { field: 'CUSTNUMBER', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
    { field: 'BUCKET', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
    { field: 'PRODUCTCODE', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
    { field: 'DAYSINARR', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
    {
        field: 'OUSTBALANCE',
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
        field: 'PRINCARREARS',
        cellRenderer: function (params) {
            if (params.value !== undefined) {
                return (Math.floor(params.value * 100) / 100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            } else {
                return '';
            }
        },
        filter: 'agNumberColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true
    },
    {
        field: 'INSTAMOUNT',
        cellRenderer: function (params) {
            if (params.value !== undefined) {
                return (Math.floor(params.value * 100) / 100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            } else {
                return '';
            }
        },
        filter: 'agNumberColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true
    },
    { field: 'LIMITAMOUNT', filter: 'agNumberColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
    {
        field: 'TOTALARREARS',
        cellRenderer: function (params) {
            if (params.value !== undefined) {
                return (Math.floor(params.value * 100) / 100).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
            } else {
                return '';
            }
        },
        filter: 'agNumberColumnFilter', filterParams: { newRowsAction: 'keep' }
    },
      { field: 'RROCODE', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'AROCODE', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'BRANCHCODE', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'BRANCHNAME', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
      { field: 'COLOFFICER', filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true },
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
      getRows(params) {
        // tslint:disable-next-line:no-shadowed-variable
        console.log(JSON.stringify(params.request, null, 1));

        fetch(environment.nodeapi + '/gridviewall/viewall', {
          method: 'post',
          body: JSON.stringify(params.request),
          headers: { 'Content-Type': 'application/json; charset=utf-8' }
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
    // console.log(this.model);
    // tslint:disable-next-line:max-line-length
    window.open(environment.applink + '/activitylog?accnumber=' + this.model.ACCNUMBER + '&custnumber=' + this.model.CUSTNUMBER + '&username=' + this.currentUser.USERNAME + '&sys=collections', '_blank');
  }


  public ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser.USERNAME;
  }


}

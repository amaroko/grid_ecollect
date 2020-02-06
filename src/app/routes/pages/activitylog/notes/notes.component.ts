import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EcolService } from '../../../../services/ecol.service';
import { isNullOrUndefined } from 'util';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import {GridOptions} from '@ag-grid-community/all-modules';
import { HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {AllModules} from '@ag-grid-enterprise/all-modules';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  providers: [DatePipe]
})
export class NotesComponent implements OnInit {




  public gridOptions: GridOptions;
  private statusBar;
  public gridApi;
  public gridColumnApi;
  public columnDefs;
  public sortingOrder;
  public defaultColDef;
  public rowData: [];
  modules = AllModules;
  private str: string;
  pivotPanelShow = true;

  noteData: any = [];
  notes: any = [];
  username: string;
  bulknote: any = [];
  flaggedNotes: any = [];
  bulknotelength = 0;
  noteslength: number;
  flaggedlength = 0;
  allnotes = 0;
  model: any = {};
  p = 1;
  private selectedLink: any = 'collector';
  pager = {
    limit: 5, // default number of notes
    current: 0, // current page
    reachedend: false
  };
  cust: string;
  query = {
    limit: this.pager.limit,
    skip: this.pager.limit * this.pager.current
  };

  currentDate: any = new Date();
  private NOTEDATE: any;
  constructor(
    public http: HttpClient,
    private ecolservice: EcolService,
    private route: ActivatedRoute,
    private rout: Router,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private ecolService: EcolService,
  ) {

    this.gridOptions = <GridOptions>{


      // suppressCellSelection: true,


      // domLayout: 'autoHeight',
      rowSelection: 'single',
      rowModelType: 'normal',
      // rowModelType: 'infinite',

      pagination: true,
      paginationPageSize: 20,

      onGridReady: (params) => {

        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        // params.api.sizeColumnsToFit();
        // this.gridApi.setDatasource(this.dataSource);
        // environment.api + '/api/tqall/paged/myallocation?colofficer=' + this.username
        this.http
          .get(environment.api + '/api/notehis/allcustnotes?custnumber=' + this.cust)
          .subscribe(resp => {
            console.log(typeof resp); // to check whether object or array
            this.str = JSON.stringify(resp, null, 4);
            const obj: any = JSON.parse(this.str);

            params.api.setRowData(obj);

          });

      }
    };
    this.columnDefs = [
      {
        field: 'ACCNUMBER',
        // cellRenderer: function (params) {
        //   if (params.value !== undefined) {
        //     return '<a  href="#" target="_blank">' + params.value + '</a>';
        //   } else {
        //     return ''; // <img src="assets/img/user/loading.gif" alt="Loading Icon">
        //   }
        // },
        filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true
      },
      {
        field: 'CUSTNUMBER',
        filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true,
      },
      {
        field: 'NOTEMADE',
        filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true, width: 360,
      },
      {
        field: 'NOTEDATE',
        filter: 'agTextColumnFilter',
        filterParams: { newRowsAction: 'keep', browserDatePicker: true, }, resizable: true, valueFormatter: this.dateFormatter,

      },
      {
        field: 'NOTEIMP',
        filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true,
      },
      {
        field: 'NOTESRC',
        filter: 'agTextColumnFilter', filterParams: { newRowsAction: 'keep' }, resizable: true,
      }
    ];
    this.sortingOrder = ['desc', 'asc', null ];
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

  ngOnInit() {
    // check if logged in
    this.ecolService.ifLogged();
    this.ecolService.ifclosed();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser.USERNAME;

    this.route.queryParams.subscribe(params => {
      this.cust = params['custnumber'];
    });
    // this.data.currentMessage.subscribe(message => this.message = message)
    this.getAll(this.cust);
    this.getbulknotes(this.cust);
    this.getNotes(this.cust);
    this.getflagged(this.cust);

    this.model.noteselector = 'collector';
  }

  getbulknotes(cust) {
    this.ecolservice.getbulknotes(cust).subscribe(data => {
      this.bulknote = data[0];
      this.bulknotelength = data[0].length || 0;
    });
  }

  getflagged(cust) {
    this.ecolservice.getflaggednotes(cust).subscribe(data => {
      this.flaggedNotes = data[0];
      this.flaggedlength = data[0].length || 0;
    });
  }

  getNotes(custnumber) {
    this.ecolService.totalnotes(custnumber).subscribe(data => {
      this.noteslength = data[0].TOTAL;
    });
  }


dateFormatter(params) {
  return moment(params.value).format('MM/DD/YYYY HH:mm');
}
  getAll(cust) {
    this.spinner.show();
    this.query.limit = this.pager.limit;
    this.query.skip = this.pager.limit * this.pager.current;

    // const filter = encodeURI(JSON.stringify(this.query));
    // console.log('this.query ', this.query);
    this.ecolservice.getallnotes(this.query, cust).subscribe(data => {
      this.notes = data;
      console.log(data);
      // this.noteslength = data.length;
      for (let i = 0; i < data.length; i++) {
        // tslint:disable-next-line:max-line-length
        // Notes won't be editable after midnight
        // tslint:disable-next-line:max-line-length
        if (this.notes[i].OWNER === this.username && (this.datePipe.transform(this.currentDate, 'dd-MMM-yy')).toUpperCase() === ((this.notes[i].NOTEDATE).substring(0, 9)).toUpperCase()) {
          this.notes[i].showedit = true;
        } else {
          this.notes[i].showedit = false;
        }
      }
      // append posts
      if (!isNullOrUndefined(data) && this.notes.length) {
        this.noteData = this.noteData.concat(data);
      } else {
        this.pager.reachedend = true;
      }
      this.spinner.hide();
    }, err => {
      console.log(err);
    });
  }

  loadmore(event) {
    this.spinner.show();
    // increase the current by 1
    // if current = 0, skip = limit*current
    event.preventDefault();
    this.pager.current = this.pager.current + 1;
    this.getAll(this.cust);

    setTimeout(() => {
      this.spinner.hide();
    }, 1500);
  }

  editnote(note) {
    // tslint:disable-next-line:max-line-length
    this.rout.navigateByUrl('/activitylog/editnote?id=' + note.ID + '&accnumber=' + note.ACCNUMBER + '&custnumber=' + note.CUSTNUMBER + '&username=' + note.OWNER + '&sys=watch').then(e => {
      if (e) {
        console.log('Navigation is successful!');
      } else {
        console.log('Navigation has failed!');
      }
    });
  }

  handleChange(e) {
    this.selectedLink = e;
  }

  onBtnExportDataAsExcel() {
    this.gridApi.exportDataAsExcel();
  }

  isSelected(name: string) {
    if (!this.selectedLink) { // if no radio button is selected, always return false so every nothing is shown
      return false;
    }
    return (this.selectedLink === name); // if current radio button is selected, return true, else return false
  }
}


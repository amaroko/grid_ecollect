import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EcolService } from '../../../../services/ecol.service';
import { isNullOrUndefined } from 'util';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss'],
  providers: [DatePipe]
})
export class NotesComponent implements OnInit {

  noteData: any = [];
  notes: any = [];
  username: string;
  bulknote: any = [];
  flaggedNotes: any = [];
  bulknotelength = 0;
  noteslength: number;
  flaggedlength = 0;
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
    private ecolservice: EcolService,
    private route: ActivatedRoute,
    private rout: Router,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    private ecolService: EcolService,
  ) {
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

  isSelected(name: string) {
    if (!this.selectedLink) { // if no radio button is selected, always return false so every nothing is shown
      return false;
    }
    return (this.selectedLink === name); // if current radio button is selected, return true, else return false
  }
}


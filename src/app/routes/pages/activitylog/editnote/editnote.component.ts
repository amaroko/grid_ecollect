import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../../core/settings/settings.service';
import { ActivatedRoute } from '@angular/router';
import { EcolService } from '../../../../services/ecol.service';
import swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSmartModalService} from 'ngx-smart-modal';

const URL = environment.valor;

@Component({
  selector: 'app-editnote',
  templateUrl: './editnote.component.html',
  styleUrls: ['./editnote.component.scss']
})
export class EditnoteComponent implements OnInit {

  custnumber: string;
  accnumber: string;
  username: string;
  model: any = {};
  note: any = [];
  noteid: string;
  editnoteForm: FormGroup;
  submitted = false;
  notes: any;
  newnotes: any;
  nochange = true;
  noteswordslength: any = {};

  constructor(public settings: SettingsService,
              private route: ActivatedRoute,
              private ecolService: EcolService,
              public ngxSmartModalService: NgxSmartModalService,
              private formBuilder: FormBuilder) {
    //
  }

  ngOnInit() {
    // check if logged in
    this.ecolService.ifLogged();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser.USERNAME;

    this.accnumber = this.route.snapshot.queryParamMap.get('accnumber');
    this.route.queryParamMap.subscribe(queryParams => {
      this.accnumber = queryParams.get('accnumber');
      this.model.accnumber = queryParams.get('accnumber');
    });

    /*this.username = this.route.snapshot.queryParamMap.get('username');
    this.route.queryParamMap.subscribe(queryParams => {
      this.username = queryParams.get('username');
    });*/

    this.custnumber = this.route.snapshot.queryParamMap.get('custnumber');
    this.route.queryParamMap.subscribe(queryParams => {
      this.custnumber = queryParams.get('custnumber');
      this.model.custnumber = queryParams.get('custnumber');
    });

    this.noteid = this.route.snapshot.queryParamMap.get('id');
    this.route.queryParamMap.subscribe(queryParams => {
      this.noteid = queryParams.get('id');
      this.model.id = queryParams.get('id');
    });

    // get this note
    this.getNote(this.noteid);
    this.buildForm();
  }

  onSubmit() {
    // check if logged in
    this.ecolService.ifLogged();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser.username;

    // Loading indictor
    this.ecolService.loader();
    //
    const body = {
      id: this.f.id.value,
      owner: this.username,
      notemade: this.f.notemade.value,
      custnumber: this.model.custnumber,
      accnumber: this.model.accnumber,
      notesrc: this.note.notesrc,
      noteimp: this.note.noteimp,
      notedate: this.note.notedate,
    };
    this.closeeditModal();
    this.ecolService.updatenote(body).subscribe(data => {
      swal('Successful!', 'Note updated!', 'success').then(function () {
        window.history.back();
      });
      //
    }, error => {
      console.log(error);
      swal('Error!', 'Error occurred during processing!', 'error');
    });
  }

  getNote(id) {
    this.ecolService.getanote(id).subscribe(data => {
      this.note = data;
      this.buildForm();
    }, error => {
      console.log(error);
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.editnoteForm.controls; }

  buildForm() {
    // get static data

    this.editnoteForm = this.formBuilder.group({
      id: [{ value: this.note.id, disabled: true }],
      accnumber: [{ value: this.note.accnumber, disabled: true }],
      custnumber: [{ value: this.note.custnumber, disabled: true }],
      notemade: [{ value: this.note.notemade, disabled: false }],
      notedate: [{value: this.note.notedate, disabled: true}],
      owner: [{value: this.note.owner, disabled: true}]
    });

  }

  cancel() {
    window.history.back();
  }

  openeditModal() {
    // open modal
    this.ngxSmartModalService.getModal('editModal').open();
    this.notes = this.note.notemade;
    this.newnotes = this.f.notemade.value;
    if (this.notes === this.newnotes) {
      console.log('You havent changed a thing');
      this.nochange = true;


    } else {
      this.nochange = false;
      console.log('good,you\'ve changed ');
    }
  }

  closeeditModal() {
    // close modal
    this.ngxSmartModalService.getModal('editModal').close();
  }

}

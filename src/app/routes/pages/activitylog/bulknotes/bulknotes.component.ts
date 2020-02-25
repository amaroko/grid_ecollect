import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../../../core/settings/settings.service';
import {ActivatedRoute} from '@angular/router';
import {EcolService} from '../../../../services/ecol.service';
import swal from 'sweetalert2';
import {saveAs} from 'file-saver';
import {environment} from '../../../../../environments/environment';
import {FileUploader, FileItem, ParsedResponseHeaders} from 'ng2-file-upload';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {DataService} from '../../../../services/data.service';
import {json} from 'ng2-validation/dist/json';

const URL = environment.xlsuploadapi;

@Component({
  selector: 'app-bulknotes',
  templateUrl: './bulknotes.component.html',
  styleUrls: ['./bulknotes.component.scss']
})
export class BulknotesComponent implements OnInit {

  custnumber;
  accnumber;
  notes: number;
  username: string;
  form: FormGroup;
  uploadResponse;
  errors;

  public uploader: FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  constructor(private formBuilder: FormBuilder, public settings: SettingsService,
              private route: ActivatedRoute,
              public dataService: DataService,
              private spinner: NgxSpinnerService,
              private ecolService: EcolService) {
    //
    //
    this.uploader.onBuildItemForm = (item, form) => {
      form.append('owner', this.username);
      form.append('custnumber', this.custnumber);
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      // console.log('ImageUpload:uploaded:', item, status, response);
    };
    this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);

  }

  ngOnInit() {
    // check if logged in
    this.ecolService.ifLogged();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser.username;

    this.accnumber = this.route.snapshot.queryParamMap.get('accnumber');
    this.route.queryParamMap.subscribe(queryParams => {
      this.accnumber = queryParams.get('accnumber');
    });

    /*this.username = this.route.snapshot.queryParamMap.get('username');
    this.route.queryParamMap.subscribe(queryParams => {
      this.username = queryParams.get('username');
    });*/

    this.custnumber = this.route.snapshot.queryParamMap.get('custnumber');
    this.route.queryParamMap.subscribe(queryParams => {
      this.custnumber = queryParams.get('custnumber');
    });

    // get account details
    this.form = this.formBuilder.group({
      avatar: ['']
    });
  }

  onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    const data = JSON.parse(response); // success server response
    const bulknotes = data.notes;
    if (data.success === false) {
      swal({
        type: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
      });
    } else {
      for (let x = 0; x < bulknotes.length; x++) {
        bulknotes[x].custnumber = (bulknotes[x].accnumber).substring(5, 12);
        bulknotes[x].owner = this.username;
        bulknotes[x].notesrc = 'uploaded a note';
      }
      console.log(bulknotes);
      this.ecolService.postnotes(bulknotes).subscribe(resp => {
        swal({
          type: 'success',
          title: 'All Good!',
          text: 'Excel bulk notes upload is a success',
        });
      }, error => {
        swal({
          type: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      });

    }
  }

  onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
    const error = JSON.parse(response); // error server response
    console.log('error', error);
    swal({
      type: 'error',
      title: 'Oops...',
      text: 'Something went wrong with xlxs upload!',
    });
  }

  downloadFile() {
    const template = environment.xlstemplate;
    this.ecolService.downloadFile(template).subscribe(data => {
      saveAs(data, 'ECollect_bulk_notes_upload_template.xlsx');
    }, error => {
      console.log(error);
      swal('Error!', ' Cannot download template  file!', 'error');
    });
  }


  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('avatar').setValue(file);
    }
  }

  onSubmit() {
    this.spinner.show();
    const formData = new FormData();
    formData.append('avatar', this.form.get('avatar').value);

    this.ecolService.uploadFile(formData).subscribe(
      (res) => {
        this.uploadResponse = res; // response
        this.sendNotesData(this.custnumber); // updates the notes counter on sidebar
        if (res === 'Please Choose only Excel file') {
          this.spinner.hide();
          swal({
            type: 'info',
            title: 'Error!',
            text: this.uploadResponse,
          });
        } else if (res === 'Your file Uploaded Successfull') {
          this.spinner.hide();
          swal({
            type: 'success',
            title: 'Good!',
            text: this.uploadResponse,
          });
        } else if (res === 'Your file Uploaded Failed') {
          this.spinner.hide();
          swal({
            type: 'error',
            title: 'Sorry!',
            text: this.uploadResponse,
          });
        } else if (res === 'File is Empty Please Choose Excel file') {
          this.spinner.hide();
          swal({
            type: 'info',
            title: 'Sorry!',
            text: this.uploadResponse,
          });
        }
        // this.spinner.hide();
        // console.log(res);
        // swal({
        //   type: 'success',
        //   title: 'All Good!',
        //   text: this.uploadResponse,
        // });
      },
      (err) => {
        console.log(err);
        // this.errors = err;
        // if (err === 'File is Empty Please Choose Excel file') {
        //   this.spinner.hide();
        //   swal('Error!', this.errors, 'error');
        // }


        this.spinner.hide();
        swal('Error!', ' Your file Upload Failed!', 'error');
      }
    );
  }

  sendNotesData(custnumber) {
    this.ecolService.totalnotes(custnumber).subscribe(data => {
      this.dataService.pustNotesData(data[0].TOTAL);
    });
  }

}


// import { Component, OnInit } from '@angular/core';
// import { SettingsService } from '../../../../core/settings/settings.service';
// import { ActivatedRoute } from '@angular/router';
// import { EcolService } from '../../../../services/ecol.service';
// import swal from 'sweetalert2';
// import { saveAs } from 'file-saver';
// import { environment } from '../../../../../environments/environment';
// import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
//
// const URL = environment.xlsuploadapi;
//
// @Component({
//   selector: 'app-bulknotes',
//   templateUrl: './bulknotes.component.html',
//   styleUrls: ['./bulknotes.component.scss']
// })
// export class BulknotesComponent implements OnInit {
//
//   custnumber;
//   accnumber;
//   username: string;
//   sys: string;
//
//   public uploader: FileUploader = new FileUploader({ url: URL });
//   public hasBaseDropZoneOver = false;
//   public hasAnotherDropZoneOver = false;
//
//   public fileOverBase(e: any): void {
//     this.hasBaseDropZoneOver = e;
//   }
//
//   public fileOverAnother(e: any): void {
//     this.hasAnotherDropZoneOver = e;
//   }
//
//   constructor(public settings: SettingsService,
//     private route: ActivatedRoute,
//     private ecolService: EcolService) {
//     //
//     //
//     this.uploader.onBuildItemForm = (item, form) => {
//       form.append('owner', this.username);
//       form.append('custnumber', this.custnumber);
//       form.append('sys', this.sys);
//     };
//
//     this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
//       // console.log('ImageUpload:uploaded:', item, status, response);
//     };
//     this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
//     this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);
//
//   }
//
//   ngOnInit() {
//     // check if logged in
//     this.ecolService.ifLogged();
//     const currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     this.username = currentUser.USERNAME;
//
//     this.accnumber = this.route.snapshot.queryParamMap.get('accnumber');
//     this.route.queryParamMap.subscribe(queryParams => {
//       this.accnumber = queryParams.get('accnumber');
//     });
//
//     this.custnumber = this.route.snapshot.queryParamMap.get('custnumber');
//     this.route.queryParamMap.subscribe(queryParams => {
//       this.custnumber = queryParams.get('custnumber');
//     });
//
//     this.sys = this.route.snapshot.queryParamMap.get('sys');
//     this.route.queryParamMap.subscribe(queryParams => {
//       this.sys = queryParams.get('sys');
//     });
//   }
//
//   onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
//     const data = JSON.parse(response); // success server response
//     // console.log(data);
//     const bulknotes = data.notes;
//     const filename = data.files[0].originalname;
//     if (data.success === true) {
//       if (bulknotes.length < 5000) {
//         swal({
//           type: 'success',
//           title: 'ALL Good',
//           text: 'File: ' + filename + ' with ' + bulknotes.length + ' rows has been processed!',
//         });
//       } else {
//         swal({
//           type: 'error',
//           title: 'Oops...',
//           text: 'File has too many rows. Max is 2,000 rows!',
//         });
//       }
//
//     } else {
//       swal({
//         type: 'error',
//         title: 'Oops...',
//         text: 'Something went wrong with the file!',
//       });
//     }
//   }
//
//   onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any {
//     const error = JSON.parse(response); // error server response
//     console.log('error', error);
//     swal({
//       type: 'error',
//       title: 'Oops...',
//       text: 'Something went wrong with xlxs upload!',
//     });
//   }
//
//   downloadFile() {
//     const template = environment.xlstemplate;
//     this.ecolService.downloadFile(template).subscribe(data => {
//       saveAs(data, 'ECollect_bulk_notes_upload_template.xlsx');
//     }, error => {
//       console.log(error);
//       swal('Error!', ' Cannot download template  file!', 'error');
//     });
//   }
//
// }

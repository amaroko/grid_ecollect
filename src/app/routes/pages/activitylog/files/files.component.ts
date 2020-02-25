import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../../core/settings/settings.service';
import { ActivatedRoute } from '@angular/router';
import { EcolService } from '../../../../services/ecol.service';
import { DataService } from '../../../../services/data.service';
import swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { environment } from '../../../../../environments/environment';
import {FileUploader, FileItem, ParsedResponseHeaders} from 'ng2-file-upload';
import {FormBuilder, FormGroup} from '@angular/forms';

const URL = environment.filesapi;

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  form: FormGroup;
  uploadResponse;

  accnumber: string;
  custnumber: string;

  model: any = {};
  demands: any;
  files: any = [];
  username: string;
  filetype: any = [
    {filetype: 'Other'},
    { filetype: 'Demand Letter' },
    { filetype: 'Customer Correspondence' }
  ];

  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  constructor(public settings: SettingsService,
              private route: ActivatedRoute,
              private ecolService: EcolService,
              private dataService: DataService,
              private formBuilder: FormBuilder,
  ) {
    //
    this.uploader.onBuildItemForm = (item, form) => {
      form.append('docdesc', this.model.docdesc);
      form.append('accnumber', this.accnumber);
      form.append('owner', this.username);
      form.append('custnumber', this.custnumber);
    };

    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      // refresh demad history notes

    };

    this.uploader.onSuccessItem = (item: FileItem, response: any, status: number, headers: ParsedResponseHeaders): any => {
      // success
      const obj = JSON.parse(response);
      console.log(obj);
      if (obj.success) {
        for (let i = 0; i < obj.files.length; i++) {
          const bulk = {
            'accnumber': this.accnumber,
            'custnumber': this.custnumber,
            'destpath': obj.files[i].path,
            'filesize': obj.files[i].size,
            'filetype': obj.files[i].mimetype,
            'filepath': obj.files[i].path,
            'filename': obj.files[i].originalname,
            'doctype': obj.files[i].originalname,
            'docdesc': this.model.filedesc,
            'colofficer': this.username,
            'userdesctype': this.model.userdesctype
          };
          this.ecolService.uploads(bulk).subscribe(resp => {
            this.getfileshistory(this.custnumber);
            swal('Good!', 'File uploaded successfully!', 'success');
          }, error => {
            swal('Oooops!', 'File uploaded but unable to add to files history!', 'warning');
          });
        }
      } else {
        swal('Oooops!', 'unable to upload file!', 'error');
      }

    };

    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any => {
      swal('Oooops!', 'unable to upload file!', 'error');
    };
  }

  ngOnInit() {

    /// check if logged!
    this.form = this.formBuilder.group({
      avatar: ['']
    });
    this.ecolService.ifLogged();
    this.ecolService.ifclosed();

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser.USERNAME;

    this.accnumber = this.route.snapshot.queryParamMap.get('accnumber');
    this.route.queryParamMap.subscribe(queryParams => {
      this.accnumber = queryParams.get('accnumber');
    });

    this.custnumber = this.route.snapshot.queryParamMap.get('custnumber');
    this.route.queryParamMap.subscribe(queryParams => {
      this.custnumber = queryParams.get('custnumber');
    });

    // get files
    this.getfileshistory(this.custnumber);
  }

  getfileshistory(custnumber) {
    this.ecolService.getfileshistory(custnumber).subscribe(data => {
      this.files = data;
      this.dataService.pushFile(data.length);
    });
  }

  downloadFile(filepath, filename) {
    this.ecolService.downloadFile(filepath).subscribe(data => {
      saveAs(data, filename);
    }, error => {
      console.log(error.error);
      swal('Error!', ' Cannot download  file!', 'error');
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.get('avatar').setValue(file);
    }
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('avatar', this.form.get('avatar').value);

    this.ecolService.uploadFile2(formData).subscribe(
      (res) => {
        this.uploadResponse = res;
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

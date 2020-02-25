import {Component, Injectable, ViewChild} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';
import {$NBSP} from 'codelyzer/angular/styles/chars';
import {NgForm} from '@angular/forms';

const WIKI_URL = 'http://localhost:3000/api/tqall/search';
const PARAMS = new HttpParams({
  fromObject: {
    page: '0',
    limit: '10'
  }
});



@Injectable()
export class EcollectService {
  private rows: any;
  constructor(private http: HttpClient) {
  }

  search(term: string) {
    if (term === '') {
      return of([]);
    }

    return this.http
      .get(WIKI_URL, {params: PARAMS.set('searchtext', term)})

      .pipe(map(response => response['rows']));


  }


}


@Component({
    selector: 'app-newcase',
  templateUrl: './newcase.component.html',
  providers: [EcollectService],
  styleUrls: ['./newcase.component.scss']
})
export class NewcaseComponent {

  constructor(private _service: EcollectService) {
  }

  @ViewChild('f') signupForm: NgForm;
  searching = false;
  searchFailed = false;
  rows: [];
  model: any;
  CLIENT_NAME: any;
  custnumber: any;
  CUSTNUMBER: any;
  SETTLEACCNO: any;
  FILENO: any;
  REGION: any;
  ADDRESSLINE1: any;
  MANAGER: any;
  COLOFFICER: any;
  ACTIONDATE: any;
  value: any;
  customernumber: any;
  accountnumber: any;
  loansettlementacc: any;
  customername: any;
  region: any;
  void: any;
  ACCNUMBER: any;
  first: any;
  submitted = false;

  search = (text$:  Observable<any>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this._service.search(term).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )


// for the search input
  inputFormatBandListValue(value: any)   {

    if (value.CLIENT_NAME ) {
      return [ 'CUSTNUMBER=>' + value.CUSTNUMBER, 'ACCNUMBER=>' + value.ACCNUMBER, 'CLIENTNAME=>' +  value.CLIENT_NAME ];
    }

    return value;

  }

  // was trying a new approach same result
  inputFormatBandListValue2(value: any)   {
    this.custnumber = value.CUSTNUMBER;
      return  this.custnumber;
  }

  inputFormatBandListValue3(value: any)   {

    return  value.CLIENT_NAME;
  }

  inputFormatBandListValue4(value: any)   {

    return  value.ACCNUMBER;
  }

  inputFormatBandListValue5(value: any)   {

    return  value.SETTLEACCNO;
  }

  inputFormatBandListValue6(value: any)   {

    return  value.FILENO;
  }

  inputFormatBandListValue7(value: any)   {

    return  value.REGION;
  }

  inputFormatBandListValue8(value: any)   {

    return  value;
  }

  inputFormatBandListValue9(value: any)   {

    return  value.MANAGER;
  }

  inputFormatBandListValue10(value: any)   {

    return  value.COLOFFICER;
  }

  inputFormatBandListValue11(value: any)   {

    return  value.ACTIONDATE;
  }

  resultFormatBandListValue(value: any) {
    return [value.CUSTNUMBER, value.ACCNUMBER, value.CLIENT_NAME ];
  }

//   onSubmit() {
//     this.submitted = true;
// this.user.accountnumber = this.signupForm.value.subdata.accountnumber;
// console.log(this.user.customername);
//     this.user.custnumber = this.signupForm.value.subdata.custnumber;
//     this.user.customername = this.signupForm.value.subdata.customername;
//     console.log(this.user.customername);
//     this.user.loansettlementacc = this.signupForm.value.subdata.loansettlementacc;
//     this.user.region = this.signupForm.value.subdata.region;
//
//     // console.log(this.signupForm);
//   }

  onSubmitted(event: any) {
    this.submitted = true;
    console.log();
    this.customernumber = event.target.custnumber.value;
    this.accountnumber = event.target.accountnumber.value;
    this.customername = event.target.customername.value;
    this.loansettlementacc = event.target.loansettlementacc.value;
    this.custnumber = event.target.custnumber.value;
    this.region = event.target.region.value;

  }

}

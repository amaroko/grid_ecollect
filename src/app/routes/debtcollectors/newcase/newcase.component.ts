import {Component, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';
import {$NBSP} from 'codelyzer/angular/styles/chars';

const WIKI_URL = 'http://localhost:3000/api/tqall/search';
const PARAMS = new HttpParams({
  fromObject: {
    page: '0',
    limit: '10'
  }
});



@Injectable()
export class EcollectService {
  constructor(private http: HttpClient) {}

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
export class NewcaseComponent  {

  constructor(private _service: EcollectService) {}

  model: any = {};
  searching = false;
  searchFailed = false;
  rows: [];
  CLIENT_NAME: any;
  CUSTNUMBER: any;
  value: any;
  names: any;
  clientname: any;
  ACCNUMBER: any;
  first: any;

  search = (text$:  Observable<string>) =>
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

  inputFormatBandListValue(value: any)   {

    if (value.CLIENT_NAME ) {
      return [ 'CUSTNUMBER=>' + value.CUSTNUMBER, 'ACCNUMBER=>' + value.ACCNUMBER, 'CLIENTNAME=>' +  value.CLIENT_NAME ];


    }

    return value;

  }

  resultFormatBandListValue(value: any) {
    return [value.CUSTNUMBER, value.ACCNUMBER, value.CLIENT_NAME ];
  }


}

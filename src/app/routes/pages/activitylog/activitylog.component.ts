import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../core/settings/settings.service';
import { ActivatedRoute } from '@angular/router';
import { EcolService } from '../../../services/ecol.service';
import { DataService } from '../../../services/data.service';
import { environment } from '../../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

const URL = environment.valor;

@Component({
  selector: 'app-activitylog',
  templateUrl: './activitylog.component.html',
  styleUrls: ['./activitylog.component.scss']
})
export class ActivityLogComponent implements OnInit {

  ptp = 0;
  notes: number;
  totalcontacts: number;
  totalcollaterals: number;
  totalguarantors: number;
  totalfiles: number;

  constructor(
    public settings: SettingsService,
    private route: ActivatedRoute,
    private ecolService: EcolService,
    public dataService: DataService,
    private spinner: NgxSpinnerService
    ) {
      // test service
      dataService.getTestData().subscribe(data => {
        this.ptp = data;
      });

      dataService.getNotesData().subscribe(data => {
        this.notes = data;
      });

      dataService.getCollateral().subscribe(data => {
        this.totalcollaterals = data;
      });

      dataService.getContacts().subscribe(data => {
        this.totalcontacts = data;
      });

      dataService.getGuarantors().subscribe(data => {
        this.totalguarantors = data;
      });

      dataService.getFiles().subscribe(data => {
        this.totalfiles = data;
      });

      dataService.getPtps().subscribe(data => {
        this.totalPtps = data;
      });
  }

  accnumber: string;
  custnumber: string;
  accountdetails: any;
  guarantors: [];
  model: any = {};
  bodyletter: any = {};
  filepath: string;
  demands: any;
  file: string;
  smsMessage: string;
  username: string;
  date = new Date();
  sys: string;
  collateralmenu = true;
  guarantorsmenu = true;
  demandlettersmenu = true;
  autodial_telnumber: string;
  files: any = [];
  totalTeles: number;
  totalPtps: number;
  teles: any = [];
  plan = 'NONE';

  ngOnInit() {
    // check if logged in
    this.ecolService.ifLogged();
    this.ecolService.ifclosed();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.username = currentUser.USERNAME;

    this.accnumber = this.route.snapshot.queryParamMap.get('accnumber');
    this.route.queryParamMap.subscribe(queryParams => {
      this.accnumber = queryParams.get('accnumber');
    });

    /* this.username = this.route.snapshot.queryParamMap.get('username');
    this.route.queryParamMap.subscribe(queryParams => {
      this.username = queryParams.get('username');
    });*/

    this.custnumber = this.route.snapshot.queryParamMap.get('custnumber');
    this.route.queryParamMap.subscribe(queryParams => {
      this.custnumber = queryParams.get('custnumber');
    });

    this.sys = this.route.snapshot.queryParamMap.get('sys');
    this.route.queryParamMap.subscribe(queryParams => {
      this.sys = queryParams.get('sys');
    });

    // this.data.currentMessage.subscribe(message => this.message = message)

    // get account details
    if (this.sys === 'cc') {
      this.getcard(this.accnumber);
      this.collateralmenu = false;
      this.guarantorsmenu = false;
    } else if (this.sys === 'watchcc') {
      this.getwatchcard(this.accnumber);
      this.collateralmenu = false;
      this.guarantorsmenu = false;
      this.demandlettersmenu = false;
    } else if (this.sys === 'mcoopcash') {
      this.getmcoopcashaccount(this.accnumber);
      this.collateralmenu = false;
      this.guarantorsmenu = false;
      this.demandlettersmenu = false;
    } else if (this.sys === 'watch') {
      this.getwatch(this.accnumber);
      this.collateralmenu = false;
      this.guarantorsmenu = true;
      this.demandlettersmenu = false;
    } else {
      this.getaccount(this.accnumber);
    }

    // get files
    this.getfileshistory(this.custnumber);
    // notes
    this.getNotes(this.custnumber);
    // collateral
    this.getCollateral(this.custnumber);
    // contacts
    this.getContacts(this.custnumber);
    // guarantors
    this.getGuarantors(this.custnumber);
    this.getTeles(this.custnumber);
    this.getptps(this.accnumber);
    this.planexists(this.accnumber);

  }

  getptps(accnumber) {
    this.ecolService.getptps(accnumber).subscribe(data => {
      this.totalPtps = data.length;
    }, error => {
      console.log(error);
    });
  }

  planexists(accnumber) {
    this.ecolService.s_check_account_plans(accnumber).subscribe(data => {
      // check if there if a plan
      if (data && data.length) {
        this.ecolService.single_s_plans(data[0].planid).subscribe(plandata => {
          this.plan = plandata.plantitle;
        });

      }
    }, error => {
      console.log(error);
    });
  }


  getcard(cardacct) {
    this.ecolService.getcardAccount(cardacct).subscribe(data => {
      this.accountdetails = data[0];
      this.model.accnumber = data[0].cardacct;
      this.model.custnumber = data[0].cardacct;
      this.model.addressline1 = data[0].address;
      this.model.postcode = data[0].rpcode;
      this.model.emailaddress = data[0].emailaddress;
      this.model.celnumber = data[0].celnumber;
      // tslint:disable-next-line:max-line-length
      this.autodial_telnumber = this.accountdetails.cellnumber || this.accountdetails.mobile || this.accountdetails.phonenumber || this.accountdetails.telnumber || this.accountdetails.celnumber;

    });
  }

  getwatchcard(cardacct) {
    this.ecolService.getWatchcardAccount(cardacct).subscribe(data => {
      this.accountdetails = data[0];
      this.model.accnumber = data[0].cardacct;
      this.model.custnumber = data[0].cardacct;
      this.model.addressline1 = data[0].address;
      this.model.postcode = data[0].rpcode;
      this.model.emailaddress = data[0].emailaddress;
      this.model.celnumber = data[0].celnumber;
      // tslint:disable-next-line:max-line-length
      this.autodial_telnumber = this.accountdetails.cellnumber || this.accountdetails.mobile || this.accountdetails.phonenumber || this.accountdetails.telnumber || this.accountdetails.celnumber;

    }, error => {
      //
    });
  }

  getTeles(custnumber) {
    this.ecolService.allteles(custnumber).subscribe(response => {
      this.teles = response.data;
      this.totalTeles = response.data.length;
    });
  }

  getNotes(custnumber) {
    this.ecolService.totalnotes(custnumber).subscribe(data => {
      this.notes = data[0].TOTAL;
    });
  }

  getfileshistory(custnumber) {
    this.ecolService.getfileshistory(custnumber).subscribe(data => {
      this.files = data;
      this.totalfiles = data.length;
    });
  }

  getGuarantors(custnumber) {
    this.ecolService.totalguarantors(custnumber).subscribe(data => {
      this.totalguarantors = data[0].TOTAL;
    });
  }

  getContacts(custnumber) {
    this.ecolService.totalcontacts(custnumber).subscribe(data => {
      this.totalcontacts = data[0].TOTAL;
    });
  }

  getCollateral(custnumber) {
    this.ecolService.totalcollaterals(custnumber).subscribe(data => {
      this.totalcollaterals = data[0].TOTAL;
    });
  }

  getaccount(accnumber) {
    this.spinner.show();
    this.ecolService.getAccount(accnumber).subscribe(data => {
      this.accountdetails = data[0];
      this.guarantors = data[0].guarantors;
      this.model.accnumber = data[0].accnumber;
      this.model.custnumber = data[0].custnumber;
      this.model.addressline1 = data[0].addressline1;
      this.model.postcode = data[0].postcode;
      this.model.emailaddress = data[0].emailaddress;
      this.model.celnumber = data[0].celnumber;
      // tslint:disable-next-line:max-line-length
      this.autodial_telnumber = this.accountdetails.cellnumber || this.accountdetails.mobile || this.accountdetails.phonenumber || this.accountdetails.telnumber || this.accountdetails.celnumber;
      this.spinner.hide();
    });
  }

  getmcoopcashaccount(accnumber) {
    this.ecolService.getmcoopcashAccount(accnumber).subscribe(data => {
      this.accountdetails = data[0];
      this.model.accnumber = data[0].loanaccnumber;
      this.model.custnumber = data[0].loanaccnumber;
      this.model.addressline1 = data[0].address;
      this.model.postcode = data[0].postcode;
      this.model.celnumber = data[0].phonenumber;
      // tslint:disable-next-line:max-line-length
      this.autodial_telnumber = this.accountdetails.cellnumber || this.accountdetails.mobile || this.accountdetails.phonenumber || this.accountdetails.telnumber || this.accountdetails.celnumber;
    });
  }

  getwatch(accnumber) {
    this.ecolService.getwatch(accnumber).subscribe(data => {
      this.accountdetails = data;
      this.guarantors = data.guarantors;
      this.model.accnumber = data.accnumber;
      this.model.custnumber = data.custnumber;
      this.model.addressline1 = data.addressline1;
      this.model.postcode = data.postcode;
      this.model.emailaddress = data.emailaddress;
      this.model.celnumber = data.celnumber;
    });
  }

  changeAutodialNumber(telnumber) {
    this.autodial_telnumber = telnumber;
  }

  refreshTeles() {
    this.getTeles(this.custnumber);
    alert('contacts refreshed!!');
  }

  dialAvaya() {
    alert('avaya integration in progress!!!');
  }

  // Changes colour of Account Plan Background, if None, will be red, if not none, will be Green
  getColor() {
    return this.plan !== 'NONE' ? '#7ac142' : 'red';
  }
}

import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { ApiService } from 'src/app/providers/api.service';
import * as moment from 'moment';
import {
  LoadingController,
  NavController,
  PopoverController,
} from '@ionic/angular';
import { AuthService } from 'src/app/guard/auth.service';

@Component({
  selector: 'app-agriculture',
  templateUrl: './agriculture.page.html',
  styleUrls: ['../bridges/bridges.page.scss'],
})
export class AgriculturePage implements OnInit {
  taluks_data: any = [];
  districts_data: any = [];
  firkas_data: any = [];
  villages_data: any = [];

  district_id;
  taluk_id;
  firka_id;
  village_id;

  type_of_farmers;
  rainfed_area;
  irrigated_area;
  perennial_area;
  farmers_rainfed;
  farmers_irrigated;
  farmers_perennial;

  today;
  minDate;
  constructor(
    private api: ApiService,
    private popoverctrl: PopoverController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private navCtrl: NavController
  ) {
    this.getDistricts();
    this.minDate = moment('2024-01-01')
      .utcOffset('+05:30')
      .format('YYYY-MM-DD');
    this.today = moment().utcOffset('+05:30').format('yyyy-MM-DD');
  }

  ngOnInit() {}

  getDistricts() {
    this.api
      .get_master_districts()
      .pipe(take(1))
      .subscribe((data) => {
        this.districts_data = data;
        console.log('district data..', this.districts_data);
        this.district_id = localStorage.getItem('district_id');
        this.getTaluks();
      });
  }
  getTaluks() {
    console.log('dis id', this.district_id);
    this.taluks_data = [];
    this.taluk_id = null;
    this.api
      .get_master_taluks_by_district_id({ id: this.district_id })
      .pipe(take(1))
      .subscribe((data) => {
        this.taluks_data = data;
        console.log('taluk data..', this.taluks_data);
      });
  }

  getFirkas() {
    console.log('taluk id', this.taluk_id);
    this.firkas_data = [];
    this.firka_id = null;

    this.api
      .get_master_firkas_by_taluk_id({ id: this.taluk_id })
      .pipe(take(1))
      .subscribe((data) => {
        this.firkas_data = data;
        console.log('firka data..', this.firkas_data);
      });
  }

  getVillages() {
    console.log('firk id', this.firka_id);
    this.villages_data = [];
    this.village_id = null;

    this.api
      .get_master_villages_by_firka_id({ id: this.firka_id })
      .pipe(take(1))
      .subscribe((data) => {
        this.villages_data = data;
        console.log('village data..', this.villages_data);
      });
  }

  submit() {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        cssClass: 'loading-backdrop',
        mode: 'ios',
      })
      .then((loadingEl) => {
        loadingEl.present();
        var params = JSON.stringify({
          extra_param: 'crop',
          district_id: this.district_id,
          taluk_id: this.taluk_id,

          type_of_farmers: this.type_of_farmers,
          rainfed_area: this.rainfed_area,
          irrigated_area: this.irrigated_area,
          perennial_area: this.perennial_area,
          farmers_rainfed: this.farmers_rainfed,
          farmers_irrigated: this.farmers_irrigated,
          farmers_perennial: this.farmers_perennial,

          dept_id: localStorage.getItem('dept_id'),
          user_id: localStorage.getItem('username'),
          created_on: moment()
            .utcOffset('+05:30')
            .format('YYYY-MM-DD HH:mm:ss'),
        });
        console.log('param', params);
        this.api
          .generic_post(
            'https://beta-tnsmart.rimes.int/index.php/API/Memorandum/post_data',
            params
          )
          .pipe(take(1))
          .subscribe(
            (data) => {
              console.log(data);

              loadingEl.dismiss();
              if (data['status'] == 'error') {
                this.authService.showAlert('Oops!', data['message']);
              } else {
                this.authService.showAlert(data['status'], data['message']);
                this.navCtrl.back();
              }
            },
            (err) => {
              console.log('ERROR!: ', err);
              loadingEl.dismiss();
              this.authService.showAlert('Failed!', 'Try again');
            }
          );
      });
  }
}

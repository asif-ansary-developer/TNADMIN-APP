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
  selector: 'app-human-injury',
  templateUrl: './human-injury.page.html',
  styleUrls: ['../bridges/bridges.page.scss'],
})
export class HumanInjuryPage implements OnInit {
  taluks_data: any = [];
  districts_data: any = [];
  firkas_data: any = [];
  villages_data: any = [];

  district_id;
  taluk_id;
  firka_id;
  village_id;

  victim_name;
  injury_cause;
  injury_date;
  days;

  today;
  minDate;

  damage_causes: any = [];
  constructor(
    private api: ApiService,
    private popoverctrl: PopoverController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private navCtrl: NavController
  ) {
    this.getDistricts();
    this.getDamageCauses();
    this.minDate = moment('2024-01-01')
      .utcOffset('+05:30')
      .format('YYYY-MM-DD');
    this.today = moment().utcOffset('+05:30').format('yyyy-MM-DD');
  }

  ngOnInit() {}

  getDamageCauses() {
    this.api
      .get_mem_damage_cause_type()
      .pipe(take(1))
      .subscribe((data) => {
        this.damage_causes = data;
        console.log('damage_causes..', this.damage_causes);
      });
  }
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

  dateChangeEvent(e) {
    this.popoverctrl.dismiss();

    console.log('selected_date', e.detail.value);
    this.injury_date = e.detail.value;
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
          extra_param: 'human_injury',
          district_id: this.district_id,
          taluk_id: this.taluk_id,
          firka_id: this.firka_id,
          village_id: this.village_id,
          victim_name: this.victim_name,
          cause_of_injury: this.injury_cause,
          date_of_injury: this.injury_date,
          no_of_days_hospitalized: this.days,
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

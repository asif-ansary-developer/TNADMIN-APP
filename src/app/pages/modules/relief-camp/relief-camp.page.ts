import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { ShelterListPage } from './shelter-list/shelter-list.page';
import { take } from 'rxjs';
import { ApiService } from 'src/app/providers/api.service';
import { AuthService } from 'src/app/guard/auth.service';

@Component({
  selector: 'app-relief-camp',
  templateUrl: './relief-camp.page.html',
  styleUrls: ['./relief-camp.page.scss'],
})
export class ReliefCampPage implements OnInit {
  totalFamilies: any = 0;
  totalEvacuees: any = 0;
  totalFood: any = 0;
  totalEvacueesReturned: any = 0;
  totalMale: any = 0;
  totalFemale: any = 0;
  totalOthers: any = 0;
  totalChildren: any = 0;
  shelter;
  duration;
  modalState = false;
  rc_data = [];

  district;
  taluk;
  village;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private api: ApiService,
    private authService: AuthService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

  onModelChange(field) {
    const fields = [
      'totalFamilies',
      'totalEvacuees',
      'totalFemale',
      'totalMale',
      'totalOthers',
      'totalChildren',
      'totalFood',
      'totalEvacueesReturned',
    ];

    if (fields.includes(field)) {
      this[field] = this[field] == '' || this[field] == null ? 0 : this[field];
    }

    this.totalEvacuees =
      Number(this.totalMale || 0) +
      Number(this.totalFemale || 0) +
      Number(this.totalOthers || 0) +
      Number(this.totalChildren || 0);
  }

  increment(field) {
    const fields = [
      'totalFamilies',
      'totalEvacuees',
      'totalFemale',
      'totalMale',
      'totalOthers',
      'totalChildren',
      'totalFood',
      'totalEvacueesReturned',
    ];

    if (fields.includes(field)) {
      this[field] = this[field] == null ? 1 : Number(this[field]) + 1;
    }

    this.totalEvacuees =
      Number(this.totalMale || 0) +
      Number(this.totalFemale || 0) +
      Number(this.totalOthers || 0) +
      Number(this.totalChildren || 0);
  }

  decrement(field) {
    const fields = [
      'totalFamilies',
      'totalEvacuees',
      'totalFemale',
      'totalMale',
      'totalOthers',
      'totalChildren',
      'totalFood',
      'totalEvacueesReturned',
    ];

    if (fields.includes(field)) {
      this[field] =
        this[field] == '' || this[field] == null || this[field] <= 0
          ? 0
          : this[field] - 1;
    }

    this.totalEvacuees =
      Number(this.totalMale || 0) +
      Number(this.totalFemale || 0) +
      Number(this.totalOthers || 0) +
      Number(this.totalChildren || 0);
  }

  async presentModal() {
    if (!this.modalState) {
      this.modalState = true;
      const modal = await this.modalCtrl.create({
        component: ShelterListPage,
        cssClass: 'shelter-li-popup',
        componentProps: {
          // username:
          //   this.role == '94' ||
          //   this.role == '96' ||
          //   this.role == '98' ||
          //   this.role == '1'
          //     ? this.raiser_id
          //     : '',
        },
      });

      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned != null) {
          console.log(dataReturned);
          if (
            dataReturned['data'] != undefined &&
            dataReturned['data'] != null
          ) {
            if (
              dataReturned['data']['relief_center'] != null ||
              dataReturned['data']['relief_center'] != undefined
            ) {
              this.rc_data = dataReturned['data']['relief_center'];
              this.shelter = this.rc_data['rc_name'];
              this.taluk = this.rc_data['taluk_name'];
              this.district = this.rc_data['district_name'];
              this.village = this.rc_data['village_name'];
            }
          } else {
            this.shelter = null;
            this.taluk = null;
            this.district = null;
            this.village = null;
          }
        }
        this.modalState = false;
      });
      return await modal.present().then(() => {});
    }
  }

  submitEntry() {
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
          username: localStorage.getItem('username'),
          rc_id: this.rc_data['relief_center_id'],
          rc_name: this.shelter,
          taluk_id: this.rc_data['taluk_id'],
          district_id: this.rc_data['district_id'],
          address: this.village + ', ' + this.taluk + ', ' + this.district,
          family: this.totalFamilies,
          male: this.totalMale,
          female: this.totalFemale,
          children: this.totalChildren,
          others: this.totalOthers,
          evacuees: this.totalEvacuees,
          evacuees_returned: this.totalEvacueesReturned,
          food: this.totalFood,
          duration: this.duration,
          extra_param: 'submit_entry',
        });

        console.log('param', params);
        this.api
          .post_relief_Shelters(params)
          .pipe(take(1))
          .subscribe(
            (data) => {
              console.log(data);
              loadingEl.dismiss();
              if (data['error'] != undefined) {
                this.authService.showAlert('Oops!', data['error']);
              } else {
                this.authService.showAlert(data['title'], data['msg']);
                this.navCtrl.navigateBack('/home');
              }
              // if (typeof data === 'string') {
              //   this.authService.showAlert(
              //     'Success!',
              //     'Ticket created'
              //   );
              //   this.navCtrl.back();
              // } else {
              //   this.authService.showAlert('Oops!', data['error']);
              // }
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

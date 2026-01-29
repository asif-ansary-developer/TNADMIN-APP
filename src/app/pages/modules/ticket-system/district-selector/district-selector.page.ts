import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api.service';

@Component({
  selector: 'app-district-selector',
  templateUrl: './district-selector.page.html',
  styleUrls: ['./district-selector.page.scss'],
})
export class DistrictSelectorPage implements OnInit {
  districts: any = [];
  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private api: ApiService
  ) {
    this.lang = localStorage.getItem('language');
    this.getDistricts();
  }
  lang;
  ngOnInit() {}

  getDistricts() {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        cssClass: 'loading-backdrop',
        mode: 'ios',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.api.get_all_district().subscribe(
          (data: any) => {
            this.districts = data;
            if (this.districts.length != 0) {
              console.log('dists', data);
            } else console.log('dists', data);
            loadingEl.dismiss();
          },
          (error) => {
            loadingEl.dismiss();
          }
        );
      });
  }
  getSelectedDistrict(dis_id) {
    console.log('selected district', dis_id);
    this.modalCtrl.dismiss({
      district: this.districts.filter((data: any) => {
        return data.district_id == dis_id;
      }),
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}

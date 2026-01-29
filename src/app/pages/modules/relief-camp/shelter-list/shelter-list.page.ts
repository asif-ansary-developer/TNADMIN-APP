import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api.service';

@Component({
  selector: 'app-shelter-list',
  templateUrl: './shelter-list.page.html',
  styleUrls: ['./shelter-list.page.scss'],
})
export class ShelterListPage implements OnInit {
  searchTerm;
  filtered_list;
  public shelter_list: any = [];

  constructor(
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {
    this.getSheleterList();
  }

  ngOnInit() {}
  closeModal() {
    this.modalCtrl.dismiss();
  }

  getSelectedShelter(rc) {
    console.log('selected releif center', rc);
    this.api
      .get_relief_Shelter_dis_tal_id({ id: rc['rc_village_id'] })
      .subscribe((data: any) => {
        var shelter_info = data;
        if (shelter_info?.length != 0) {
          rc['district_id'] = shelter_info[0]['district_id'];
          rc['district_name'] = shelter_info[0]['district_name'];
          rc['taluk_id'] = shelter_info[0]['taluk_id'];
          rc['taluk_name'] = shelter_info[0]['taluk_name'];
          rc['village_name'] = shelter_info[0]['village_name'];
          this.modalCtrl.dismiss({
            relief_center: rc,
          });
        }
      });
  }

  async filterItems(ev: any) {
    this.searchTerm = ev.target.value;
    console.log('searchterm', this.searchTerm);
    if (this.searchTerm && this.searchTerm.trim() != '') {
      var s_term = this.searchTerm;
      // var s_term = 'ARG' + this.searchTerm;
      // console.log(s_term);
      this.filtered_list = await this.shelter_list.filter((item) => {
        return item.rc_name.toLowerCase().includes(s_term.toLowerCase());
      });
      console.log(this.filtered_list);
    } else {
      this.filtered_list = this.shelter_list;
    }
  }

  getSheleterList() {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        cssClass: 'loading-backdrop',
        mode: 'ios',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.api
          .get_relief_Shelters({ id: localStorage.getItem('username') })
          .subscribe(
            (data) => {
              this.shelter_list = data;
              if (this.shelter_list.length != 0) {
                console.log('shelters', data);
                this.filtered_list = this.shelter_list;
              } else console.log('arg shelters', data);

              loadingEl.dismiss();
            },
            (error) => {
              loadingEl.dismiss();
            }
          );
      });
  }
}

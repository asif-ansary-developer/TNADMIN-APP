import { Component, OnInit } from '@angular/core';
import { StationListPage } from '../station-list/station-list.page';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-fence-status',
  templateUrl: './fence-status.page.html',
  styleUrls: ['./fence-status.page.scss'],
})
export class FenceStatusPage implements OnInit {
  stationCode;
  modalState = false;
  username;
  lang;
  selected_station: any = [];
  stations: any = [];
  districts_data: any = [];

  district_id;

  constructor(private modalCtrl: ModalController, private api: ApiService) {
    this.lang = localStorage.getItem('language');
    this.username = localStorage.getItem('username');
  }

  ngOnInit() {
    this.getDistricts();
  }

  getDistricts() {
    this.api
      .get_master_districts()
      .pipe(take(1))
      .subscribe((data) => {
        this.districts_data = data;
        console.log('district data..', this.districts_data);
      });
  }

  getStationsByDistrict() {
    this.api
      .get_station_status_by_district_id({ id: this.district_id })
      .subscribe((data) => {
        console.log('stations', data);
        this.stations = data;
      });
  }

  setSelectedStation() {
    this.selected_station = this.stations.filter(
      (data) => data.station_code == this.stationCode
    );
    console.log(this.stationCode);
    console.log(this.selected_station);
  }

  async presentModal() {
    if (!this.modalState) {
      this.modalState = true;
      const modal = await this.modalCtrl.create({
        component: StationListPage,
        cssClass: 'station-li-popup',
        componentProps: {
          username: this.username,
        },
      });
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned != null) {
          console.log(dataReturned);
          if (
            dataReturned['data'] != undefined &&
            dataReturned['data'] != null
          ) {
            if (dataReturned['data']['station'].length != 0) {
              this.selected_station = dataReturned.data['station'];
              console.log(this.selected_station);
              this.stationCode = this.selected_station[0]['station_code'];
              this.district_id = this.selected_station[0]['district_id'];
            }
          } else {
            this.stationCode = null;
            this.district_id = null;
          }
        }
        this.modalState = false;
      });
      return await modal.present().then(() => {});
    }
  }
}

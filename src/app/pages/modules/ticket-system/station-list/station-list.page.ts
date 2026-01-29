import {
  NavController,
  ModalController,
  LoadingController,
} from '@ionic/angular';

import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/providers/api.service';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.page.html',
  styleUrls: ['./station-list.page.scss'],
})
export class StationListPage implements OnInit {
  public district_data: any;
  public taluk_data: any;
  public user_data: any = [];
  public user_datum: any = [];
  public result_data: any;
  public fav_loc_data: any;
  public fav_loc_data_: any;
  public success_data: any;
  block_id: string;
  user_id: string;
  search_item: string;
  found_data: any = [];
  items: any;
  filtereditems: any;
  searchTerm: string = '';
  exists: boolean;
  checked_state: string;
  lang: string;
  lHelper;
  get_notifications: any = [];
  latitude;
  longitude;

  // @Input() station_list: any;
  public station_list: any = [];
  filtered_list;
  @Input() username: any;
  @Input() from_page: any;
  role;
  constructor(
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {
    this.lang = localStorage.getItem('language');
    this.role = localStorage.getItem('role');
  }

  ngOnInit() {
    // console.log(this.filtered_list);
    console.log(this.username);
    if (this.username && this.role !== 'ven') {
      console.log('user passed', this.username);

      const usernameLower = this.username.toLowerCase();
      const startsWithPattern = /^(dro|dmt|collr)/;

      if (startsWithPattern.test(usernameLower)) {
        this.getStationListFilteredByResolver();
      } else {
        this.getStationList();
      }
    } else {
      this.getStationList();
    }
  }

  ionViewDidEnter() {}
  ///////sort station code to show in the suggestion box during search
  async filterItems(ev: any) {
    this.searchTerm = ev.target.value;
    console.log('searchterm', this.searchTerm);
    if (this.searchTerm && this.searchTerm.trim() != '') {
      var s_term = this.searchTerm;
      // var s_term = 'ARG' + this.searchTerm;
      // console.log(s_term);
      this.filtered_list = await this.station_list.filter((item) => {
        return item.station_code.toLowerCase().startsWith(s_term.toLowerCase());
        // return item.station_code.toLowerCase().includes(s_term.toLowerCase());
      });
      console.log(this.filtered_list);
    } else {
      this.filtered_list = this.station_list;
    }
  }

  ionViewWllEnter() {}

  closeModal() {
    this.modalCtrl.dismiss();
  }

  getSelectedStationCode(code) {
    console.log('selected station', code);
    this.modalCtrl.dismiss({
      station: this.station_list.filter((data) => {
        return data.station_code == code;
      }),
    });
  }

  getStationList() {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        cssClass: 'loading-backdrop',
        mode: 'ios',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.api.get_arg_stations({ fetch: this.from_page }).subscribe(
          (data) => {
            this.station_list = data;
            if (this.station_list.length != 0) {
              console.log('arg stations', data);
              this.filtered_list = this.station_list;
            } else console.log('arg stations', data);

            loadingEl.dismiss();
          },
          (error) => {
            loadingEl.dismiss();
          }
        );
      });
  }

  getStationListFilteredByResolver() {
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
          .get_arg_stations_by_resolver_id({
            fetch: this.from_page,
            id: this.username,
          })
          .subscribe(
            (data) => {
              this.station_list = data;
              if (this.station_list.length != 0) {
                console.log('arg stationss', data);
                this.filtered_list = this.station_list;
              } else console.log('arg stations', data);

              loadingEl.dismiss();
            },
            (error) => {
              loadingEl.dismiss();
            }
          );
      });
  }
}

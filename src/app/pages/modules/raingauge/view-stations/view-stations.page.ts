import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/guard/auth.service';
import { ApiService } from 'src/app/providers/api.service';

@Component({
  selector: 'app-view-stations',
  templateUrl: './view-stations.page.html',
  styleUrls: ['./view-stations.page.scss'],
})
export class ViewStationsPage implements OnInit {
  stations: any = [];
  preview_state = false;
  img;
  lang;
  canDismiss = true;
  district_id = 2;
  districts_data: any = [];
  loading = false;
  current_page = [1];

  stationLoader: HTMLIonLoadingElement;


  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private authService: AuthService,
    private loadingCtrl: LoadingController
  ) {
    this.lang = localStorage.getItem('language');
  }

  ngOnInit() { }

  ionViewDidEnter() {
    // this.getStations();

    this.district_id = 2;
    this.current_page = [1];
    this.getDistricts();
  }

  // getStations() {
  //   this.loading = true;
  //   // this.api.get_arg_aws_stations().subscribe((data) => {
  //   this.api
  //     .get_arg_aws_stations_by_district_id({
  //       id: this.district_id,
  //       page: this.current_page[0],
  //     })
  //     .subscribe((data) => {
  //       if (data) {
  //         this.stations = data;
  //       }
  //       this.loading = false;
  //       console.log('stations ..', this.stations);
  //     });
  // }

  // getDistricts() {
  //   this.api.get_all_district().subscribe((data) => {
  //     if (data) {
  //       this.districts_data = data;
  //     }
  //     this.loading = false;
  //     console.log('districts ..', this.districts_data);
  //   });
  // }


  getStations() {
    this.loading = true;

    this.api
      .get_arg_aws_stations_by_district_id({
        id: this.district_id,
        page: this.current_page[0],
      })
      .subscribe({
        next: (data) => {
          this.stations = data || [];
          console.log('stations ..', this.stations);
        },
        error: (err) => {
          console.log('Stations error:', err);
          this.loading = false;
          this.stationLoader?.dismiss();
        },
        complete: () => {
          this.loading = false;
          this.stationLoader?.dismiss();
        }
      });
  }



  async getDistricts() {
    const loadingEl = await this.loadingCtrl.create({
      message: 'Loading stations...',
      keyboardClose: true,
      spinner: 'dots',
      cssClass: 'loading-backdrop',
      mode: 'ios',
    });

    await loadingEl.present();
    this.loading = true;

    this.api.get_all_district().subscribe({
      next: (data) => {
        if (data) {
          this.districts_data = data;
        }

        this.district_id = 2;

        const selectedDistrict = this.districts_data.find(
          (district: any) => district.district_id == this.district_id
        );

        const districtName =
          this.lang === 'ta'
            ? selectedDistrict?.t_district_name
            : selectedDistrict?.district_name;

        loadingEl.message = `Loading stations for ${districtName || 'District ID 2'}...`;

        this.stationLoader = loadingEl;

        this.getStations();
      },
      error: (err) => {
        console.log('District error:', err);
        this.loading = false;
        loadingEl.dismiss();
      }
    });
  }






  preview_request = false;
  preview(s_code) {
    this.preview_state = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        cssClass: 'loading-backdrop',
        mode: 'ios',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.api.get_arg_aws_station_img_by_id({ id: s_code }).subscribe(
          (data) => {
            if (data) {
              this.img = data[0]['photo'];
            } else {
              this.authService.showToast('No image!');
            }
            console.log('stations img ..', data);
            loadingEl.dismiss();
          },
          (err) => {
            console.log('ERROR!: ', err);
            loadingEl.dismiss();
            this.preview_state = false;
          }
        );
      });
  }

  ngOnDestroy() {
    if (this.modalCtrl.getTop() != undefined) {
      this.modalCtrl.dismiss();
    }
  }

  getDistrictName(): string {
    const selectedDistrict = this.districts_data.find(
      (district: any) => district.district_id == this.district_id
    );

    if (!selectedDistrict) {
      return '';
    }

    return this.lang === 'ta'
      ? selectedDistrict.t_district_name
      : selectedDistrict.district_name;
  }
}

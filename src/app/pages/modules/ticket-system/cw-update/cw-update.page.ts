import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular';

import { StationListPage } from '../station-list/station-list.page';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { ApiService } from 'src/app/providers/api.service';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { AuthService } from 'src/app/guard/auth.service';

@Component({
  selector: 'app-cw-update',
  templateUrl: './cw-update.page.html',
  styleUrls: ['./cw-update.page.scss'],
})
export class CwUpdatePage implements OnInit {
  img;
  civil_work = '';
  username;
  lang;
  modalState = false;
  selected_station: any = [];
  district_id;
  stationCode;
  coordinate;
  date;
  maxDate;

  latitude: any;
  longitude: any;
  permission = false;
  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private platform: Platform,
    private locationAccuracy: LocationAccuracy,
    private navCtrl: NavController,
    private api: ApiService
  ) {
    this.lang = localStorage.getItem('language');
    this.username = localStorage.getItem('username');
    this.maxDate = moment().utcOffset('+05:30').format('yyyy-MM-DD');
  }

  ngOnInit() {
    this.requestPermission();
  }

  async requestPermission() {
    try {
      const status = await Geolocation.checkPermissions();
      console.log('First status...', JSON.stringify(status));

      if (
        status.location === 'granted' &&
        status.coarseLocation === 'granted'
      ) {
        this.permission = true;
        this.getLocation();
      } else {
        console.log('Default status...', JSON.stringify(status));
        this.permission = false;
        await this.requestGeolocationPermission();
      }
    } catch (err) {
      console.error(err);
      this.turnOnGPS();
    }
  }

  async requestGeolocationPermission() {
    try {
      const permissionStatus = await Geolocation.requestPermissions();
      console.log(
        'Request permission status...',
        JSON.stringify(permissionStatus)
      );

      if (
        permissionStatus.location === 'granted' &&
        permissionStatus.coarseLocation === 'granted'
      ) {
        this.permission = true;
        this.getLocation();
      } else {
        this.permission = false;
        this.authService.showToast('Please enable Location permission!');
      }
    } catch (err) {
      console.error('Error requesting location permissions', err);
      this.authService.showToast('Failed to request location permissions!');
    }
  }

  async turnOnGPS() {
    if (this.platform.is('android')) {
      try {
        await this.locationAccuracy.request(
          this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
        );
        console.log('Request successful');
        this.requestPermission();
      } catch (error) {
        console.error('Error requesting location permissions', error);
        this.authService.showToast('Failed to enable high accuracy location!');
      }
    } else {
      this.getLocation();
    }
  }

  async getLocation() {
    console.log('getiing location');
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1,
    })
      .then((data) => {
        console.log(JSON.stringify(data));

        this.latitude = data.coords.latitude;
        this.longitude = data.coords.longitude;
        this.coordinate = this.latitude + ' | ' + this.longitude;
      })
      .catch((err) => {
        console.log(err, 'Error getting location!');
        this.authService.showToast('Error getting location!');
      });
  }

  async presentModal() {
    if (!this.modalState) {
      this.modalState = true;
      const modal = await this.modalCtrl.create({
        component: StationListPage,
        cssClass: 'station-li-popup',
        componentProps: {
          username: this.username,
          from_page: 'cw-update',
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

  async getPhoto() {
    var buttons = [
      {
        text: this.lang == 'en' ? 'Camera' : 'கேமரா',
        handler: () => {
          this.getCamera(1);
        },
      },
      {
        text: this.lang == 'en' ? 'Gallery' : 'கேலரி',
        handler: () => {
          this.getCamera(2);
        },
      },
      {
        text: this.lang == 'en' ? 'Cancel' : 'ரத்துசெய்',
        role: 'cancel',
        handler: () => {},
      },
    ];

    (await this.actionSheetCtrl.create({ buttons: buttons })).present();
  }

  getCamera = (src) => {
    Camera.checkPermissions().then((status) => {
      if (status.camera == 'granted' && status.photos == 'granted') {
        switch (src) {
          case 1:
            Camera.getPhoto({
              quality: 50,
              allowEditing: false,
              source: CameraSource.Camera,
              resultType: CameraResultType.DataUrl,
            }).then((image) => {
              this.img = image.dataUrl;
            });
            break;

          case 2:
            Camera.getPhoto({
              quality: 50,
              allowEditing: false,
              source: CameraSource.Photos,
              resultType: CameraResultType.DataUrl,
            }).then((image) => {
              this.img = image.dataUrl;
            });
            break;
        }
      } else {
        this.authService.showToast('Please enable camera access');
        Camera.requestPermissions().then((permissionStatus) => {
          console.log(permissionStatus);
          if (
            permissionStatus.camera == 'granted' &&
            permissionStatus.photos == 'granted'
          ) {
            this.getPhoto();
          }
        });
      }
    });
  };

  clearAttachment() {
    this.img = null;
  }

  updateCivilWork() {
    this.civil_work = 'yes';
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
          v_id: this.username,
          station_code: this.stationCode,
          date: this.date,
          img: this.img != null ? this.img : '',
          extra_param: 'update_civil_work',
        });

        console.log('param', params);
        if (this.civil_work == 'yes') {
          this.api
            .post_admin(params)
            .pipe(take(1))
            .subscribe(
              (data) => {
                console.log(data);
                loadingEl.dismiss();
                if (data['error'] != undefined) {
                  this.authService.showAlert('Oops!', data['error']);
                } else {
                  this.authService.showAlert(data['title'], data['msg']);
                  this.navCtrl.navigateBack('/ticket-system');
                }
              },
              (err) => {
                console.log('ERROR!: ', err);
                loadingEl.dismiss();
                this.authService.showAlert('Failed!', 'Try again');
              }
            );
        } else {
          loadingEl.dismiss();
          this.navCtrl.back();
        }
      });
  }
}

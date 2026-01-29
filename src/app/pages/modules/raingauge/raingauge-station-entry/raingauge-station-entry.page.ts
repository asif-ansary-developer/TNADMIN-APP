import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular';
import { StationListPage } from '../station-list/station-list.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from 'src/app/guard/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { Geolocation } from '@capacitor/geolocation';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';

@Component({
  selector: 'app-raingauge-station-entry',
  templateUrl: './raingauge-station-entry.page.html',
  styleUrls: ['./raingauge-station-entry.page.scss'],
})
export class RaingaugeStationEntryPage implements OnInit {
  // @ViewChild('boundary') boundary;

  lang;
  modalState = false;
  selected_station: any;
  stationCode;
  district;
  taluk;
  village;
  maxDate;

  district_id;
  taluk_id;
  firka_id;
  village_id;
  boundary;
  ownership;
  installation;
  date;
  coordinate;
  survey = '';
  surveyy;
  nodal_name;
  nodal_designation;
  nodal_contact;
  img = null;

  sensor_rainfall = false;
  sensor_temp = false;
  sensor_humidity = false;
  sensor_pressure = false;
  sensor_wind_speed = false;
  sensor_wind_direction = false;
  sensor_solar_radiation = false;
  sensor_soil_moisture = false;

  sensors: { label: string; checked: boolean }[] = [
    { label: 'Rainfall', checked: false },
    { label: 'Air Temperature', checked: false },
    { label: 'Relative Humidity', checked: false },
    { label: 'Air Pressure', checked: false },
    { label: 'Wind Speed', checked: false },
    { label: 'Wind Direction', checked: false },
    { label: 'Solar Radiation', checked: false },
    { label: 'Soil Moisture', checked: false },
  ];

  vendor_id;
  latitude: any;
  longitude: any;
  permission = false;

  public districts_data: any = [];
  public taluks_data: any = [];
  public firkas_data: any = [];
  public villages_data: any = [];

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService,
    private actionSheetCtrl: ActionSheetController,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private platform: Platform,
    private locationAccuracy: LocationAccuracy
  ) {
    this.lang = localStorage.getItem('language');
    this.vendor_id = localStorage.getItem('username');
    this.maxDate = moment().utcOffset('+05:30').format('yyyy-MM-DD');

    const words: string[] = ['apple0003', 'banana3', 'orang4e', 'grap3e'];

    const charToSearch: string = '3'; // Character to search for

    const wordsWithChar: string[] = words.filter((word) =>
      word.includes(charToSearch)
    );
    // console.log(wordsWithChar);
  }

  ngOnInit() {
    this.requestPermission();
  }

  ionViewDidEnter() {
    this.getDistricts();
  }

  async presentModal() {
    if (!this.modalState) {
      this.modalState = true;
      const modal = await this.modalCtrl.create({
        component: StationListPage,
        cssClass: 'station-li-popup',
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
              this.district = this.selected_station[0]['district_name'];
              this.taluk = this.selected_station[0]['taluk_name'];
              this.village = this.selected_station[0]['village_name'];

              // this.diff.setFocus();
            }
          } else {
            this.stationCode = null;
            this.district = null;
            this.taluk = null;
            this.village = null;
          }
        }
        this.modalState = false;
      });
      return await modal.present().then(() => {});
    }
  }

  async getPhoto() {
    // var buttons = [
    //   {
    //     text: this.lang == 'en' ? 'Camera' : 'கேமரா',
    //     handler: () => {
    //       this.getCamera(1);
    //     },
    //   },
    //   {
    //     text: this.lang == 'en' ? 'Gallery' : 'கேலரி',
    //     handler: () => {
    //       this.getCamera(2);
    //     },
    //   },
    //   {
    //     text: this.lang == 'en' ? 'Cancel' : 'ரத்துசெய்',
    //     role: 'cancel',
    //     handler: () => {},
    //   },
    // ];

    // (
    //   await this.actionSheetCtrl.create({ buttons: buttons, mode: 'ios' })
    // ).present();

    this.getCamera(1);
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

  getDistricts() {
    this.api
      .get_master_districts()
      .pipe(take(1))
      .subscribe((data) => {
        this.districts_data = data;
        console.log('district data..', this.districts_data);
      });
  }

  updateSensor(sensor: any, checked: boolean) {
    sensor.checked = checked;
  }

  hasCheckedSensors(): boolean {
    return this.sensors.some((sensor) => sensor.checked);
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

  addRaingauge() {
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
          username: this.vendor_id,
          station_code: this.stationCode,
          district_id: this.district_id,
          taluk_id: this.taluk_id,
          firka_id: this.firka_id,
          village_id: this.village_id,
          ownership: this.ownership,
          installation: this.installation,
          date: this.date,
          coordinate: this.coordinate,
          img: this.img != null ? this.img : '',
          nodal_officer_name: this.nodal_name,
          nodal_officer_designation: this.nodal_designation,
          nodal_officer_contact: this.nodal_contact,
          survey_number: this.surveyy,
          sensor_rainfall: this.sensors[0]['checked'] ? 1 : 0,
          sensor_temp: this.sensors[1]['checked'] ? 1 : 0,
          sensor_humidity: this.sensors[2]['checked'] ? 1 : 0,
          sensor_pressure: this.sensors[3]['checked'] ? 1 : 0,
          sensor_wind_speed: this.sensors[4]['checked'] ? 1 : 0,
          sensor_wind_direction: this.sensors[5]['checked'] ? 1 : 0,
          sensor_solar_radiation: this.sensors[6]['checked'] ? 1 : 0,
          sensor_soil_moisture: this.sensors[7]['checked'] ? 1 : 0,
          extra_param: 'add_rainguage_station',
        });

        console.log('param', params);
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
                this.navCtrl.navigateBack('/raingauge');
              }
              // if (typeof data === 'string') {
              //   this.authService.showAlert(
              //     'Success!',
              //     'Rainguage Station added'
              //   );
              //   this.navCtrl.navigateBack('/raingauge');
              // } else {
              //   this.authService.showAlert('Oops!', data['error']);
              // }
            },
            (err) => {
              console.log('ERROR!: ', err);
              console.log('ERROR!: ', JSON.stringify(err));
              loadingEl.dismiss();
              this.authService.showAlert('Failed!', 'Try again');
            }
          );
      });
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
}

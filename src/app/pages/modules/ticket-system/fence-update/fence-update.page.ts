import { Component, OnInit } from '@angular/core';
import { StationListPage } from '../station-list/station-list.page';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/providers/api.service';
import { AuthService } from 'src/app/guard/auth.service';
import * as moment from 'moment';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-fence-update',
  templateUrl: './fence-update.page.html',
  styleUrls: ['./fence-update.page.scss'],
})
export class FenceUpdatePage implements OnInit {
  fence_status = '';
  lang;
  username;
  stationCode;
  district_id;
  selected_station: any;
  modalState = false;
  img;
  date;
  maxDate;

  constructor(
    private modalCtrl: ModalController,
    private api: ApiService,
    private authService: AuthService,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private actionSheetCtrl: ActionSheetController
  ) {
    this.lang = localStorage.getItem('language');
    this.username = localStorage.getItem('username');
    this.maxDate = moment().utcOffset('+05:30').format('yyyy-MM-DD');
  }

  ngOnInit() { }
  updateStatus(status) {
    this.fence_status = status;
  }

  async presentModal() {
    if (!this.modalState) {
      this.modalState = true;

      const modal = await this.modalCtrl.create({
        component: StationListPage,
        cssClass: 'station-li-popup',
        componentProps: {
          username: this.username,
          from_page: 'fence-update',
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
      return await modal.present().then(() => { });
    }
  }

  ngOnDestory() {
    this.modalCtrl.dismiss();
  }

  updateFenceWork() {
    this.fence_status = 'yes';
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        cssClass: 'loading-backdrop',
        mode: 'ios',
      })
      .then((loadingEl) => {
        loadingEl.present();

        var params = {
          v_id: this.username,
          station_code: this.stationCode,
          date: this.date,
          img: this.img != null ? this.img : '',
          extra_param: 'update_fence_work',
        };

        console.log('param', params);

        if (this.fence_status == 'yes') {
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

  clearAttachment() {
    this.img = null;
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
        handler: () => { },
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
}

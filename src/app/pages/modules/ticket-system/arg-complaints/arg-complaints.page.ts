import { ApiService } from 'src/app/providers/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ActionSheetButton,
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  SelectChangeEventDetail,
} from '@ionic/angular';
import { StationListPage } from '../station-list/station-list.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from 'src/app/guard/auth.service';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-arg-complaints',
  templateUrl: './arg-complaints.page.html',
  styleUrls: ['./arg-complaints.page.scss'],
})
export class ArgComplaintsPage implements OnInit {
  @ViewChild('diff') diff;
  lang;
  modalState = false;
  selected_station: any;
  stationCode;
  stationName;
  district;
  district_id;
  firka_id;
  taluk;
  taluk_id;
  village;
  village_id;
  difficultyFaced;
  resolvingEntity;
  raiserName;
  issueDetail;
  imgs: any = [];
  raiser_id;
  role;
  paymentInvolved = '1';

  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private api: ApiService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private alertCtrl: AlertController
  ) {
    this.lang = localStorage.getItem('language');
    this.raiser_id = localStorage.getItem('username');
    this.role = localStorage.getItem('role');
    this.raiserName = localStorage.getItem('name');

    // this.raiser_id = 'dmt_001';
    // this.role = '96';
  }

  ngOnInit() { }

  ionViewDidEnter() { }

  goToHome() {
    this.navCtrl.navigateBack('/ticket-system');
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }

  async presentModal() {
    if (!this.modalState) {
      this.modalState = true;
      console.log(this.role);
      const modal = await this.modalCtrl.create({
        component: StationListPage,
        cssClass: 'station-li-popup',
        componentProps: {
          username:
            this.role == '94' ||
              this.role == '96' ||
              this.role == '98' ||
              this.role == '1'
              ? this.raiser_id
              : '',
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
              this.district = this.selected_station[0]['district_name'];
              this.district_id = this.selected_station[0]['district_id'];
              this.firka_id = this.selected_station[0]['firka_id'];
              this.taluk = this.selected_station[0]['taluk_name'];
              this.stationName = this.selected_station[0]['location_name'];
              // this.taluk_id = this.selected_station[0]['taluk_id'];
              this.village = this.selected_station[0]['village_name'];
              // this.village_id = this.selected_station[0]['village_id'];

              this.diff.setFocus();
            }
          } else {
            this.stationCode = null;
            this.district = null;
            this.district_id = null;
            this.firka_id = null;
            this.taluk = null;
            // this.taluk_id = null;
            this.village = null;
            // this.village_id = null;
          }
        }
        this.modalState = false;
      });
      return await modal.present().then(() => { });
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
            }).then(async (image) => {
              const compressedImage = await this.compressImage(image.dataUrl);

              if (this.imgs.length < 3) {
                this.imgs.push(compressedImage);
              } else {
                this.imgs.shift();
                this.imgs.push(compressedImage);
              }
              if (this.imgs.length === 0) {
                this.imgs[0] = compressedImage;
              }
            });
            break;

          case 2:
            Camera.getPhoto({
              quality: 50,
              allowEditing: false,
              source: CameraSource.Photos,
              resultType: CameraResultType.DataUrl,
            }).then(async (image) => {
              const compressedImage = await this.compressImage(image.dataUrl);

              if (this.imgs.length < 3) {
                this.imgs.push(compressedImage);
              } else {
                this.imgs.shift();
                this.imgs.push(compressedImage);
              }
              if (this.imgs.length === 0) {
                this.imgs[0] = compressedImage;
              }
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

  clearAttachment(index) {
    // this.img = null;
    this.imgs.splice(index, 1);
  }

  reportComplaint() {
    this.alertCtrl
      .create({
        cssClass: 'alert-custom',
        message: 'Submit Complaint?',
        buttons: [
          { text: 'No', role: 'cancel' },
          {
            text: 'Yes',
            role: 'ok',
            handler: async () => {
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
                    username: this.raiser_id,
                    station_code: this.stationCode,
                    station_name: this.stationName,
                    district_name: this.district,
                    district_id: this.district_id,
                    taluk_name: this.taluk,
                    issue: this.difficultyFaced,
                    description: this.issueDetail,
                    img_1: this.imgs[0] != null ? this.imgs[0] : '',
                    img_2: this.imgs[1] != null ? this.imgs[1] : '',
                    img_3: this.imgs[2] != null ? this.imgs[2] : '',
                    extra_param: 'arg_complaints',
                  };
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
                          this.authService.showAlert(
                            data['title'],
                            data['msg']
                          );
                          this.navCtrl.navigateBack('/ticket-system');
                        }
                      },
                      (err) => {
                        console.log('ERROR!: ', JSON.stringify(err));
                        loadingEl.dismiss();
                        this.authService.showAlert('Failed!', 'Try again');
                      }
                    );
                });
            },
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }

  async compressImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const MAX_WIDTH = 600;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = (MAX_WIDTH / width) * height;
            width = MAX_WIDTH;
          } else {
            width = (MAX_HEIGHT / height) * width;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(compressedDataUrl);
      };

      img.onerror = (err) => {
        reject(new Error('Failed to load image for compression: ' + err));
      };
    });
  }
  selectPreventDefault(event) {
    event.preventDefault();
  }
}

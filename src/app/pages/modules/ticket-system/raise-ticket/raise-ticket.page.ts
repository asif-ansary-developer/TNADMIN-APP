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
  selector: 'app-raise-ticket',
  templateUrl: './raise-ticket.page.html',
  styleUrls: ['./raise-ticket.page.scss'],
})
export class RaiseTicketPage implements OnInit {
  @ViewChild('diff') diff;
  lang;
  modalState = false;
  selected_station: any;
  stationCode;
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
  img = null;
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

    this.resolvingEntity = this.role == '1' ? 'ven' : '1';
  }

  ngOnInit() {}

  ionViewDidEnter() {}

  goToHome() {
    this.navCtrl.navigateBack('/ticket-system');
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }

  async presentModal() {
    if (!this.modalState) {
      this.modalState = true;
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

  raiseTicket() {
    this.alertCtrl
      .create({
        cssClass: 'alert-custom',
        message: 'Raise Ticket?',
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

                  var params = JSON.stringify({
                    // author: localStorage.getItem('user_id'),
                    // v_id: 'v001',
                    v_id: this.raiser_id,
                    station_code: this.stationCode,
                    district: this.district,
                    district_id: this.district_id,
                    firka_id: this.firka_id,
                    taluk: this.taluk,
                    village: '',
                    difficulty: this.difficultyFaced,
                    issue: this.issueDetail,
                    raiser_name: this.role == '1' ? this.raiserName : null,
                    resolver: this.resolvingEntity,
                    img: this.img != null ? this.img : '',
                    payment_involved:
                      this.role == '1' && this.resolvingEntity == 'ven'
                        ? this.paymentInvolved
                        : 0,
                    extra_param: 'raise_cwt',
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
                          this.authService.showAlert(
                            data['title'],
                            data['msg']
                          );
                          this.navCtrl.navigateBack('/ticket-system');
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
            },
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }

  selectPreventDefault(event) {
    event.preventDefault();
  }
}

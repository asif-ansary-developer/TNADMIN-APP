import { ApiService } from 'src/app/providers/api.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('imageInput') imageInput: ElementRef<HTMLInputElement>;
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

  images: {
    file: File;
    preview: string;
  }[] = [];

  isTicketSubmitting = false;
  isTicketAlertOpen = false;

  selectedImagePreview: string | null = null;

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
      return await modal.present().then(() => { });
    }
  }

  // async getPhoto() {
  //   var buttons = [
  //     {
  //       text: this.lang == 'en' ? 'Camera' : 'கேமரா',
  //       handler: () => {
  //         this.getCamera(1);
  //       },
  //     },
  //     {
  //       text: this.lang == 'en' ? 'Gallery' : 'கேலரி',
  //       handler: () => {
  //         this.getCamera(2);
  //       },
  //     },
  //     {
  //       text: this.lang == 'en' ? 'Cancel' : 'ரத்துசெய்',
  //       role: 'cancel',
  //       handler: () => { },
  //     },
  //   ];

  //   (await this.actionSheetCtrl.create({ buttons: buttons })).present();
  // }

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

  // raiseTicket() {
  //   this.alertCtrl
  //     .create({
  //       cssClass: 'alert-custom',
  //       message: 'Raise Ticket?',
  //       buttons: [
  //         { text: 'No', role: 'cancel' },
  //         {
  //           text: 'Yes',
  //           role: 'ok',
  //           handler: async () => {
  //             this.loadingCtrl
  //               .create({
  //                 keyboardClose: true,
  //                 spinner: 'dots',
  //                 cssClass: 'loading-backdrop',
  //                 mode: 'ios',
  //               })
  //               .then((loadingEl) => {
  //                 loadingEl.present();

  //                 var params = {
  //                   // author: localStorage.getItem('user_id'),
  //                   // v_id: 'v001',
  //                   v_id: this.raiser_id,
  //                   station_code: this.stationCode,
  //                   district: this.district,
  //                   district_id: this.district_id,
  //                   firka_id: this.firka_id,
  //                   taluk: this.taluk,
  //                   village: '',
  //                   difficulty: this.difficultyFaced,
  //                   issue: this.issueDetail,
  //                   raiser_name: this.role == '1' ? this.raiserName : null,
  //                   resolver: this.resolvingEntity,
  //                   img: this.img != null ? this.img : '',
  //                   payment_involved:
  //                     this.role == '1' && this.resolvingEntity == 'ven'
  //                       ? this.paymentInvolved
  //                       : 0,
  //                   extra_param: 'raise_cwt',
  //                 };

  //                 console.log('param', params);
  //                 this.api
  //                   .post_admin(params)
  //                   .pipe(take(1))
  //                   .subscribe(
  //                     (data) => {
  //                       console.log(data);
  //                       loadingEl.dismiss();
  //                       if (data['error'] != undefined) {
  //                         this.authService.showAlert('Oops!', data['error']);
  //                       } else {
  //                         this.authService.showAlert(
  //                           data['title'],
  //                           data['msg']
  //                         );
  //                         this.navCtrl.navigateBack('/ticket-system');
  //                       }
  //                       // if (typeof data === 'string') {
  //                       //   this.authService.showAlert(
  //                       //     'Success!',
  //                       //     'Ticket created'
  //                       //   );
  //                       //   this.navCtrl.back();
  //                       // } else {
  //                       //   this.authService.showAlert('Oops!', data['error']);
  //                       // }
  //                     },
  //                     (err) => {
  //                       console.log('ERROR!: ', err);
  //                       loadingEl.dismiss();
  //                       this.authService.showAlert('Failed!', 'Try again');
  //                     }
  //                   );
  //               });
  //           },
  //         },
  //       ],
  //     })
  //     .then((alertEl) => alertEl.present());
  // }


  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result as string);
      };

      reader.onerror = () => reject(reader.error);

      reader.readAsDataURL(file);
    });
  }

  async raiseTicket() {
    // Prevent opening the confirmation popup multiple times
    if (this.isTicketAlertOpen || this.isTicketSubmitting) {
      return;
    }

    this.isTicketAlertOpen = true;

    const alertEl = await this.alertCtrl.create({
      cssClass: 'alert-custom',
      message: 'Raise Ticket?',
      backdropDismiss: false,

      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          role: 'ok',

          handler: () => {
            // Prevent duplicate API submission
            if (this.isTicketSubmitting) {
              return false;
            }

            this.isTicketSubmitting = true;

            // Start submission once
            this.submitTicketRequest();

            // Return true so Ionic closes the confirmation alert
            return true;
          },
        },
      ],
    });

    alertEl.onDidDismiss().then(() => {
      this.isTicketAlertOpen = false;
    });

    await alertEl.present();
  }

  async submitTicketRequest() {
    const loadingEl = await this.loadingCtrl.create({
      keyboardClose: true,
      spinner: 'dots',
      cssClass: 'loading-backdrop',
      mode: 'ios',
    });

    await loadingEl.present();

    try {
      // Convert all selected images to Base64
      const uploadedImages = await Promise.all(
        this.images.map(image =>
          this.fileToBase64(image.file)
        )
      );

      const params: any = {
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

        // Send all images through the existing img parameter
        img: uploadedImages.join('|'),

        payment_involved:
          this.role == '1' && this.resolvingEntity == 'ven'
            ? this.paymentInvolved
            : 0,

        extra_param: 'raise_cwt',
      };

      console.log('Ticket params:', params);

      this.api.post_admin(params)
        .pipe(take(1))
        .subscribe({
          next: async (data: any) => {
            await loadingEl.dismiss();

            this.isTicketSubmitting = false;

            if (data['error'] != undefined) {
              this.authService.showAlert(
                'Oops!',
                data['error']
              );
            } else {
              this.authService.showAlert(
                data['title'],
                data['msg']
              );

              this.clearImages();

              this.navCtrl.navigateBack('/ticket-system');
            }
          },

          error: async (err) => {
            console.log('ERROR!: ', err);

            await loadingEl.dismiss();

            this.isTicketSubmitting = false;

            this.authService.showAlert(
              'Failed!',
              'Try again'
            );
          },
        });

    } catch (error) {
      console.log('Image conversion error:', error);

      await loadingEl.dismiss();

      this.isTicketSubmitting = false;

      this.authService.showAlert(
        'Failed!',
        'Unable to process selected images'
      );
    }
  }


  selectPreventDefault(event) {
    event.preventDefault();
  }



  onImagesSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files) {
      return;
    }

    const selectedFiles = Array.from(input.files);

    for (const file of selectedFiles) {
      if (this.images.length >= 3) {
        this.authService.showToast('You can upload maximum 3 images');
        break;
      }

      if (!file.type.startsWith('image/')) {
        this.authService.showToast('Please select image files only');
        continue;
      }

      const preview = URL.createObjectURL(file);

      this.images.push({
        file: file,
        preview: preview
      });
    }

    // Allow selecting the same image again after removing it
    input.value = '';
  }

  removeImage(index: number) {
    URL.revokeObjectURL(this.images[index].preview);
    this.images.splice(index, 1);
  }

  clearImages() {
    this.images.forEach(image => {
      URL.revokeObjectURL(image.preview);
    });

    this.images = [];
  }

  previewImage(image: string) {
    this.selectedImagePreview = image;
  }

  closeImagePreview() {
    this.selectedImagePreview = null;
  }

  async getPhoto() {
    if (this.images.length >= 3) {
      this.authService.showToast('You can upload maximum 3 images');
      return;
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: this.lang == 'en' ? 'Select Image Source' : 'படத்தைத் தேர்ந்தெடுக்கவும்',
      mode: 'ios',
      buttons: [
        {
          text: this.lang == 'en' ? 'Camera' : 'கேமரா',
          icon: 'camera-outline',
          handler: () => {
            this.captureMultipleFromCamera();
          },
        },
        {
          text: this.lang == 'en' ? 'Gallery' : 'கேலரி',
          icon: 'images-outline',
          handler: () => {
            this.imageInput.nativeElement.click();
          },
        },
        {
          text: this.lang == 'en' ? 'Cancel' : 'ரத்துசெய்',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  async captureMultipleFromCamera() {
    try {
      const status = await Camera.checkPermissions();
      if (status.camera !== 'granted') {
        const req = await Camera.requestPermissions({ permissions: ['camera'] });
        if (req.camera !== 'granted') {
          this.authService.showToast('Please enable camera access');
          return;
        }
      }

      while (this.images.length < 3) {
        const photo = await Camera.getPhoto({
          quality: 50,
          allowEditing: false,
          source: CameraSource.Camera,
          resultType: CameraResultType.DataUrl,
        });

        if (!photo?.dataUrl) {
          break;
        }

        const file = this.dataUrlToFile(
          photo.dataUrl,
          `camera_${Date.now()}_${this.images.length + 1}.jpg`
        );
        const preview = URL.createObjectURL(file);
        this.images.push({ file, preview });

        // Stop automatically once 3 images are captured
        if (this.images.length >= 3) {
          this.authService.showToast('Maximum 3 images captured');
          break;
        }

        // Ask if user wants to capture the next photo right away
        const takeAnother = await this.askTakeAnotherPhoto();
        if (!takeAnother) {
          break;
        }
      }
    } catch (err) {
      // User pressed back/cancel inside camera
      console.log('Camera capture stopped:', err);
    }
  }

  private askTakeAnotherPhoto(): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertCtrl.create({
        header: `Photo Added (${this.images.length}/3)`,
        message: 'Do you want to capture another photo?',
        backdropDismiss: false,
        buttons: [
          {
            text: 'Done',
            role: 'cancel',
            handler: () => resolve(false),
          },
          {
            text: 'Capture Next',
            handler: () => resolve(true),
          },
        ],
      });
      await alert.present();
    });
  }

  private dataUrlToFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

}

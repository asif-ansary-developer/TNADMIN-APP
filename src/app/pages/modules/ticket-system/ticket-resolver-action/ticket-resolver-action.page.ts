import { AuthService } from 'src/app/guard/auth.service';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  IonPopover,
  LoadingController,
  ModalController,
  NavController,
  Platform,
  PopoverController,
} from '@ionic/angular';
import { take } from 'rxjs/operators';
import { ApiService } from 'src/app/providers/api.service';
import { ResolutionAlertPage } from '../resolution-alert/resolution-alert.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { RefreshHelperService } from 'src/app/helper/refresh-helper.service';
@Component({
  selector: 'app-ticket-resolver-action',
  templateUrl: './ticket-resolver-action.page.html',
  styleUrls: ['./../ticket-raiser-action/ticket-raiser-action.page.scss'],
})
export class TicketResolverActionPage implements OnInit {
  @ViewChild('content', { read: ElementRef }) content: ElementRef;
  @ViewChild('textbox') textbox;
  action = null;
  escalate_dept;
  reply_text;
  lastest_element;
  _moment;
  ticket_id;
  p_role;
  resolver_id;
  role;
  username;
  public ticket;
  public ticket_actions;
  edit_per = false;
  note_open_state = false;
  preview_state = false;
  preview_img = null;
  canDismiss = true;
  imgs;
  escalateState;
  unassigned = false;

  img_before;
  img_after;

  today;
  modalState = false;
  intermediate_action = false;
  reason;
  support_imgs: any = [];
  refreshSubscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private api: ApiService,
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    public ionpopover: PopoverController,
    private platform: Platform,
    private route: ActivatedRoute,
    private refreshHelper: RefreshHelperService
  ) {
    this._moment = moment;
    // this.captureImageModal();

    this.role = localStorage.getItem('role');
    // if (this.role == 96) this.resolver_id = 'dmt_017';
    // if (this.role == 94) this.resolver_id = 'dro_017';
    // if (this.role == 98) this.resolver_id = 'col_017';
    // if (this.role == 1) this.resolver_id = 'admin';
    this.resolver_id = localStorage.getItem('username');
    this.username = localStorage.getItem('username');
    const navParams = this.router.getCurrentNavigation().extras.state;
    if (navParams) {
      this.ticket_id = navParams.ticket_id;
      console.log('ticket_id', this.ticket_id);
      if (this.role == 1)
        navParams.unassigned
          ? (this.unassigned = true)
          : (this.unassigned = false);
    } else {
      this.route.queryParams.subscribe((params) => {
        this.ticket_id = params['ticket_id'];
        console.log('Received Ticket ID from Query Params:', this.ticket_id);
      });
    }
  }

  ngOnInit() {
    this.refreshSubscription = this.refreshHelper
      .refresh()
      .subscribe((needRefresh) => {
        if (needRefresh) {
          this.display();
          this.ngAfterViewInit();
          this.refreshHelper.needPageRefresh.next(false);
        }
      });
  }

  ngOnDestroy() {
    if (this.modalCtrl.getTop() != undefined) {
      this.modalCtrl.dismiss();
    }

    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.scrollToLastedEL();
  }

  ngDestory() {
    this.ionpopover.dismiss();
  }

  ackTicket() {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        cssClass: 'loading-backdrop',
        mode: 'ios',
      })
      .then((loadingEl) => {
        // loadingEl.present();
        var params = JSON.stringify({
          ticket_id: this.ticket_id,
          text: '_|||Acknowledge',
          msg_from: '0',
          extra_param: 'update_thread_cwt',
        });
        console.log('param', params);
        this.api
          .post_admin(params)
          .pipe(take(1))
          .subscribe(
            (data) => {
              console.log(data);
              this.getTicket();

              // loadingEl.dismiss();
            },
            (err) => {
              console.log('ERROR!: ', err);
              // loadingEl.dismiss();
              this.authService.showAlert('Failed!', 'Try again');
            }
          );
      });
  }

  assignTicket() {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        cssClass: 'loading-backdrop',
        mode: 'ios',
      })
      .then((loadingEl) => {
        // loadingEl.present();
        var params = JSON.stringify({
          resolver: this.resolver_id,
          ticket_id: this.ticket_id,
          extra_param: 'assign_cwt',
        });
        console.log('param', params);
        this.api
          .post_admin(params)
          .pipe(take(1))
          .subscribe(
            (data) => {
              console.log(data);
              this.getTicket();

              // loadingEl.dismiss();
            },
            (err) => {
              console.log('ERROR!: ', err);
              // loadingEl.dismiss();
              this.authService.showAlert('Failed!', 'Try again');
            }
          );
      });
  }

  escalate() {
    var role = this.escalate_dept;
    if (this.escalate_dept != null) {
      this.alertCtrl
        .create({
          header: 'Escalate/Reassign',
          message: 'Please confirm',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
            },
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
                      ticket_id: this.ticket_id,
                      resolver_role: role,
                      extra_param: 'escalate_cwt',
                    });
                    console.log('param', params);
                    this.api
                      .post_admin(params)
                      .pipe(take(1))
                      .subscribe(
                        (data) => {
                          console.log(data);
                          this.getTicket();

                          loadingEl.dismiss();
                        },
                        (err) => {
                          console.log('ERROR!: ', err);
                          loadingEl.dismiss();
                          this.authService.showAlert('Failed!', 'Try again');
                        }
                      );
                  });

                this.escalate_dept = null;
                this.scrollToLastedEL();
              },
            },
          ],
        })
        .then((el) => el.present());
    }
  }

  sendMsgAsResolver() {
    if (this.reply_text === '' || this.reply_text == null) {
      console.log('empty', this.reply_text);
    } else {
      var text = this.reply_text;
      this.loadingCtrl
        .create({
          keyboardClose: true,
          spinner: 'dots',
          cssClass: 'loading-backdrop',
          mode: 'ios',
        })
        .then((loadingEl) => {
          // loadingEl.present();
          var params = JSON.stringify({
            ticket_id: this.ticket_id,
            msg_from: '0',
            text: text,
            extra_param: 'update_thread_cwt',
          });
          console.log('param', params);
          this.api
            .post_admin(params)
            .pipe(take(1))
            .subscribe(
              (data) => {
                console.log(data);
                this.getTicket();
                // loadingEl.dismiss();
              },
              (err) => {
                console.log('ERROR!: ', err);
                // loadingEl.dismiss();
                this.authService.showAlert('Failed!', 'Try again');
              }
            );
        });

      this.textbox.setFocus();
      this.scrollToLastedEL();
      this.reply_text = null;
    }
  }

  ionViewDidEnter() {
    this.display();
  }
  display() {
    this.getTicket();
    this.getTicketActions();
  }

  getTicket() {
    let params = {
      t_id: this.ticket_id,
    };
    this.api.get_cw_ticket_by_id(params).subscribe((data) => {
      var _data: any = data;
      if (_data.length != 0) {
        this.ticket = data[0];
        if (
          this.ticket['resolver'] == this.resolver_id ||
          (this.role == 'ven' &&
            this.ticket['resolver'].toLowerCase().startsWith('ven'))
        )
          this.edit_per = true;
        else {
          this.edit_per = false;
          this.action = null;
        }
      }
      console.log('ticket ..', this.ticket);

      this.scrollToLastedEL();
    });
    this.reply_text = null;
  }

  getTicketActions() {
    let params = {
      t_id: this.ticket_id,
    };
    this.api.get_cw_ticket_actions_by_id(params).subscribe((data) => {
      var _data: any = data;
      if (_data.length != 0) {
        this.ticket_actions = data;
      }
      console.log('ticket actions..', this.ticket_actions);
    });
  }

  scrollToLastedEL() {
    this.cdr.detectChanges();
    this.lastest_element = null;
    this.lastest_element = this.content.nativeElement.children;

    if (this.lastest_element != undefined && this.lastest_element != null) {
      const timer = setInterval(() => {
        if (this.lastest_element.length != 0) {
          this.lastest_element[
            this.lastest_element.length - 1
          ].scrollIntoView();
          clearInterval(timer);
        }
      });
    }
  }

  closeTicket() {
    this.alertCtrl
      .create({
        header: 'Close Ticket',
        message: 'Please confirm',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
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
                    ticket_id: this.ticket_id,
                    msg_from: 0,
                    extra_param: 'close_cwt',
                  });
                  console.log('param', params);
                  this.api
                    .post_admin(params)
                    .pipe(take(1))
                    .subscribe(
                      (data) => {
                        console.log(data);
                        this.getTicket();
                        loadingEl.dismiss();
                        if (data['error'] != undefined) {
                          this.authService.showAlert('Oops!', data['error']);
                        } else {
                          this.authService.showAlert(
                            data['title'],
                            data['msg']
                          );
                          this.navCtrl.back();
                        }
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
      .then((el) => {
        el.present();
      });
  }

  submitResolved(type) {
    this.alertCtrl
      .create({
        message: 'Please confirm to mark it as resolved',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
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
                    ticket_id: this.ticket_id,
                    msg_from: '0',
                    type: type,
                    image_before: this.img_before,
                    image_after: this.img_after,
                    extra_param: 'resolved_request_cwt',
                  });

                  console.log('param', params);
                  this.api
                    .post_admin(params)
                    .pipe(take(1))
                    .subscribe(
                      (data) => {
                        console.log(data);
                        this.getTicket();
                        loadingEl.dismiss();
                        if (data['error'] != undefined) {
                          this.authService.showAlert('Oops!', data['error']);
                        } else {
                          this.authService.showAlert(
                            data['title'],
                            data['msg']
                          );
                          this.navCtrl.back();
                        }
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
      .then((el) => {
        el.present();
      });
  }

  async markResolved() {
    let alert = this.alertCtrl.create({
      message: 'Please confirm type of resolution perfomed',
      inputs: [
        {
          name: 'val_calibration',
          type: 'radio',
          label: 'Calibration',
          value: 'Calibration',
          handler: async () => {
            this.alertCtrl.dismiss();
            this.submitResolved('Calibration');
          },
        },
        {
          name: 'val_replacement',
          type: 'radio',
          label: 'Replacement',
          value: 'Replacement',
          handler: () => {
            this.showReplacementAlert();
            this.alertCtrl.dismiss();
          },
        },
      ],
      buttons: [
        // {
        //   text: 'Yes',
        //   role: 'ok',
        //   handler: async () => {},
        // },
      ],
    });
    (await alert).present();
  }

  showReplacementAlert() {
    this.alertCtrl
      .create({
        cssClass: 'alert-custom',
        message:
          'Please ensure to upload a snapshot of before & after replacement',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: async () => {},
          },
          {
            text: 'Continue',
            role: 'ok',
            handler: () => {
              this.captureImageModal();
              this.alertCtrl.dismiss();
            },
          },
        ],
      })
      .then((el) => el.present());
  }

  async captureImageModal() {
    if (!this.modalState) {
      this.modalState = true;
      const modal = await this.modalCtrl.create({
        component: ResolutionAlertPage,
        cssClass: 'resolution-alert-popup',
        componentProps: {},
      });

      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned != null) {
          console.log(dataReturned);
          if (
            dataReturned['data'] != undefined &&
            dataReturned['data'] != null
          ) {
            if (
              dataReturned['data']['imgs'] != null ||
              dataReturned['data']['imgs'] != undefined
            ) {
              this.img_before = dataReturned['data']['imgs']['before'];
              this.img_after = dataReturned['data']['imgs']['after'];

              if (
                (this.img_before != null || this.img_before != undefined) &&
                (this.img_after != null || this.img_after != undefined)
              ) {
                this.submitResolved('Replacement');
              }
            }
          } else {
          }
        }
        this.modalState = false;
      });
      return await modal.present().then(() => {});
    }
  }

  openTicDetails() {
    if (!this.note_open_state) this.note_open_state = true;
  }

  closeTicDetails() {
    this.note_open_state = false;
  }

  doRefresh(event) {
    this.display();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  requestEntry() {
    this.alertCtrl
      .create({
        header: 'Field entry request',
        message: 'Please request only if entry denied',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
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
                    ticket_id: this.ticket_id,
                    extra_param: 'entry_request_cwt',
                  });
                  console.log('param', params);
                  this.api
                    .post_admin(params)
                    .pipe(take(1))
                    .subscribe(
                      (data) => {
                        console.log(data);
                        this.getTicket();
                        loadingEl.dismiss();
                        if (data['error'] != undefined) {
                          this.authService.showAlert('Oops!', data['error']);
                        } else {
                          this.authService.showAlert(
                            data['title'],
                            data['msg']
                          );
                          // this.navCtrl.back();
                        }
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
      .then((el) => {
        el.present();
      });
  }

  entryRequest() {
    this.alertCtrl
      .create({
        header: 'Field entry request',
        message: 'Please request only if entry denied',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
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
                    ticket_id: this.ticket_id,
                    type: 'field_entry',
                    msg_from: '1',
                    extra_param: 'action_request_cwt',
                  });
                  console.log('param', params);
                  this.api
                    .post_admin(params)
                    .pipe(take(1))
                    .subscribe(
                      (data) => {
                        console.log(data);
                        this.getTicket();
                        loadingEl.dismiss();
                        if (data['error'] != undefined) {
                          this.authService.showAlert('Oops!', data['error']);
                        } else {
                          this.authService.showAlert(
                            data['title'],
                            data['msg']
                          );
                          // this.navCtrl.back();
                        }
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
      .then((el) => {
        el.present();
      });
  }

  actionRequest() {
    this.alertCtrl
      .create({
        header: 'Action Request',
        message: null,
        buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
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
                    ticket_id: this.ticket_id,
                    type: 'intermediate_action',
                    msg_from: '1',
                    extra_param: 'action_request_cwt',
                    reason: this.reason,
                    imgs: this.support_imgs,
                  });
                  console.log('param', params);
                  this.api
                    .post_admin(params)
                    .pipe(take(1))
                    .subscribe(
                      (data) => {
                        console.log(data);
                        this.getTicket();
                        loadingEl.dismiss();
                        if (data['error'] != undefined) {
                          this.authService.showAlert('Oops!', data['error']);
                        } else {
                          this.authService.showAlert(
                            data['title'],
                            data['msg']
                          );
                          this.intermediate_action = false;
                          this.support_imgs = [];
                          this.reason = null;
                          // this.navCtrl.back();
                        }
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
      .then((el) => {
        el.present();
      });
  }

  async getPhoto() {
    var buttons = [
      {
        text: 'Camera',
        handler: () => {
          this.getCamera(1);
        },
      },
      {
        text: 'Gallery',
        handler: () => {
          this.getCamera(2);
        },
      },
      {
        text: 'Cancel',
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
            }).then(async (image) => {
              const compressedImage = await this.compressImage(image.dataUrl);

              if (this.support_imgs.length < 2) {
                this.support_imgs.push(compressedImage);
              } else {
                this.support_imgs.shift();
                this.support_imgs.push(compressedImage);
              }
              if (this.support_imgs.length === 0) {
                this.support_imgs[0] = compressedImage;
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
              const compressedImage: any = await this.compressImage(
                image.dataUrl
              );
              if (this.support_imgs.length < 2) {
                this.support_imgs.push(compressedImage);
              } else {
                this.support_imgs.shift();
                this.support_imgs.push(compressedImage);
              }
              if (this.support_imgs.length === 0) {
                this.support_imgs[0] = compressedImage;
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

  clearAttachment(i) {
    if (i > -1 && i < this.support_imgs.length) {
      this.support_imgs.splice(i, 1);
    }
  }

  async compressImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set maximum dimensions for resizing
        const MAX_WIDTH = 600; // Example: Adjust dimensions as needed
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        // Scale dimensions to maintain aspect ratio
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = (MAX_WIDTH / width) * height;
            width = MAX_WIDTH;
          } else {
            width = (MAX_HEIGHT / height) * width;
            height = MAX_HEIGHT;
          }
        }

        // Resize the canvas
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Compress the resized image to a data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6); // Compression quality
        resolve(compressedDataUrl);
      };

      img.onerror = (err) => {
        reject(new Error('Failed to load image for compression: ' + err));
      };
    });
  }

  handleModalDismiss(e) {
    if (this.intermediate_action) {
      this.intermediate_action = false;
    }

    if (this.preview_state) {
      this.preview_state = false;
      this.preview_img = null;
    }
  }
}

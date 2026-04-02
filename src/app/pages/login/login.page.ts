import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ActionSheetController,
  NavController,
  PopoverController,
  Platform,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';
import { AuthService } from '../../../app/guard/auth.service';
import { ApiService } from '../../../app/providers/api.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { Device } from '@capacitor/device';
import * as CryptoJS from 'crypto-js';
import { Clipboard } from '@capacitor/clipboard';
import { firstValueFrom } from 'rxjs';
import { StatusBar, Style } from '@capacitor/status-bar';
import { PushNotifications } from '@capacitor/push-notifications';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('ip') ipCtrl;

  has_value = false;
  phone_number = '';
  user_data;
  role;
  lang;
  current_card = 'card1';
  selected_role;
  identifier = null;

  new_request = false;
  request_activation_count = 0;
  sign_request = false;
  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private api: ApiService,
    private alertCtrl: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private translate: TranslateService,
    private navCtrl: NavController,
    private popover: PopoverController,
    private platform: Platform,
    private location: Location
  ) {
    this.lang = localStorage.getItem('language');
  }
  ionViewDidEnter() {
    setTimeout(() => {
      StatusBar.setStyle({ style: Style.Light });
      StatusBar.setBackgroundColor({ color: '#e1ebf5' });
    }, 200);
  }

  ngOnInit() {
    // this.logDeviceInfo();
    this.logDeviceId();

    this.pushSubscription();
  }

  pushSubscription() {
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log(
          'Push notification received: ',
          JSON.stringify(notification)
        );

        if (notification['data']) {
          const noti_id = notification['id'];
          if (notification['data']['content'] == 'login-approval') {
            if (this.sign_request) {
              setTimeout(() => {
                PushNotifications.removeAllDeliveredNotifications();
              }, 1000);
              this.signInClick();
            }
          }
        }
      }
    );

    // PushNotifications.addListener('pushNotificationActionPerformed', (data) => {
    //   console.log(JSON.stringify(data));

    //   if (data['notification']['data']) {
    //     if (data['notification']['data']['content'] == 'login-approval') {
    //       if (this.authService.isAuthenticated) {
    //         const currentPath = this.location.path().split('?')[0];
    //         if (currentPath == 'login')
    //           if (this.sign_request) this.signInClick();
    //       }
    //     }
    //   }
    // });
  }
  logDeviceId = async () => {
    const info = await Device.getId();
    console.log('id', JSON.stringify(info));
    this.identifier = info['identifier'];
  };

  logDeviceInfo = async () => {
    const info = await Device.getInfo();
    // console.log('info', JSON.stringify(info));
  };

  ipFocus() {
    this.ipCtrl.setFocus();
  }

  checkHasValue() {
    if (!this.phone_number || this.phone_number.trim() === '') {
      this.has_value = false;
    } else {
      this.has_value = true;
    }
  }

  requestActivator() {
    this.request_activation_count++;
    console.log(this.request_activation_count);
    this.request_activation_count >= 5
      ? ((this.new_request = true), (this.request_activation_count = 0))
      : (this.new_request = true);
  }

  signInClick() {
    if (this.phone_number) {
      const trimmedPhoneNumber = this.phone_number.trim();

      if (
        trimmedPhoneNumber.length < 10 ||
        !/^[0-9]+$/.test(trimmedPhoneNumber)
      ) {
        this.authService.showToast('Please enter a valid 10 digit number');
      } else {
        if (trimmedPhoneNumber == '9999999999') {
          // this.signInDev();
        } else {
          localStorage.removeItem('dev_login');
          this.signIn();
        }
      }
    } else {
      this.authService.showToast('Please enter phone number');
    }
  }

  cancelRequest() {
    this.phone_number = null;
    this.sign_request = false;
  }

  signInold() {
    this.logDeviceId();
    localStorage.setItem('phone', this.phone_number);
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        cssClass: 'loading-backdrop',
        mode: 'ios',
      })
      .then((loadingEl) => {
        loadingEl.present();
        var id =
          this.generateRandomString() +
          this.identifier +
          '' +
          this.generateRandomString();
        console.log(id);
        var params = {
          phone: this.phone_number,
          device_id: localStorage.getItem('deviceid'),
          id: id,
          extra_param:
            this.platform.is('android') || this.platform.is('ios')
              ? 'login_admin_new'
              : 'login_admin',
        };
        // console.log('param', params);
        this.api
          .post_admin(params)
          .pipe(take(1))
          .subscribe(
            (data) => {
              console.log(data);
              this.user_data = data;
              loadingEl.dismiss();

              if (Array.isArray(this.user_data)) {
                if (this.user_data[0]['user_type'] == 'admin') {
                  // this.showAlertAdmin();
                  // this.authService.showAlert('Welcome!', null);
                  this.setUserData();
                } else if (this.user_data[0]['user_type'] == 'other') {
                  // this.authService.showAlert('Welcome!', null);
                  this.setUserData();
                }
              } else {
                this.authService.showAlert('Oops!', data['error']);
                if (data['error'] != 'User not found') {
                  this.new_request = true;
                }
              }
            },
            (err) => {
              console.log('ERROR!: ', err);
              loadingEl.dismiss();
              this.authService.showAlert('Failed!', 'Try again');
              this.authService.isAuthenticated.next(false);
            }
          );
      });
  }

  signIn() {
    this.logDeviceId();
    localStorage.setItem('phone', this.phone_number);
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        cssClass: 'loading-backdrop',
        mode: 'ios',
      })
      .then(async (loadingEl) => {
        loadingEl.present();
        const id = await this.getCode();

        const params = {
          phone: this.phone_number,
          device_id: localStorage.getItem('deviceid'),
          id: id,
          extra_param:
            this.platform.is('android') || this.platform.is('ios')
              ? 'login_admin_approval_method'
              : 'login_admin',
        };

        console.log('params', params);
        this.api
          .post_admin(params)
          .pipe(take(1))
          .subscribe(
            (data) => {
              console.log(data);
              this.user_data = data;
              loadingEl.dismiss();

              if (Array.isArray(this.user_data)) {
                if (this.user_data[0]['user_type'] == 'admin') {
                  // this.showAlertAdmin();
                  // this.authService.showAlert('Welcome!', null);
                  this.setUserData();
                } else if (this.user_data[0]['user_type'] == 'other') {
                  // this.authService.showAlert('Welcome!', null);
                  this.setUserData();
                }
              } else if (data == 'success') {
                this.sign_request = true;
                this.showAlert(
                  'Approval Email Sent to Registered Email id',
                  `1. Click on approve to gain access.
                   2. After clicking approve.
                   3. On the Mobile App, Click Sign In.`
                );
              } else {
                this.authService.showAlert('Oops!', data['error']);
                if (data['error'] != 'User not found') {
                  this.new_request = true;
                }
              }
            },
            (err) => {
              console.log('ERROR!: ', JSON.stringify(err));
              loadingEl.dismiss();
              this.authService.showAlert('Failed!', 'Try again');
              this.authService.isAuthenticated.next(false);
            }
          );
      });
  }

  signInDev() {
    this.api.getTesterNumber().subscribe((data: string) => {
      this.phone_number = data;
      localStorage.setItem('phone', this.phone_number);
      this.loadingCtrl
        .create({
          keyboardClose: true,
          spinner: 'dots',
          cssClass: 'loading-backdrop',
          mode: 'ios',
        })
        .then((loadingEl) => {
          loadingEl.present();
          var id =
            this.generateRandomString() +
            this.identifier +
            '' +
            this.generateRandomString();
          console.log(id);
          var params = JSON.stringify({
            phone: this.phone_number,
            id: id,
            dev_login: true,
            extra_param: 'login_admin',
            // extra_param: 'login_admin',
          });
          // console.log('param', params);
          this.api
            .post_admin(params)
            .pipe(take(1))
            .subscribe(
              (data) => {
                console.log(data);
                this.user_data = data;
                loadingEl.dismiss();

                if (Array.isArray(this.user_data)) {
                  localStorage.setItem('dev_login', 'true');
                  if (this.user_data[0]['user_type'] == 'admin') {
                    this.setUserData();
                  } else if (this.user_data[0]['user_type'] == 'other') {
                    this.setUserData();
                  }
                } else {
                  this.authService.showAlert('Oops!', data['error']);
                  if (data['error'] != 'User not found') {
                    this.new_request = true;
                  }
                }
              },
              (err) => {
                console.log('ERROR!: ', err);
                loadingEl.dismiss();
                this.authService.showAlert('Failed!', 'Try again');
                this.authService.isAuthenticated.next(false);
              }
            );
        });
    });
    // this.phone_number = '6282541645';
  }

  async encryptData(data: string) {
    const _key: any = await firstValueFrom(this.api.get_id_key());
    const key = CryptoJS.enc.Utf8.parse(_key['key'].padEnd(16, ' '));
    const iv = CryptoJS.lib.WordArray.random(16);
    const plaintext = data;
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const ciphertext = iv
      .concat(encrypted.ciphertext)
      .toString(CryptoJS.enc.Base64);
    console.log(ciphertext);

    return ciphertext;
  }

  decryptData(encryptedData: string, key: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    console.log('de', bytes.toString(CryptoJS.enc.Utf8));
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  hashData(data: string): string {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
  }

  generateRandomString(length: number = 7): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters[randomIndex];
    }

    return result;
  }

  async showRoleModal() {
    this.current_card = 'card2';
    var buttons = [
      {
        text: this.translate.instant('DM Tahsildar'),
        handler: () => {
          this.selected_role = '96';
          this.role = this.translate.instant('DM Tahsildar');
        },
      },
      {
        text: this.translate.instant('DRO'),
        handler: () => {
          this.selected_role = '94';
          this.role = this.translate.instant('DRO');
        },
      },
      {
        text: this.translate.instant('Collector'),
        handler: () => {
          this.selected_role = '98';
          this.role = this.translate.instant('Collector');
        },
      },
      {
        text: this.translate.instant('HQ'),
        handler: () => {
          this.selected_role = '1';
          this.role = this.translate.instant('HQ');
        },
      },
      {
        text: this.translate.instant('Cancel'),
        role: 'cancel',
        handler: () => {
          this.selected_role = null;
          this.role = null;
        },
      },
    ];

    (await this.actionSheetCtrl.create({ buttons: buttons })).present();
  }

  setUserData() {
    this.authService.setLoginState('true');
    localStorage.setItem('username', this.user_data[0]['username']);
    localStorage.setItem('district_id', this.user_data[0]['district_id']);
    localStorage.setItem('district_name', this.user_data[0]['district_name']);
    localStorage.setItem(
      't_district_name',
      this.user_data[0]['t_district_name']
    );
    localStorage.setItem('role', this.user_data[0]['role']);
    localStorage.setItem('user_type', this.user_data[0]['user_type']);
    localStorage.setItem('name', this.user_data[0]['full_name']);

    localStorage.setItem('dept_id', this.user_data[0]['dept_id']);

    this.authService.isAuthenticated.next(true);
    this.navCtrl.navigateForward('home', { replaceUrl: true });
  }

  showAlertAdmin() {
    this.alertCtrl
      .create({
        cssClass: 'alert-exit',
        header: this.translate.instant('Alert'),
        message: this.translate.instant('Please select your designation'),
        buttons: [
          {
            text: this.translate.instant('OK'),
            handler: async () => {
              this.showRoleModal();
            },
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }

  proceedClick() {
    localStorage.setItem('_role', this.selected_role);
    this.setUserData();
  }

  resetCards() {
    this.role = null;
    this.selected_role = null;
    this.phone_number = null;
    this.has_value = false;
    this.current_card = 'card1';
  }

  async cipherString(text: string): Promise<string | null> {
    try {
      const data: any = await firstValueFrom(this.api.get_id_key());
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(
          text.charCodeAt(i) ^ data['key'].charCodeAt(i % data['key'].length)
        );
      }
      return result;
    } catch (error) {
      console.error('Error fetching key:', error);
      return null;
    }
  }

  async getCode(): Promise<string> {
    await this.logDeviceId();
    const txt = await this.encryptData(this.identifier);
    return txt;
  }

  copyCode() {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        cssClass: 'loading-backdrop',
        mode: 'ios',
      })
      .then(async (loadingEl) => {
        loadingEl.present();
        this.logDeviceId();
        Clipboard.write({
          string: await this.encryptData(this.identifier),
        }).then(() => {
          loadingEl.dismiss();
        });
        this.authService.showToast('Code copied');
        this.popover.dismiss();
      });
  }
  resetAccessRequested = false;

  resetAccessRequest() {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        cssClass: 'loading-backdrop',
        mode: 'ios',
      })
      .then(async (loadingEl) => {
        loadingEl.present();
        this.api.resetIdentifier({ phone: this.phone_number }).subscribe(
          (data) => {
            this.showAlert(
              'Reset Email Sent to Registered Email id',
              `1. Click on the menu icon located at the top right corner of this page.
               2. Select the "Copy Code" option from the menu.
               3. Paste the copied code into the Reset Page Link provided below.
               4. After Step 3 Login again!`
            );
            loadingEl.dismiss();
            this.resetAccessRequested = true;
          },
          (error) => {
            loadingEl.dismiss();
            this.resetAccessRequested = false;
          }
        );
      });
  }

  showAlert(header, message, button = 'Ok') {
    this.alertCtrl
      .create({
        cssClass: 'login-info-alert',
        header: header != null ? this.translate.instant(header) : null,
        message: message != null ? this.translate.instant(message) : null,
        buttons: [this.translate.instant(button)],
      })
      .then((alertEl) => alertEl.present());
  }

  goToSignup() {
    this.navCtrl.navigateForward('/signup');
  }
}

/*************************************************************
 * Name: tnsmart
*******************************
Author: Mohammed Rizwan S
Date:   23/09/2022 *
**************************************************************/
import { TranslateService } from '@ngx-translate/core';
import { LanguageHelperService } from './../helper/language-helper/language-helper.service';

import {
  AlertController,
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { ApiService } from '../providers/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );

  loading: any;
  userData: any;

  public success: Array<any>;
  lang: string;
  device_id: string;
  user_token: string;
  user_data: any;

  storage_value;
  farmer_option = 'yes';

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private api: ApiService,
    private navController: NavController,
    private lhelper: LanguageHelperService,
    private translate: TranslateService
  ) {
    this.loadAuth();
    localStorage.setItem('language', 'en');
    this.device_id = localStorage.getItem('deviceid');
  }

  async getToken() {
    const ret = await Storage.get({ key: 'deviceid' });
    const user = ret.value;
    console.log('deviceid *****', ret);
  }

  async loadAuth() {
    const authState = await Storage.get({ key: 'authenticated' });
    console.log('Authentication state ******', authState.value);
    if (authState && authState.value) {
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  async cleanAuth() {
    await Storage.set({
      key: 'authenticated',
      value: null,
    });
    // this.router.navigateByUrl('/login-phone', { replaceUrl: true });
  }

  new_login(phone) {
    this.device_id = localStorage.getItem('deviceid');

    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        mode: 'ios',
      })
      .then((el) => {
        el.present();

        var url =
          'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_user/users_post';
        var params = JSON.stringify({
          phone: phone,
          device_id: this.device_id,
          platform: localStorage.getItem('platform'),
          extra_param: 'login_user',
        });

        this.http
          .post(url, params, { responseType: 'json' })
          .pipe(take(1))
          .subscribe((data) => {
            console.log('data', data);
            if (data['result'] != null) {
              this.user_data = data['result'];
              if (
                this.user_data[0].taluk_id == null ||
                this.user_data[0].district_id == null
              ) {
                console.log('eta');
                this.router.navigateByUrl('/setup-profile', {
                  replaceUrl: true,
                  state: { phone: phone, action: 'edit' },
                });
              } else {
                console.log('uta');
                this.isAuthenticated.next(true);
                this.setLoginState('true');
                console.log(this.user_data[0]);

                var user_token = this.user_data[0].user_token;
                localStorage.setItem('username', this.user_data[0].username);
                localStorage.setItem('name', this.user_data[0].name);
                localStorage.setItem('user_token', user_token);
                this.setStorage('user_token', user_token);
                localStorage.setItem(
                  'district',
                  this.user_data[0].district_name
                );
                localStorage.setItem('dept_id', this.user_data[0]['dept_id']);

                localStorage.setItem(
                  'district_ta',
                  this.user_data[0].t_district_name
                );
                localStorage.setItem(
                  'district_id',
                  this.user_data[0].district_id
                );
                localStorage.setItem('taluk', this.user_data[0].taluk_name);
                localStorage.setItem(
                  'taluk_ta',
                  this.user_data[0].taluk_name_ta
                );
                localStorage.setItem('taluk_id', this.user_data[0].taluk_id);

                localStorage.setItem('user_id', this.user_data[0].slno);

                this.router.navigate(['/home'], {
                  replaceUrl: true,
                  state: { login: 'login' },
                });

                // if (this.lhelper.lang == 'en')
                //   this.showAlertWithHandler('Welcome!', null);
                // else this.showAlertWithHandler('நல்வரவு!', null);

                // this.selectFarmerNotificaton();
              }
            } else {
              this.alertCtrl
                .create({
                  mode: 'ios',
                  cssClass: 'alert-exit',
                  header: this.translate.instant('New User'),
                  message: this.translate.instant(
                    'Do you wish to proceed with the registration?'
                  ),
                  buttons: [
                    {
                      text: this.translate.instant('No'),
                      role: 'cancel',
                      handler: async () => {
                        this.alertCtrl.dismiss();
                      },
                    },
                    {
                      text: this.translate.instant('Yes'),
                      handler: async () => {
                        console.log('Register clicked');
                        this.request_otp(phone);
                        this.isAuthenticated.next(false);
                        this.setLoginState('false');
                      },
                    },
                  ],
                })
                .then((alertEl) => alertEl.present());
            }
            el.dismiss();
          });
      });
  }

  request_otp(phone) {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        mode: 'ios',
      })
      .then((el) => {
        el.present();
        var url =
          'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_user/users_post';
        var params = JSON.stringify({
          phone: phone,
          extra_param: 'sendotp_register',
        });
        this.http.post(url, params, { responseType: 'json' }).subscribe(
          (data) => {
            console.log('number....', data);
            if (!data['success']) {
              console.log('data', data);
            } else {
              // var verifydiv = document.getElementById('verify_otp_div');
              // verifydiv.style.display = 'block';
              this.router.navigateByUrl('/registration', { state: { phone } });

              console.log('data', data);
            }
            el.dismiss();
          },
          (err) => {
            console.log('ERROR!: ', err);
            el.dismiss();
            this.showToast('Error getting OTP. Please try again');
          }
        );
      });
  }

  getLoginState() {
    var value = '';
    Storage.get({ key: 'authenticated' }).then((res) => {
      value = JSON.stringify(res.value);
    });
    return value;
  }

  async setLoginState(state: string = 'false') {
    await Storage.set({
      key: 'authenticated',
      value: state,
    });
  }

  logout(): Promise<void> {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        mode: 'ios',
      })
      .then((el) => {
        el.present();
        this.isAuthenticated.next(false);

        let url =
          'https://beta-tnsmart.rimes.int/index.php/Api_mobile/api_user/users_post';
        let params = JSON.stringify({
          user_id: localStorage.getItem('user_id'),
          deviceid: 'logged out',
          extra_param: 'logout',
        });

        this.http.post(url, params, { responseType: 'text' }).subscribe(
          (data) => {
            console.log('post data', data);
            Storage.clear();
            localStorage.clear();
            this.setDefaultLang();
            this.navController.navigateRoot('/login-phone', {
              replaceUrl: true,
            });
          },
          (err) => {
            console.log('ERROR!: ', err);
          }
        );

        el.dismiss();
      });

    return;
  }

  reset(): Promise<void> {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        mode: 'ios',
      })
      .then((el) => {
        el.present();
        Storage.clear();
        // localStorage.clear();
        localStorage.removeItem('district_id');
        localStorage.removeItem('district_name');
        localStorage.removeItem('language');
        localStorage.removeItem('name');
        localStorage.removeItem('phone');
        localStorage.removeItem('role');
        localStorage.removeItem('t_district_name');
        localStorage.removeItem('user_type');
        localStorage.removeItem('username');

        this.setDefaultLang();
        this.isAuthenticated.next(false);
        this.navController.navigateRoot('/login', {
          replaceUrl: true,
        });

        el.dismiss();
      });

    return;
  }

  setDefaultLang() {
    this.lhelper.setDisplayLanguage('en');
    localStorage.setItem('language', 'en');
    this.setStorage('language', 'en');
    //temp chang to ta
    // this.lhelper.setDisplayLanguage('ta');
    // localStorage.setItem('language', 'ta');
    // this.setStorage('language', 'ta');
  }

  showAlert(header, message, button = 'Ok') {
    this.alertCtrl
      .create({
        header: header != null ? this.translate.instant(header) : null,
        message: message != null ? this.translate.instant(message) : null,
        buttons: [this.translate.instant(button)],
        cssClass: 'generic-alert',
      })
      .then((alertEl) => alertEl.present());
  }

  public showAlertWithHandler(header, message, button = 'Ok') {
    this.alertCtrl
      .create({
        header: header != null ? this.translate.instant(header) : null,
        message: message != null ? this.translate.instant(message) : null,
        buttons: [
          {
            text: this.translate.instant(button),
            handler: () => {
              // this.selectFarmerNotificaton();
              // this.ShowLocPermissionAlert();
            },
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }

  ShowLocPermissionAlert() {
    this.alertCtrl
      .create({
        header: this.translate.instant('Alert Message'),
        message: this.translate.instant(
          "Enable 'Allow all the time' Location permission to get Location-based Alerts"
        ),
        mode: 'ios',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  showToastInfi(txt) {
    return this.toastCtrl.create({
      message: this.translate.instant(txt),
      duration: 999999999,
      position: 'bottom',
      cssClass: 'toast-class',
    });
  }

  showToast(txt) {
    if (this.toastCtrl.getTop != undefined) this.toastCtrl.dismiss();
    this.toastCtrl
      .create({
        message: this.translate.instant(txt),
        duration: 1500,
        position: 'bottom',
        cssClass: 'toast-class',
      })
      .then((toastEl) => {
        toastEl.present();
      });
  }

  showToastMiddle(txt) {
    if (this.toastCtrl.getTop != undefined) this.toastCtrl.dismiss();
    this.toastCtrl
      .create({
        message: this.translate.instant(txt),
        duration: 1500,
        position: 'middle',
        cssClass: 'toast-class2',
      })
      .then((toastEl) => {
        toastEl.present();
      });
  }

  showToastTop(txt) {
    if (this.toastCtrl.getTop != undefined) this.toastCtrl.dismiss();
    this.toastCtrl
      .create({
        message: this.translate.instant(txt),
        duration: 1500,
        position: 'top',
        cssClass: 'toast-class2',
      })
      .then((toastEl) => {
        toastEl.present();
      });
  }

  mailFormat(email) {
    var EMAIL_REGEXP =
      /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if (email.length > 5 && EMAIL_REGEXP.test(email)) return true;
    else return false;
  }

  passwordFormat(password) {
    var PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
    if (password.length > 12 && PASSWORD_REGEXP.test(password)) return true;
    else false;
  }

  routeToHome() {
    this.navController.navigateBack('/home/home-tab');
  }

  async setStorage(key, value) {
    await Storage.set({
      key: key,
      value: value,
    });
  }

  async getStorage(key) {
    const value = await Storage.get({ key: key }).then((res) => {
      return res.value;
    });
    return value;
  }

  checklogin(user_token: string) {
    let params = {
      token: user_token,
    };
    console.log('params', params);
    this.api.check_login_token(params).subscribe(
      (data) => {
        this.user_data = data;
        console.log('user data...', this.user_data);

        localStorage.setItem('username', this.user_data[0].username);
        localStorage.setItem('name', this.user_data[0].name);
        localStorage.setItem('user_token', user_token);
        this.setStorage('user_token', user_token);
        localStorage.setItem('district', this.user_data[0].district_name);
        localStorage.setItem('district_ta', this.user_data[0].t_district_name);
        localStorage.setItem('district_id', this.user_data[0].district_id);
        localStorage.setItem('taluk', this.user_data[0].taluk_name);
        localStorage.setItem('taluk_ta', this.user_data[0].taluk_name_ta);
        localStorage.setItem('taluk_id', this.user_data[0].taluk_id);
        localStorage.setItem('user_id', this.user_data[0].slno);
      },
      (err) => {
        console.log('Try again later!!');
      }
    );
  }

  selectFarmerNotificaton() {
    this.alertCtrl
      .create({
        mode: 'ios',
        header: this.translate.instant('Farmer Notification'),
        inputs: [
          {
            name: 'appy',
            type: 'radio',
            label: 'ON',
            value: 'yes',
            checked: this.farmer_option == 'yes' ? true : false,
          },
          {
            name: 'appn',
            type: 'radio',
            label: 'OFF',
            value: 'no',

            checked: this.farmer_option == 'no' ? true : false,
          },
        ],
        buttons: [
          {
            text: this.lhelper.lang == 'en' ? 'Done' : 'Done',
            handler: (data) => {
              this.setFarmerNotification(data);
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }

  setFarmerNotification(farmNoti) {
    var choice = farmNoti;
    console.log('selected option for farmner notification is:', choice);
    var url =
      'https://beta-tnsmart.rimes.int/index.php/Api_mobile/Api_user/users_post';
    var params = JSON.stringify({
      user_id: localStorage.getItem('user_id'),
      farmer: choice,
      extra_param: 'update_farmer_notification',
    });
    console.log('params', params);
    this.http
      .post(url, params, { responseType: 'text' })
      .pipe(take(1))
      .subscribe(
        (data) => {
          console.log('post data', data);
          this.farmer_option = choice;
        },
        (err) => {
          console.log('error', err);
        }
      );
  }

  dismissToast() {
    if (this.toastCtrl.getTop != undefined) this.toastCtrl.dismiss();
  }
}

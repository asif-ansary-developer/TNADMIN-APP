import {
  AlertController,
  LoadingController,
  NavController,
  Platform,
} from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/guard/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import * as CryptoJS from 'crypto-js';
import { firstValueFrom, take } from 'rxjs';
import { Device } from '@capacitor/device';
import { StatusBar, Style } from '@capacitor/status-bar';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  localStr;
  _role;
  _dept_id;
  username;
  identifier = null;
  user_data;
  _moment;
  is_dev_login = false;
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private platform: Platform
  ) {
    // localStorage.setItem('role', '96');
    // localStorage.setItem('username', 'dmt_001');

    this.localStr = localStorage;
    this._role = localStorage.getItem('role');
    this._dept_id = localStorage.getItem('dept_id');
    this.username = localStorage.getItem('username');
    this._moment = moment;
    this.is_dev_login =
      localStorage.getItem('dev_login') == 'true' ? true : false;
  }

  ngOnInit() {}
  ionViewWillEnter() {
    // this.logDeviceId();
    // this.checkIdentiferNew();
    this.logDeviceIdnew();
  }
  ionViewDidEnter() {
    setTimeout(() => {
      StatusBar.setStyle({ style: Style.Light });
      StatusBar.setBackgroundColor({ color: '#f7f7f7' });
    }, 100);
  }

  ngAfterViewInit() {}

  checkIdentiferNew() {
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
        console.log('phone', id);
        console.log('phone', localStorage.getItem('phone'));

        var params = JSON.stringify({
          phone: localStorage.getItem('phone'),
          device_id: localStorage.getItem('deviceid'),
          id: id,
          extra_param:
            this.platform.is('android') ||
            (this.platform.is('ios') && !this.is_dev_login)
              ? 'login_admin_id_check'
              : 'login_admin',
          // extra_param: 'login_admin',
        });
        console.log('param', params);
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
                // this.authService.showAlert('Oops!', data['error']);
                this.authService.reset();
              }
            },
            (err) => {
              console.log('ERROR!: ', JSON.stringify(err));
              loadingEl.dismiss();
              // this.authService.showAlert('Failed!', 'Try again');
              this.authService.reset();
            }
          );
      });
  }
  checkIdentifer() {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        cssClass: 'loading-backdrop',
        mode: 'ios',
      })
      .then(async (loadingEl) => {
        loadingEl.present();
        var id =
          this.generateRandomString() +
          (await this.logDeviceId()) +
          '' +
          this.generateRandomString();
        console.log('phone', localStorage.getItem('phone'));

        var params = JSON.stringify({
          phone: localStorage.getItem('phone'),
          device_id: localStorage.getItem('deviceid'),
          id: id,
          extra_param:
            this.platform.is('android') ||
            (this.platform.is('ios') && !this.is_dev_login)
              ? 'login_admin_id_check'
              : 'login_admin',
          // extra_param: 'login_admin',
        });
        console.log('param', params);
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
                // this.authService.showAlert('Oops!', data['error']);
                this.authService.reset();
              }
            },
            (err) => {
              console.log('ERROR!: ', JSON.stringify(err));
              loadingEl.dismiss();
              // this.authService.showAlert('Failed!', 'Try again');
              this.authService.reset();
            }
          );
      });
  }

  async getCode(): Promise<string> {
    this.logDeviceId();
    const txt = await this.encryptData(this.identifier);
    return txt;
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

  logDeviceId = async () => {
    const info = await Device.getId();
    console.log('id', JSON.stringify(info));
    this.identifier = info['identifier'];
  };

  logDeviceIdnew = async () => {
    if (
      localStorage.getItem('dev_login') == 'false' ||
      localStorage.getItem('dev_login') != 'true'
    ) {
      const info = await Device.getId();
      console.log('id', JSON.stringify(info));
      this.identifier = info['identifier'];

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
          console.log('phone', id);
          console.log('phone', localStorage.getItem('phone'));

          var params = JSON.stringify({
            phone: localStorage.getItem('phone'),
            device_id: localStorage.getItem('deviceid'),
            id: id,
            extra_param:
              this.platform.is('android') ||
              (this.platform.is('ios') && !this.is_dev_login)
                ? 'login_admin_id_check'
                : 'login_admin',
            // extra_param: 'login_admin',
          });
          console.log('param', params);
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
                  // this.authService.showAlert('Oops!', data['error']);
                  this.authService.reset();
                }
              },
              (err) => {
                console.log('ERROR!: ', JSON.stringify(err));
                loadingEl.dismiss();
                // this.authService.showAlert('Failed!', 'Try again');
                this.authService.reset();
              }
            );
        });
    } else {
      this.signInDev();
    }
  };
  phone_number;
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

  route(url) {
    this.navCtrl.navigateForward(url);
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

  logout() {
    this.alertCtrl
      .create({
        cssClass: 'alert-exit',
        message: 'Do you want to logout?',
        buttons: [
          { text: 'No', role: 'cancel' },
          {
            text: 'Logout',
            role: 'ok',
            handler: async () => {
              this.authService.reset();
            },
          },
        ],
      })
      .then((alertEl) => alertEl.present());
  }
}

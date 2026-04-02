import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import * as CryptoJS from 'crypto-js';

import {
  PushNotifications,
  PushNotificationSchema,
} from '@capacitor/push-notifications';
import {
  AlertController,
  LoadingController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';
import { AuthService } from './guard/auth.service';
import { Device } from '@capacitor/device';
import { firstValueFrom, take } from 'rxjs';
import { ApiService } from './providers/api.service';
import { RefreshHelperService } from './helper/refresh-helper.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private location: Location,
    private navCtrl: NavController,
    private authService: AuthService,
    private api: ApiService,
    private zone: NgZone,
    private refreshHelper: RefreshHelperService
  ) {
    this.initializeApp();
    this.init();
  }
  ngAfterViewInit(): void {
    SplashScreen.hide();
  }

  ngOnInit(): void {
    // this.getDeliveredNotifications();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      this.addResumeListener();
      this.addListeners();
      this.registerNotifications();
      this.setStatusbar();
    });
  }

  async setStatusbar() {
    // const loader = await this.loadingCtrl.create({
    //   spinner: 'dots',
    //   mode: 'ios',
    //   // cssClass: 'loading-backdrop',
    // });
    // loader.present().then(() => {});

    if (this.location.isCurrentPathEqualTo('/login')) {
      setTimeout(() => {
        StatusBar.setStyle({ style: Style.Light });
        StatusBar.setBackgroundColor({ color: '#e1ebf5' });
      }, 500);
    } else {
      setTimeout(() => {
        StatusBar.setStyle({ style: Style.Light });
        StatusBar.setBackgroundColor({ color: '#f7f7f7' });
      }, 500);
    }
  }

  addListeners = async () => {
    await PushNotifications.addListener('registration', (token) => {
      console.info('Registration token: ', token.value);
      localStorage.setItem('deviceid', token.value);
      PushNotifications.createChannel({
        id: 'Push',
        description: 'Notification alerts',
        vibration: true,
        visibility: 1,
        // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
        importance: 5,
        name: 'Push',
      }).then(() => console.log('Channel created'));
    });

    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log(
          'Push notification received: ',
          JSON.stringify(notification)
        );

        if (notification['data']) {
          if (
            notification['data']['redirect'] &&
            notification['data']['content'] == 'ticket-system'
          ) {
            const currentPath = this.location.path().split('?')[0];
            if (
              currentPath === '/ticket-system/ticket-raiser-action' ||
              currentPath === '/ticket-system/ticket-resolver-action' ||
              currentPath === '/ticket-system/view-status-vendor' ||
              currentPath === '/ticket-system/view-status-admin-2'
            ) {
              this.refreshHelper.needPageRefresh.next(true);
              setTimeout(() => {
                PushNotifications.removeAllDeliveredNotifications();
              }, 1000);
            }
          }

          if (notification['data']['content'] == 'login-approval') {
            const currentPath = this.location.path().split('?')[0];
            if (
              currentPath === '/ticket-system/ticket-raiser-action' ||
              currentPath === '/ticket-system/ticket-resolver-action' ||
              currentPath === '/ticket-system/view-status-vendor' ||
              currentPath === '/ticket-system/view-status-admin-2'
            ) {
              this.refreshHelper.needPageRefresh.next(true);
              setTimeout(() => {
                PushNotifications.removeAllDeliveredNotifications();
              }, 1000);
            }
          }
        }
      }
    );

    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (data) => {
        console.log(JSON.stringify(data));

        if (data['notification']['data']) {
          // if (data['notification']['data']['content'] == 'login-approval') {
          //   if (this.authService.isAuthenticated) {
          //     const currentPath = this.location.path().split('?')[0];
          //     if (currentPath != 'login') return;
          //   }
          // } else

          if (
            data['notification']['data']['redirect'] &&
            data['notification']['data']['content'] ==
            'ticket-system/view-complaints'
          ) {
            this.navCtrl.navigateForward('ticket-system/view-complaints', {
              replaceUrl: true,
            });
          } else if (
            data['notification']['data']['redirect'] &&
            data['notification']['data']['content'] == 'ticket-system'
          ) {
            const currentPath = this.location.path().split('?')[0];
            if (
              currentPath === '/ticket-system/ticket-raiser-action' ||
              currentPath === '/ticket-system/ticket-resolver-action'
            ) {
              //   this.refreshHelper.needPageRefresh.next(true);
              //   var tic = JSON.parse(data['notification']['data']['redirect'])[
              //     'url'
              //   ].split('t_id=')[0];
              //   this.refreshHelper.ticketNotification.next(true);
              //   setTimeout(() => {
              //     PushNotifications.removeAllDeliveredNotifications();
              //   }, 1000);
              // } else {
              this.navCtrl
                .navigateForward('ticket-system', { replaceUrl: true })
                .then(() => {
                  if (
                    JSON.parse(data['notification']['data']['redirect'])['url']
                  )
                    this.navCtrl.navigateForward(
                      JSON.parse(data['notification']['data']['redirect'])[
                      'url'
                      ]
                    );
                });
            }
          }
        }
      }
    );
  };

  registerNotifications = async () => {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  };

  getDeliveredNotifications = async () => {
    const notificationList =
      await PushNotifications.getDeliveredNotifications();
    console.log('delivered notifications', notificationList);
  };

  init() {
    this.platform.backButton.subscribeWithPriority(1, () => {
      // console.log('Back press handler!');
      // console.log(JSON.stringify(this.location.path()));

      if (this.loadingCtrl.getTop != undefined) this.loadingCtrl.dismiss();
      if (this.toastCtrl.getTop != undefined) this.toastCtrl.dismiss();
      if (this.alertCtrl.getTop != undefined) this.alertCtrl.dismiss();

      if (
        this.location.isCurrentPathEqualTo('/no-connection') ||
        this.location.isCurrentPathEqualTo('/home')
      ) {
        navigator['app'].exitApp();
      } else {
        this.loadingCtrl.dismiss();
        this.navCtrl.back();
        // this.navController.pop();
      }
    });
  }

  addResumeListener() {
    App.addListener('appStateChange', (state) => {
      if (state.isActive) {
        this.setStatusbar();
        if (this.platform.is('android') || this.platform.is('ios'))
          this.logDeviceIdnew();
        // this.checkIdentifer();
      }
    });
  }

  user_data;
  identifier = null;

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

          var params = {
            phone: localStorage.getItem('phone'),
            device_id: localStorage.getItem('deviceid'),
            id: id,
            extra_param:
              this.platform.is('android') || this.platform.is('ios')
                ? 'login_admin_id_check'
                : 'login_admin',
            // extra_param: 'login_admin',
          };
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
                    this.setUserData();
                  } else if (this.user_data[0]['user_type'] == 'other') {
                    this.setUserData();
                  }
                } else {
                  this.authService.reset();
                }
              },
              (err) => {
                console.log('ERROR!: ', JSON.stringify(err));
                loadingEl.dismiss();
                this.authService.reset();
              }
            );
        });
    }
  };

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
        var params = {
          phone: localStorage.getItem('phone'),
          device_id: localStorage.getItem('deviceid'),
          id: id,
          extra_param: 'login_admin_new',
          // extra_param: 'login_admin',
        };
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
              console.log('ERROR!: ', err);
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

  logDeviceId = async () => {
    const info = await Device.getId();
    console.log('id', JSON.stringify(info));
    this.identifier = info['identifier'];
    return this.identifier;
  };

  setUserData() {
    this.authService.setLoginState('true');
    localStorage.setItem('username', this.user_data[0]['username']);
    localStorage.setItem('dept_id', this.user_data[0]['dept_id']);
    localStorage.setItem('district_id', this.user_data[0]['district_id']);
    localStorage.setItem('district_name', this.user_data[0]['district_name']);
    localStorage.setItem(
      't_district_name',
      this.user_data[0]['t_district_name']
    );
    localStorage.setItem('role', this.user_data[0]['role']);
    localStorage.setItem('user_type', this.user_data[0]['user_type']);
    localStorage.setItem('name', this.user_data[0]['full_name']);
    this.authService.isAuthenticated.next(true);
  }
}

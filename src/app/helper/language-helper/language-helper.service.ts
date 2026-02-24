/*************************************************************
 * Name: tnsmart
*******************************
Author: Mohammed Rizwan S
Date:   23/09/2022 *
**************************************************************/

import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageHelperService {
  lang = localStorage.getItem('language');
  ta = this.getDisplayLanguage() === 'ta' ? true : false;
  width;
  height;
  rootElement = <HTMLElement>document.querySelector(':root');

  constructor(public translate: TranslateService, private platform: Platform) {
    if (this.lang == null) {
      this.setDisplayLanguage('ta');
    }
    this.changeFont();
    console.log(this.platform);
  }

  setDisplayLanguage(lang) {
    console.log('lang set ' + lang);
    localStorage.setItem('language', lang);
    this.lang = lang;
    this.translate.use(lang);
    this.translate.setDefaultLang(lang);

    Preferences.set({
      key: 'language',
      value: lang,
    });
    this.changeFont();
  }

  getDisplayLanguage() {
    const value = Preferences.get({ key: 'language' });
    return value.toString();
  }

  changeLanguage() {
    this.ta = !this.ta;
    this.setDisplayLanguage(this.ta ? 'ta' : 'en');
  }

  changeFont() {
    this.width = this.platform.width();
    var rE = getComputedStyle(this.rootElement);

    // if (this.lang == null || this.lang == 'en') {
    //   this.rootElement.style.setProperty('--ion-font-weight-medium', '500');
    //   this.rootElement.style.setProperty('--ion-font-weight-medium2', '550');
    //   this.rootElement.style.setProperty('--ion-font-weight-bold', '600');

    //   if (
    //     (this.platform.is('android') && this.width < 320) ||
    //     (this.platform.is('ios') && this.width < 320)
    //   ) {
    //     this.rootElement.style.setProperty('--ion-font-title', '1rem');
    //     this.rootElement.style.setProperty('--ion-font-header', '0.875rem');
    //     this.rootElement.style.setProperty('--ion-font-regular', '0.875rem');
    //     this.rootElement.style.setProperty('--ion-font-btn', '0.6875rem');
    //     this.rootElement.style.setProperty('--ion-font-13', '0.75rem');
    //     this.rootElement.style.setProperty(
    //       '--ion-font-label-block',
    //       '0.6875rem'
    //     );
    //   } else if (
    //     (this.platform.is('android') && this.width > 320) ||
    //     (this.platform.is('ios') && this.width > 375)
    //   ) {
    //     this.rootElement.style.setProperty('--ion-font-title', '1.125rem');
    //     this.rootElement.style.setProperty('--ion-font-header', '1.125rem');
    //     this.rootElement.style.setProperty('--ion-font-regular', '1rem');
    //     this.rootElement.style.setProperty('--ion-font-btn', '0.875rem');
    //     this.rootElement.style.setProperty('--ion-font-13', '0.8125rem');
    //     this.rootElement.style.setProperty('--ion-font-label-block', '0.75rem');
    //   }
    // } else {
    //   this.rootElement.style.setProperty('--ion-font-weight-medium', '550');
    //   this.rootElement.style.setProperty('--ion-font-weight-medium2', '550');
    //   this.rootElement.style.setProperty('--ion-font-weight-bold', 'bold');

    //   if (this.platform.is('android') && this.width > 320) {
    //     this.rootElement.style.setProperty('--ion-font-title', '1rem');
    //     this.rootElement.style.setProperty('--ion-font-header', '0.875rem');
    //     this.rootElement.style.setProperty('--ion-font-regular', '0.8125rem');
    //     this.rootElement.style.setProperty('--ion-font-btn', '0.75rem');
    //     this.rootElement.style.setProperty('--ion-font-13', '0.8125rem');
    //     this.rootElement.style.setProperty('--ion-font-label-block', '0.75rem');
    //   } else if (
    //     this.platform.is('android') ||
    //     (this.platform.is('ios') && this.width <= 320)
    //   ) {
    //     this.rootElement.style.setProperty('--ion-font-title', '1rem');
    //     this.rootElement.style.setProperty('--ion-font-header', '0.875rem');
    //     this.rootElement.style.setProperty('--ion-font-regular', '0.75rem');
    //     this.rootElement.style.setProperty('--ion-font-btn', '0.6875rem');
    //     this.rootElement.style.setProperty('--ion-font-13', '0.75rem');
    //     this.rootElement.style.setProperty(
    //       '--ion-font-label-block',
    //       '0.6875rem'
    //     );
    //   } else if (this.platform.is('ios') && this.width >= 376) {
    //     this.rootElement.style.setProperty('--ion-font-title', '1.125rem');
    //     this.rootElement.style.setProperty('--ion-font-header', '1.125rem');
    //     this.rootElement.style.setProperty('--ion-font-regular', '1rem');
    //     this.rootElement.style.setProperty('--ion-font-btn', '0.875rem');
    //     this.rootElement.style.setProperty('--ion-font-13', '0.8125rem');
    //     this.rootElement.style.setProperty('--ion-font-label-block', '0.75rem');
    //   }
    // }
  }
}

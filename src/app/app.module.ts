import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { pageTransition } from './helper/page-transistions';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiLoggerInterceptor } from './api-logger.interceptor';

export function setTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/language/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    TranslateModule,
    HttpClientModule,
    AppRoutingModule,
    IonicModule.forRoot({
      backButtonText: '',
      // mode: 'ios',
      swipeBackEnabled: false,
      // navAnimation: pageTransition,
    }),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: setTranslateLoader,
        deps: [HttpClient],
      },
    }),
    AppRoutingModule,
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiLoggerInterceptor,
    multi: true,
  },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

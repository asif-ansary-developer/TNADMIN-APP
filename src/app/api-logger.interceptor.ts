import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiLoggerInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("ENV CHECK:", JSON.stringify(environment));
    console.log("INTERCEPTOR RUNNING");
    const startTime = new Date().getTime();
    if (environment.enableApiLogs) {
      console.log("API_SHERLOCK  REQUEST");
      console.log("API_SHERLOCK URL:", req.url);
      console.log("API_SHERLOCK METHOD:", req.method);
      console.log("API_SHERLOCK BODY:", JSON.stringify(req.body));
      console.log("API_SHERLOCK HEADERS:", JSON.stringify(req.headers));
    }
    return next.handle(req).pipe(

      tap({

        next: (event) => {

          if (event instanceof HttpResponse) {

            if (environment.enableApiLogs) {
              console.log("API_SHERLOCK   SUCCESS");
              console.log("API_SHERLOCK URL:", req.url);
              console.log("API_SHERLOCK STATUS:", event.status);


              // if (!event.body) {

              if (event.body == null || (Array.isArray(event.body) && event.body.length === 0)) {
                console.warn("API_SHERLOCK ⚠️ EMPTY RESPONSE:", req.url);


              } else if (event.body && JSON.stringify(event.body).length < 2000) {
                console.log("API_SHERLOCK RESPONSE:", JSON.stringify(event.body));

              } else {
                console.log("API_SHERLOCK RESPONSE: Large response received");
                console.log("API_SHERLOCK RESPONSE:", JSON.stringify(event.body));
              }



            }
          }

        },

        error: (error: HttpErrorResponse) => {

          if (environment.enableApiLogs) {
            console.log("API_SHERLOCK  ERROR");
            console.log("API_SHERLOCK URL:", req.url);
            console.log("API_SHERLOCK STATUS:", error.status);
            console.log("API_SHERLOCK MESSAGE:", error.message);
            console.log("API_SHERLOCK ERROR:", JSON.stringify(error.error));

          }
        }

      })

    );

  }

}
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

@Injectable()
export class ApiLoggerInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log("API_SHERLOCK  REQUEST");
    console.log("API_SHERLOCK URL:", req.url);
    console.log("API_SHERLOCK METHOD:", req.method);
    console.log("API_SHERLOCK BODY:", JSON.stringify(req.body));
    console.log("API_SHERLOCK HEADERS:", JSON.stringify(req.headers));

    return next.handle(req).pipe(

      tap({

        next: (event) => {

          if (event instanceof HttpResponse) {

            console.log("API_SHERLOCK   SUCCESS");
            console.log("API_SHERLOCK URL:", req.url);
            console.log("API_SHERLOCK STATUS:", event.status);
            console.log("API_SHERLOCK RESPONSE:", JSON.stringify(event.body));

          }

        },

        error: (error: HttpErrorResponse) => {

          console.log("API_SHERLOCK  ERROR");
          console.log("API_SHERLOCK URL:", req.url);
          console.log("API_SHERLOCK STATUS:", error.status);
          console.log("API_SHERLOCK MESSAGE:", error.message);
          console.log("API_SHERLOCK ERROR:", JSON.stringify(error.error));

        }

      })

    );

  }

}
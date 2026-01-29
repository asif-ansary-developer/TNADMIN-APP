import { filter, map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RefreshHelperService {
  needPageRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  ticketNotification: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );
  constructor() {}

  refresh(): Observable<boolean> {
    return this.needPageRefresh.pipe(
      filter((value) => value != null),
      map((needRefresh) => {
        if (needRefresh) {
          return true;
        } else {
          return false;
        }
      })
    );
  }

  fetchTicket(): Observable<string | null> {
    return this.ticketNotification.asObservable().pipe(
      filter((value: string | null) => value !== null),
      map((ticketNotification: string | null) => {
        return ticketNotification ? ticketNotification : null;
      })
    );
  }
}

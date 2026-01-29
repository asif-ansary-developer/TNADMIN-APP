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
}

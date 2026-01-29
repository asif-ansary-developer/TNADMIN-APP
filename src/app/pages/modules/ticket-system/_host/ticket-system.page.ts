import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api.service';
var _router;
@Component({
  selector: 'app-ticket-system',
  templateUrl: './ticket-system.page.html',
  styleUrls: ['./ticket-system.page.scss'],
})
export class TicketSystemPage implements OnInit {
  _role;

  closure_count: any = [];
  action_pending_count: any = [];
  pending_complaints: any = [];
  previousUrl;
  reload = false;

  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    private router: Router
  ) {
    this.customInit();
  }
  customInit() {
    this._role = localStorage.getItem('role');
    if (this._role == '1') {
      this.api
        .get_cw_tickets_open_with_closure_requests_count({
          u_id: localStorage.getItem('username'),
        })
        .subscribe((data: any) => {
          console.log('closure_count', data);
          if (data.length != 0) {
            this.closure_count = data;
          }
        });

      this.api.get_arg_complaints_count().subscribe((data: any) => {
        console.log('complaints unread count', data);
        if (data.length != 0) {
          this.pending_complaints = data;
        }
      });
    }

    if (this._role == '96') {
      this.api
        .get_cw_tickets_with_entry_requests_count({
          u_id: localStorage.getItem('username'),
        })
        .subscribe((data: any) => {
          console.log('actions pending count', data);
          if (data.length != 0) {
            this.action_pending_count = data;
            this.action_pending_count = { count: data[0]['count'] };
          }
        });
    }
  }
  ngOnInit() {
    _router = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (
          this.previousUrl == '/ticket-system/view-complaints' ||
          this.previousUrl == '/ticket-system/view-closures'
        ) {
          this.customInit();
          console.log('custom init');
        }
        this.previousUrl = event.url;
      }
    });
  }
  route(url) {
    this.navCtrl.navigateForward(url);
  }
  back() {
    this.navCtrl.navigateBack('/home');
  }
}

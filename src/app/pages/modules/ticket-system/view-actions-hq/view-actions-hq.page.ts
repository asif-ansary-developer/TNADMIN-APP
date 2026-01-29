import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import * as moment from 'moment';
import { take } from 'rxjs';
import { AuthService } from 'src/app/guard/auth.service';
import { ApiService } from 'src/app/providers/api.service';
var _router;
@Component({
  selector: 'app-view-actions-hq',
  templateUrl: './view-actions-hq.page.html',
  styleUrls: ['./view-actions-hq.page.scss'],
})
export class ViewActionsHqPage implements OnInit {
  lang;
  user_id;
  tab = 'open';
  no_more_data = [false, false];
  current_page = [1, 1];
  loading_closed_tickets = true;
  loading_action_tickets = true;
  previousUrl;
  reload = true;
  role;
  public action_tickets: any = [];
  public closed_tickets: any = [];

  modal_state = false;
  image_preview_state = false;
  preview_img;
  public selected_ticket: any;

  _moment;

  district_id;
  stationCode;
  districts_data: any = [];
  constructor(
    private router: Router,
    private nav: NavController,
    private http: HttpClient,
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private authService: AuthService
  ) {
    this.lang = localStorage.getItem('language');
    this.user_id = localStorage.getItem('username');
    this.role = localStorage.getItem('role');
    this._moment = moment;
  }

  ngOnDestroy() {
    _router.unsubscribe();
  }

  ngOnInit() {
    _router = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (
          this.previousUrl == '/ticket-system/ticket-resolver-action' ||
          this.previousUrl == '/ticket-system/ticket-raiser-action'
        ) {
          this.reload = false;
        }
        this.previousUrl = event.url;
      }
    });
  }

  closeModal() {
    this.router.navigateByUrl('/ticket-system');
  }

  ionViewDidEnter() {
    if (this.reload) this.display();
    this.getDistricts();
  }

  display() {
    this.loading_closed_tickets = true;
    this.loading_action_tickets = true;
    this.closed_tickets = [];
    this.action_tickets = [];
    this.no_more_data = [false, false];
    this.current_page = [1, 1];
    this.getActionTickets(null);
    this.getClosedTickets(null);
  }

  doRefresh(event) {
    this.display();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  clearEvent(event) {
    if (event) event.target.complete();
  }

  loadMore(event) {
    switch (this.tab) {
      case 'open':
        this.getActionTickets(event);
        return;
      case 'closed':
        this.getClosedTickets(event);
        return;
    }
  }

  getDistricts() {
    this.api
      .get_master_districts()
      .pipe(take(1))
      .subscribe((data) => {
        this.districts_data = data;
        console.log('district data..', this.districts_data);
      });
  }

  getActionTickets(event) {
    if (!event) {
      this.loading_action_tickets = true;
      this.action_tickets = [];
      this.no_more_data[0] = false;
      this.current_page[0] = 1;
    }

    if (this.no_more_data[0]) {
      this.clearEvent(event);

      return;
    }

    let params = {
      d_id: this.district_id,
      page: this.current_page[0],
      // filter: 'Approved',
      open_state: '1',
    };

    this.api.get_cw_tickets_with_actions(params).subscribe((data: any) => {
      if (data.length === 0 && !this.loading_action_tickets) {
        this.no_more_data[0] = true;
        this.current_page[0] = 1;
        this.action_tickets = this.action_tickets.concat(data);
        this.clearEvent(event);
        return;
      }
      this.action_tickets = this.action_tickets.concat(data);

      this.loading_action_tickets = false;
      console.log('action tickets are..', this.action_tickets);
      this.current_page[0]++;
      this.clearEvent(event);
    });
  }

  getClosedTickets(event) {
    if (!event) {
      this.loading_closed_tickets = true;
      this.closed_tickets = [];
      this.no_more_data[1] = false;
      this.current_page[1] = 1;
    }

    if (this.no_more_data[1]) {
      this.clearEvent(event);
      return;
    }

    let params = {
      d_id: this.district_id,
      page: this.current_page[1],
      // filter: 'Approved',
      open_state: '0',
    };
    this.api.get_cw_tickets_with_actions(params).subscribe((data: any) => {
      if (data.length === 0 && !this.loading_closed_tickets) {
        this.no_more_data[0] = true;
        this.current_page[0] = 1;
        this.closed_tickets = this.closed_tickets.concat(data);
        this.clearEvent(event);
        return;
      }
      this.closed_tickets = this.closed_tickets.concat(data);

      this.loading_closed_tickets = false;
      console.log('closed action tickets are..', this.closed_tickets);
      this.current_page[0]++;
      this.clearEvent(event);
    });
  }

  openTicketAction(ticket) {
    this.selected_ticket = ticket;
    console.log('selected_ticket', this.selected_ticket);
    this.modal_state = true;
  }

  openClosedTicketAction(ticket) {
    this.selected_ticket = ticket;
    console.log('selected_ticket', this.selected_ticket);
    this.modal_state = true;
  }
}

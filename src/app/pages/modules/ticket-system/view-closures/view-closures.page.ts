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
  selector: 'app-view-closures',
  templateUrl: './view-closures.page.html',
  styleUrls: ['./view-closures.page.scss'],
})
export class ViewClosuresPage implements OnInit {
  lang;
  user_id;
  tab = 'open';
  no_more_data = [false, false];
  current_page = [1, 1];
  loading_closed_tickets = true;
  loading_open_tickets = true;
  previousUrl;
  reload = true;
  role;
  public open_tickets: any = [];
  public closed_tickets: any = [];

  modal_state = false;
  public selected_ticket: any;
  _moment;
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
  }

  display() {
    this.loading_closed_tickets = true;
    this.loading_open_tickets = true;
    this.closed_tickets = [];
    this.open_tickets = [];
    this.no_more_data = [false, false];
    this.current_page = [1, 1];
    this.getOpenTickets(null);
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
        this.getOpenTickets(event);
        return;
      case 'closed':
        this.getClosedTickets(event);
        return;
    }
  }

  getOpenTickets(event) {
    if (this.no_more_data[0]) {
      this.clearEvent(event);
      return;
    }

    let params = {
      u_id: this.user_id,
      page: this.current_page[0],
    };
    console.log(params);

    this.api
      .get_cw_tickets_open_with_closure_requests(params)
      .subscribe((data: any) => {
        if (data.length === 0 && !this.loading_open_tickets) {
          this.no_more_data[0] = true;
          this.current_page[0] = 1;
          this.open_tickets = this.open_tickets.concat(data);
          this.clearEvent(event);
          return;
        }
        this.open_tickets = this.open_tickets.concat(data);
        this.loading_open_tickets = false;
        console.log('open tickets are..', this.open_tickets);
        this.current_page[0]++;
        this.clearEvent(event);
      });
  }

  getClosedTickets(event) {
    if (this.no_more_data[1]) {
      this.clearEvent(event);
      return;
    }

    let params = {
      u_id: this.user_id,
      page: this.current_page[1],
    };

    this.api
      .get_cw_tickets_closed_with_closure_requests(params)
      .subscribe((data: any) => {
        if (data.length === 0 && !this.loading_closed_tickets) {
          this.no_more_data[1] = true;
          this.current_page[1] = 1;
          this.closed_tickets = this.closed_tickets.concat(data);
          this.clearEvent(event);
          return;
        }
        this.closed_tickets = this.closed_tickets.concat(data);
        this.loading_closed_tickets = false;
        console.log('closed tickets are..', this.closed_tickets);
        this.current_page[1]++;
        this.clearEvent(event);
      });
  }

  openTicketAction(ticket) {
    // this.router.navigateByUrl('ticket-system/ticket-resolver-action', {
    //   state: {
    //     ticket_id: ticketId,
    //     p_role: 'resolver',
    //   },
    // });
    this.selected_ticket = ticket;
    console.log('selected_ticket', this.selected_ticket);
    this.modal_state = true;
  }

  openClosedTicketAction(ticketId) {
    this.router.navigateByUrl('ticket-system/ticket-resolver-action', {
      state: {
        ticket_id: ticketId,
        p_role: 'resolver',
      },
    });
  }

  closeTicket() {
    this.alertCtrl
      .create({
        header: 'Close Ticket',
        message: 'Please confirm',
        cssClass: 'alert-custom',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
          },
          {
            text: 'Yes',
            role: 'ok',
            handler: async () => {
              this.loadingCtrl
                .create({
                  keyboardClose: true,
                  spinner: 'dots',
                  mode: 'ios',
                })
                .then((loadingEl) => {
                  loadingEl.present();
                  var params = {
                    ticket_id: this.selected_ticket['t_id'],
                    u_id: this.user_id,
                    msg_from: 1,
                    extra_param: 'close_cwt',
                  };
                  console.log('param', params);
                  this.api
                    .post_admin(params)
                    .pipe(take(1))
                    .subscribe(
                      (data) => {
                        console.log(data);
                        this.display();
                        loadingEl.dismiss();
                        if (data['error'] != undefined) {
                          this.authService.showAlert('Oops!', data['error']);
                        } else {
                          this.authService.showAlert(
                            data['title'],
                            data['msg']
                          );
                          this.modalCtrl.dismiss();
                          this.modal_state = false;
                        }
                      },
                      (err) => {
                        console.log('ERROR!: ', err);
                        loadingEl.dismiss();
                        this.modal_state = false;
                        this.authService.showAlert('Failed!', 'Try again');
                      }
                    );
                });
            },
          },
        ],
      })
      .then((el) => {
        el.present();
      });
  }

  handleModalDismiss(e) {
    if (this.modal_state) {
      this.modal_state = false;
    }
  }
}

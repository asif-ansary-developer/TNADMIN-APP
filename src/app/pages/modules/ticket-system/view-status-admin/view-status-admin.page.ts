import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api.service';
var _router;
import * as moment from 'moment';
import { RefreshHelperService } from 'src/app/helper/refresh-helper.service';
@Component({
  selector: 'app-view-status-admin',
  templateUrl: './view-status-admin.page.html',
  styleUrls: ['../view-status-admin-2/view-status-admin-2.page.scss'],
})
export class ViewStatusAdminPage implements OnInit {
  role;
  username;
  rr;
  _router;
  public tickets: any = [];
  public all_tickets: any = [];
  public raised_tickets: any = [];
  public unassigned_tickets: any = [];
  loading_tickets = true;
  loading_all_tickets = true;
  loading_unassigned_tickets = true;
  loading_raised_tickets = true;
  no_more_data = [];
  tab = 'assigned';
  previousUrl;
  reload = true;

  current_page = [1, 1, 1];
  _moment;
  refreshSubscription;
  constructor(
    private router: Router,
    private nav: NavController,
    private http: HttpClient,
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private actRoute: ActivatedRoute,
    private refreshHelper: RefreshHelperService
  ) {
    this._moment = moment;
    this.role = localStorage.getItem('role');
    this.rr = localStorage.getItem('_role');
    this.username = localStorage.getItem('username');
    if (this.role == '1') {
      this.current_page = [1, 1, 1, 1];
    }
  }
  // 0-raise
  // 1-assigned
  // 2-yet to be addressed
  // 3-being addressed
  // 4-being addressed

  ngOnDestroy() {
    _router.unsubscribe();
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.actRoute.queryParams.subscribe((params) => {
      this.tab = params['tab'];
    });

    _router = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (
          this.previousUrl == '/ticket-system/ticket-viewer' ||
          this.previousUrl == '/ticket-system/ticket-viewer'
        ) {
          this.reload = false;
        }
        this.previousUrl = event.url;
      }
    });
    // this.refreshSubscription = this.refreshHelper
    //   .refresh()
    //   .subscribe((needRefresh) => {
    //     if (needRefresh) {
    //       this.display();
    //       this.refreshHelper.needPageRefresh.next(false);
    //     }
    //   });
  }
  closeModal() {
    this.router.navigateByUrl('/ticket-system');
  }

  openTicketResolverAction(ticketId) {
    this.router.navigateByUrl('ticket-system/ticket-viewer', {
      state: { ticket_id: ticketId },
    });
  }

  openTicketRaiserAction(ticketId) {
    this.router.navigateByUrl('ticket-system/ticket-viewer', {
      state: { ticket_id: ticketId },
    });
  }

  ionViewDidEnter() {
    if (this.reload) this.display();
  }

  display() {
    this.loading_tickets = true;
    this.loading_all_tickets = true;
    this.loading_raised_tickets = true;
    this.loading_unassigned_tickets = true;
    this.raised_tickets = [];
    this.all_tickets = [];
    this.tickets = [];
    this.unassigned_tickets = [];
    this.no_more_data = [];

    // this.getRaisedTickets(null);
    // if (this.role == '1') this.getunassignedTickets(null);
    // this.getTickets(null);
    // if (this.role != 1) this.getAllTickets(null);
    // else this.getAdminAllTickets(null);
    this.loadMore(null);
  }

  doRefresh(event) {
    this.display();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  getTickets(event) {
    if (this.no_more_data[1]) {
      this.clearEvent(event);
      return;
    }

    let params = {
      r_id: this.username,
      page: this.current_page[1],
    };

    this.api.get_cw_tickets_by_resolver_id(params).subscribe((data: any) => {
      if (data.length === 0 && !this.loading_tickets) {
        this.no_more_data[1] = true;
        this.clearEvent(event);
        return;
      }

      this.tickets = this.tickets.concat(data);
      this.loading_tickets = false;
      console.log('tickets are..', this.tickets);

      this.current_page[1]++;

      this.clearEvent(event);
      // this.currentPage++;
      // console.log(this.currentPage);
      // this.loadingData = false;
      // if (this.tickets.length != 0) {
      //   this.tickets = this.tickets.concat(data);
      // } else this.tickets = data;
      // console.log('tickets are..', this.tickets);
    });
  }

  getAllTickets(event) {
    if (this.no_more_data[2]) {
      this.clearEvent(event);
      return;
    }
    let params = {
      r_id: this.username,
      page: this.current_page[2],
    };

    this.api
      .get_all_cw_tickets_by_resolver_id(params)
      .subscribe((data: any) => {
        if (data.length === 0 && !this.all_tickets) {
          this.no_more_data[2] = true;
          this.clearEvent(event);
          return;
        }
        this.all_tickets = this.all_tickets.concat(data);
        this.loading_all_tickets = false;
        console.log('all tickets are..', this.all_tickets);
        this.current_page[2]++;
        this.clearEvent(event);
      });
  }

  getAdminAllTickets(event) {
    if (this.no_more_data[2]) {
      this.clearEvent(event);
      return;
    }
    let params = {
      r_id: this.username,
      page: this.current_page[2],
    };

    this.api.get_other_cw_tickets_by_admin(params).subscribe((data: any) => {
      if (data.length === 0 && !this.all_tickets) {
        this.no_more_data[2] = true;
        this.clearEvent(event);
        return;
      }
      this.all_tickets = this.all_tickets.concat(data);
      this.loading_all_tickets = false;
      console.log('all tickets are..', this.all_tickets);
      this.current_page[2]++;
      this.clearEvent(event);
    });
  }

  getRaisedTickets(event) {
    if (this.no_more_data[0]) {
      this.clearEvent(event);
      return;
    }

    let params = {
      v_id: this.username,
      page: this.current_page[0],
    };

    this.api.get_cw_tickets_by_raiser_id(params).subscribe((data: any) => {
      if (data.length === 0 && !this.loading_raised_tickets) {
        this.no_more_data[0] = true;
        this.clearEvent(event);
        return;
      }

      this.raised_tickets = this.raised_tickets.concat(data);
      this.loading_raised_tickets = false;
      console.log('raised_tickets are..', this.raised_tickets);
      this.current_page[0]++;
      this.clearEvent(event);
    });
  }

  getunassignedTickets(event) {
    if (this.no_more_data[3]) {
      this.clearEvent(event);
      return;
    }

    let params = {
      role: this.role + '_unassigned',
      page: this.current_page[3],
    };

    this.api.get_cw_tickets_by_admin_role(params).subscribe((data: any) => {
      if (data.length === 0 && !this.loading_unassigned_tickets) {
        this.no_more_data[3] = true;
        this.clearEvent(event);
        return;
      }

      this.unassigned_tickets = this.unassigned_tickets.concat(data);
      this.loading_unassigned_tickets = false;
      console.log('unassigned tickets are..', this.unassigned_tickets);
      this.current_page[3]++;
      this.clearEvent(event);
    });
  }

  loadMore(event) {
    switch (this.tab) {
      case 'my':
        this.getRaisedTickets(event);
        return;
      case 'assigned':
        this.getTickets(event);
        return;
      case 'unassigned':
        this.getunassignedTickets(event);
        return;
      case 'others':
        if (this.role != 1) this.getAllTickets(event);
        else this.getAdminAllTickets(event);
        return;
    }
  }

  clearEvent(event) {
    if (event) event.target.complete();
  }

  findLastThread(threads) {
    if (threads) {
      const filteredThreads = threads.filter((thread) =>
        [0, 1, 3, 50, 100].includes(thread.status)
      );
      if (filteredThreads.length > 0) {
        return filteredThreads[filteredThreads.length - 1];
      }
    }
    return null;
  }
}

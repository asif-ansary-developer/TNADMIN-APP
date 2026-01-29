import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { ApiService } from 'src/app/providers/api.service';
var _router;
import * as moment from 'moment';
import { RefreshHelperService } from 'src/app/helper/refresh-helper.service';
@Component({
  selector: 'app-view-status-vendor',
  templateUrl: './view-status-vendor.page.html',
  styleUrls: ['./view-status-vendor.page.scss'],
})
export class ViewStatusVendorPage implements OnInit {
  lang;
  vendor_id;
  tab = 'raised_tickets';
  no_more_data = [];
  current_page = [1, 1];
  loading_tickets = true;
  loading_other_tickets = true;
  previousUrl;
  reload = true;
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
    this.lang = localStorage.getItem('language');
    this.vendor_id = localStorage.getItem('username');
    this._moment = moment;
  }

  // 0-raised
  // 1-assigned
  // 2-yet to be addressed
  // 3-being addressed
  // 4-being addressed

  public tickets: any = [];
  public other_tickets: any = [];
  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    _router.unsubscribe();
  }

  ngOnInit() {
    this.actRoute.queryParams.subscribe((params) => {
      this.tab = params['tab'];
    });

    _router = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (
          this.previousUrl == '/ticket-system/ticket-resolver-action' ||
          this.previousUrl == '/ticket-system/ticket-raiser-action'
        ) {
          this.reload = false;
        }
        this.previousUrl = event.url;
        console.log(event);
      }
    });

    // this.refreshSubscription = this.refreshHelper
    //   .refresh()
    //   .subscribe((needRefresh) => {
    //     if (needRefresh) {
    //       this.displayDiscrete();
    //       this.refreshHelper.needPageRefresh.next(false);
    //     }
    //   });
  }
  closeModal() {
    this.router.navigateByUrl('/ticket-system');
  }

  openTicketAction(ticketId) {
    this.router.navigateByUrl('ticket-system/ticket-raiser-action', {
      state: { ticket_id: ticketId },
    });
  }

  openOhterTicketAction(ticketId) {
    this.router.navigateByUrl('ticket-system/ticket-resolver-action', {
      state: {
        ticket_id: ticketId,
        p_role: 'resolver',
      },
    });
  }

  ionViewDidEnter() {
    if (this.reload) this.display();
  }

  getTickets(event) {
    if (this.no_more_data[0]) {
      this.clearEvent(event);
      return;
    }

    let params = {
      v_id: this.vendor_id,
      page: this.current_page[0],
    };

    this.api.get_cw_tickets_by_raiser_id(params).subscribe((data: any) => {
      if (data.length === 0 && !this.loading_tickets) {
        this.no_more_data[0] = true;
        this.clearEvent(event);
        return;
      }
      this.tickets = this.tickets.concat(data);
      this.loading_tickets = false;
      console.log('tickets are..', this.tickets);
      this.current_page[0]++;
      this.clearEvent(event);
    });
  }

  getOtherTickets(event) {
    if (this.no_more_data[1]) {
      this.clearEvent(event);
      return;
    }
    let params = {
      v_id: this.vendor_id,
      // role: 'vendor',
      role: this.vendor_id,
      page: this.current_page[1],
    };

    console.log(params);
    this.api.get_cw_tickets_by_resolver_role(params).subscribe((data: any) => {
      if (data.length === 0 && !this.loading_other_tickets) {
        this.no_more_data[1] = true;
        this.clearEvent(event);
        return;
      }
      this.other_tickets = this.other_tickets.concat(data);
      this.loading_other_tickets = false;
      console.log('other tickets are..', this.other_tickets);
      this.current_page[1]++;
      this.clearEvent(event);
    });
  }

  display() {
    this.loading_tickets = true;
    this.loading_other_tickets = true;
    this.other_tickets = [];
    this.tickets = [];
    this.no_more_data = [];
    this.current_page = [1, 1];
    if (this.tab == 'raised_tickets') this.getTickets(null);
    else this.getOtherTickets(null);
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
      case 'raised_tickets':
        this.getTickets(event);
        return;
      case 'assigned_tickets':
        this.getOtherTickets(event);
        return;
    }
  }
}

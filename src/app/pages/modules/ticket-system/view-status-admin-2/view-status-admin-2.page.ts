import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api.service';
import { DistrictSelectorPage } from '../district-selector/district-selector.page';
import * as moment from 'moment';
import { AuthService } from 'src/app/guard/auth.service';
import { RefreshHelperService } from 'src/app/helper/refresh-helper.service';
var _router;
@Component({
  selector: 'app-view-status-admin-2',
  templateUrl: './view-status-admin-2.page.html',
  styleUrls: ['./view-status-admin-2.page.scss'],
})
export class ViewStatusAdmin2Page implements OnInit {
  role;
  username;
  rr;
  districtId;
  districtName;
  modalState = false;
  public tickets: any = [];
  public all_tickets: any = [];
  public raised_tickets: any = [];
  public unassigned_tickets: any = [];
  public hq_tickets: any = [];
  public overall_tickets: any = [];
  public payment_tickets: any = [];
  loading_tickets = true;
  loading_all_tickets = true;
  loading_unassigned_tickets = true;
  loading_raised_tickets = true;
  loading_hq_tickets = true;
  loading_overall_tickets = false;
  loading_payment_tickets = false;
  no_more_data = [false, false, false, false, false, false];
  tab = 'assigned_tickets';
  tab2 = 'HQ';

  current_page = [1, 1, 1, 1, 1];

  previousUrl;
  refreshSubscription;
  reload = true;
  _moment;
  constructor(
    private router: Router,
    private nav: NavController,
    private http: HttpClient,
    private api: ApiService,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private actRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private refreshHelper: RefreshHelperService
  ) {
    this.role = localStorage.getItem('role');
    this.rr = localStorage.getItem('_role');
    this.username = localStorage.getItem('username');
    if (this.role == '1') {
      this.current_page = [1, 1, 1, 1, 1, 1];
    }

    this._moment = moment;
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
      this.tab2 = params['tab2'] ? params['tab2'] : null;
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
      }
    });
    // this.refreshSubscription = this.refreshHelper
    //   .refresh()
    //   .subscribe((needRefresh) => {
    //     if (needRefresh) {
    //       this.display();
    //       this.cdr.detectChanges();
    //       this.refreshHelper.needPageRefresh.next(false);
    //     }
    //   });
  }
  closeModal() {
    this.router.navigateByUrl('/ticket-system');
  }

  openTicketResolverAction(ticketId) {
    this.router.navigateByUrl('ticket-system/ticket-resolver-action', {
      state: { ticket_id: ticketId, unassigned: true },
    });
  }

  openTicketRaiserAction(ticketId) {
    this.router.navigateByUrl('ticket-system/ticket-raiser-action', {
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
    this.loading_payment_tickets = true;
    this.raised_tickets = [];
    this.all_tickets = [];
    this.tickets = [];
    this.unassigned_tickets = [];
    this.payment_tickets = [];
    this.no_more_data = [false, false, false, false, false, false];
    this.current_page = [1, 1, 1, 1, 1, 1];

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

  getRaisedTickets(event) {
    if (this.no_more_data[0]) {
      this.clearEvent(event);
      return;
    }

    var params;
    if ((this.role = '1'))
      params = {
        v_id: this.username,
        page: this.current_page[0],
        type: '0',
      };
    else
      params = {
        v_id: this.username,
        page: this.current_page[0],
      };

    this.api.get_cw_tickets_by_raiser_id(params).subscribe((data: any) => {
      if (data.length === 0 && !this.loading_raised_tickets) {
        this.no_more_data[0] = true;
        this.current_page[0] = 0;

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
        this.current_page[1] = 0;

        this.clearEvent(event);
        return;
      }

      this.tickets = this.tickets.concat(data);
      this.loading_tickets = false;
      console.log('tickets are..', this.tickets);

      this.current_page[1]++;

      this.clearEvent(event);
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
        if (data.length === 0 && !this.loading_all_tickets) {
          this.no_more_data[2] = true;
          this.current_page[2] = 0;

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

  getunassignedTickets(event) {
    if (this.no_more_data[2]) {
      this.clearEvent(event);
      return;
    }

    let params = {
      role: this.role + '_unassigned',
      page: this.current_page[2],
    };

    this.api.get_cw_tickets_by_admin_role(params).subscribe((data: any) => {
      if (data.length === 0 && !this.loading_unassigned_tickets) {
        this.no_more_data[2] = true;
        this.current_page[2] = 0;

        this.clearEvent(event);
        return;
      }

      this.unassigned_tickets = this.unassigned_tickets.concat(data);
      this.loading_unassigned_tickets = false;
      console.log('unassigned tickets are..', this.unassigned_tickets);
      this.current_page[2]++;
      this.clearEvent(event);
    });
  }

  getOverallTickets(event, dis_id) {
    if (this.no_more_data[4]) {
      this.clearEvent(event);
      return;
    }
    let params = {
      d_id: dis_id,
      page: this.current_page[4],
    };
    console.log(params);

    if (this.role == 'ven_master') {
      this.api
        .get_cw_tickets_districtwise_ven(params)
        .subscribe((data: any) => {
          if (data.length == 0 && !this.loading_overall_tickets) {
            this.no_more_data[4] = true;
            this.current_page[4] = 0;
            this.loading_overall_tickets = false;
            this.clearEvent(event);
            return;
          }

          this.overall_tickets = this.overall_tickets.concat(data);
          this.loading_overall_tickets = false;
          console.log('overall tickets are..', this.overall_tickets);
          this.current_page[4]++;
          this.clearEvent(event);
        });
    } else {
      this.api.get_cw_tickets_districtwise(params).subscribe((data: any) => {
        if (data.length == 0 && !this.loading_overall_tickets) {
          this.no_more_data[4] = true;
          this.current_page[4] = 0;
          this.loading_overall_tickets = false;
          this.clearEvent(event);
          return;
        }

        this.overall_tickets = this.overall_tickets.concat(data);
        this.loading_overall_tickets = false;
        console.log('overall tickets are..', this.overall_tickets);
        this.current_page[4]++;
        this.clearEvent(event);
      });
    }
  }

  getAdminAllTickets(event) {
    if (this.no_more_data[3]) {
      this.clearEvent(event);
      return;
    }
    let params = {
      page: this.current_page[3],
    };

    this.api.get_other_cw_tickets_by_admin(params).subscribe((data: any) => {
      if (data.length === 0 && !this.loading_hq_tickets) {
        this.no_more_data[3] = true;
        this.current_page[3] = 0;

        this.clearEvent(event);
        return;
      }
      this.hq_tickets = this.hq_tickets.concat(data);
      this.loading_hq_tickets = false;
      console.log('hq tickets are..', this.hq_tickets);
      this.current_page[3]++;
      this.clearEvent(event);
    });
  }

  getPaymentTickets(event) {
    if (this.no_more_data[5]) {
      this.clearEvent(event);
      return;
      ``;
    }
    let params = {
      page: this.current_page[5],
      r_id: this.username,
    };

    this.api
      .get_payment_involved_tickets_by_raiser_id(params)
      .subscribe((data: any) => {
        if (data.length === 0 && !this.loading_payment_tickets) {
          this.no_more_data[5] = true;
          this.current_page[5] = 0;

          this.clearEvent(event);
          return;
        }
        this.payment_tickets = this.payment_tickets.concat(data);
        this.loading_payment_tickets = false;
        console.log('payment tickets are..', this.payment_tickets);
        this.current_page[5]++;
        this.clearEvent(event);
      });
  }

  loadMore(event) {
    switch (this.tab) {
      case 'raised_tickets':
        this.getRaisedTickets(event);
        return;
      case 'assigned_tickets':
        this.getTickets(event);
        return;
      case 'unassigned_tickets':
        this.getunassignedTickets(event);
        return;
      case 'others':
        this.getAllTickets(event);
        return;
      case 'vendor_payment_tickets':
        this.getPaymentTickets(event);
        return;
      case 'others_admin':
        if (this.tab2 == 'district') {
          if (this.districtId) this.getOverallTickets(event, this.districtId);
        } else this.getAdminAllTickets(event);
        return;
    }
  }

  tab2Handler(e) {
    console.log(e.target.value);
    if (e.target.value == 'district') {
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

  async presentDistrictSelector() {
    if (!this.modalState) {
      this.modalState = true;
      const modal = await this.modalCtrl.create({
        component: DistrictSelectorPage,
        cssClass: 'station-li-popup',
      });

      this.loading_overall_tickets = true;
      this.overall_tickets = [];
      this.no_more_data[4] = false;
      this.current_page[4] = 1;

      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned != null) {
          if (
            dataReturned['data'] != undefined &&
            dataReturned['data'] != null
          ) {
            if (dataReturned['data']['district'].length != 0) {
              this.districtId = dataReturned.data['district'][0]['district_id'];
              this.districtName =
                dataReturned.data['district'][0]['district_name'];
              console.log(this.districtName, this.districtId);

              this.loading_overall_tickets = true;
              this.overall_tickets = [];
              if (!this.searchTerm)
                this.getOverallTickets(null, this.districtId);
              else this.fetchSearchResults(this.searchTerm);
            }
          } else {
            this.districtId = null;
            this.districtName = null;
          }
        }
        this.modalState = false;
      });
      return await modal.present().then(() => {});
    }
  }

  filtereditems: any;
  searchTerm: string = '';

  async filterItems(ev: any) {
    this.searchTerm = ev.target.value;
    console.log('searchterm', this.searchTerm);
    if (this.searchTerm && this.searchTerm.trim() != '') {
      console.log(this.searchTerm);
      if (this.searchTerm.length > 0) {
        this.fetchSearchResults(this.searchTerm.trim());
      } else {
        this.filtereditems = null;
      }
    } else {
      this.filtereditems = null;
    }
  }

  resetSearch() {
    this.searchTerm = null;
    this.getOverallTickets(null, this.districtId);
  }

  fetchSearchResults(keyword: string) {
    if (keyword) {
      var param;
      param = {
        t_id: 'cwt' + keyword,
        d_id: this.districtId,
        role: this.role,
      };

      this.api.get_cw_tickets_by_id_search(param).subscribe(
        (data) => {
          if (this.searchTerm && this.searchTerm.trim() != '') {
            this.overall_tickets = data;
            this.loading_overall_tickets = false;
          }
        },
        (error) => {
          console.error('Error fetching search results', error);
        }
      );
    } else {
      this.authService.showToast('Please select a District');
    }
  }
}

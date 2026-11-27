import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api.service';
import { DistrictSelectorPage } from '../district-selector/district-selector.page';
import * as moment from 'moment';
import { AuthService } from 'src/app/guard/auth.service';
import { RefreshHelperService } from 'src/app/helper/refresh-helper.service';

import { forkJoin, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

  filtereditems: any;
  searchTerm: string = '';
  districtSearchRequestId = 0;
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
  prefetching_pages: boolean = false;

  loading_filter_options: boolean = false;
  districtId: string = '2'; // Replace '1' with Chennai's exact district_id in your DB/DistrictSelectorPage
  districtName: string = 'Chennai';

  districtFilterModalOpen: boolean = false;
  selectedDistrictStation: string = 'all';
  districtDateFrom: string | null = null;
  districtDateTo: string | null = null;
  todayIso: string = moment().format('YYYY-MM-DD');
  filtering_district_tickets: boolean = false;

  current_page = [1, 1, 1, 1, 1];

  paymentSearchTerm: string = '';
  paymentSearchRequestId = 0;

  assignedSearchTerm: string = '';
  assignedSearchRequestId = 0;
  assignedSearchSub: Subscription;

  unassignedSearchTerm: string = '';
  unassignedSearchRequestId = 0;
  unassignedSearchSub: Subscription;

  raisedSearchTerm: string = '';
  raisedSearchRequestId = 0;
  raisedSearchSub: Subscription;

  previousUrl;
  refreshSubscription;
  paymentSearchSub: Subscription;
  reload = true;
  _moment;


  // Filter & Sort State
  selectedStatusFilter: string = 'all';
  selectedDistrictFilter: string = 'all';
  selectedTalukFilter: string = 'all';
  selectedIssueTypeFilter: string = 'all';
  selectedRaiserFilter: string = 'all';
  selectedFromDate: string | null = null;
  selectedToDate: string | null = null;
  sortOrder: 'newest' | 'oldest' | 'id_desc' | 'id_asc' = 'newest';
  filterModalOpen: boolean = false;

  constructor(
    private router: Router,
    private nav: NavController,
    private http: HttpClient,
    private api: ApiService,
    private authService: AuthService,
    private modalCtrl: ModalController,
    private actRoute: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    private cdr: ChangeDetectorRef,
    private refreshHelper: RefreshHelperService,
    private loadingCtrl: LoadingController,
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



  ngOnInit() {
    this.actRoute.queryParams.subscribe((params) => {
      this.tab = params['tab'];
      this.tab2 = params['tab2'] ? params['tab2'] : null;

      if (this.tab === 'others_admin' && this.tab2 === 'district') {
        this.initDefaultDistrict();
      }
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




  initDefaultDistrict() {
    if (!this.districtId) {
      this.districtId = '2'; // Match Chennai's district_id from DistrictSelectorPage
      this.districtName = 'Chennai';
    }

    if (this.overall_tickets.length === 0) {
      this.loading_overall_tickets = true;
      this.no_more_data[4] = false;
      this.current_page[4] = 1;
      this.getOverallTickets(null, this.districtId);
    }
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
    this.prefetching_pages = false;
    this.resetFilters();


    if (this.tab === 'others_admin' && this.tab2 === 'district') {
      if (!this.districtId) {
        this.districtId = '2';
        this.districtName = 'Chennai';
      }
      this.loading_overall_tickets = true;
    }
    this.loadMore(null);
  }

  doRefresh(event) {
    this.display();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  // getRaisedTickets(event) {
  //   if (this.no_more_data[0]) {
  //     this.clearEvent(event);
  //     return;
  //   }

  //   var params;
  //   if ((this.role = '1'))
  //     params = {
  //       v_id: this.username,
  //       page: this.current_page[0],
  //       type: '0',
  //     };
  //   else
  //     params = {
  //       v_id: this.username,
  //       page: this.current_page[0],
  //     };

  //   this.api.get_cw_tickets_by_raiser_id(params).subscribe((data: any) => {
  //     if (data.length === 0 && !this.loading_raised_tickets) {
  //       this.no_more_data[0] = true;
  //       this.current_page[0] = 0;

  //       this.clearEvent(event);
  //       return;
  //     }

  //     this.raised_tickets = this.raised_tickets.concat(data);
  //     this.loading_raised_tickets = false;
  //     console.log('raised_tickets are..', this.raised_tickets);
  //     this.current_page[0]++;
  //     this.clearEvent(event);
  //   });
  // }

  // getTickets(event) {
  //   if (this.no_more_data[1]) {
  //     this.clearEvent(event);
  //     return;
  //   }

  //   let params = {
  //     r_id: this.username,
  //     page: this.current_page[1],
  //   };

  //   this.api.get_cw_tickets_by_resolver_id(params).subscribe((data: any) => {
  //     if (data.length === 0 && !this.loading_tickets) {
  //       this.no_more_data[1] = true;
  //       this.current_page[1] = 0;

  //       this.clearEvent(event);
  //       return;
  //     }

  //     this.tickets = this.tickets.concat(data);
  //     this.loading_tickets = false;
  //     console.log('tickets are..', this.tickets);

  //     this.current_page[1]++;

  //     this.clearEvent(event);
  //   });
  // }

  getRaisedTickets(event) {
    if (this.no_more_data[0]) {
      this.clearEvent(event);
      return;
    }

    if (this.current_page[0] === 1) {
      this.loading_raised_tickets = true;
    }

    if (this.raisedSearchSub) {
      this.raisedSearchSub.unsubscribe();
    }

    const requestId = this.raisedSearchRequestId;

    let params: any = {
      v_id: this.username,
      page: this.current_page[0],
    };

    if (this.role == '1') {
      params.type = '0';
    }

    const keyword = this.raisedSearchTerm?.trim();
    if (keyword) {
      params.search = keyword;
    }

    this.raisedSearchSub = this.api
      .get_cw_tickets_by_raiser_id(params)
      .subscribe(
        (data: any) => {
          if (requestId !== this.raisedSearchRequestId) {
            this.clearEvent(event);
            return;
          }

          if (!Array.isArray(data) || data.length === 0) {
            this.no_more_data[0] = true;
            this.current_page[0] = 0;
            this.loading_raised_tickets = false;
            this.clearEvent(event);
            return;
          }

          this.raised_tickets = this.raised_tickets.concat(data);
          this.loading_raised_tickets = false;
          this.current_page[0]++;
          this.clearEvent(event);

          if (this.current_page[0] === 2) {
            this.prefetchRemainingPagesInBackground();
          }
        },
        (error) => {
          if (requestId === this.raisedSearchRequestId) {
            this.loading_raised_tickets = false;
          }
          console.error('Raised ticket search error:', error);
          this.clearEvent(event);
        }
      );
  }

  filterRaisedTickets(ev: any) {
    this.raisedSearchTerm = ev.detail.value || '';

    this.raisedSearchRequestId++;
    this.current_page[0] = 1;
    this.no_more_data[0] = false;
    this.raised_tickets = [];
    this.loading_raised_tickets = true;

    this.getRaisedTickets(null);
  }


  getTickets(event) {
    if (this.no_more_data[1]) {
      this.clearEvent(event);
      return;
    }

    if (this.current_page[1] === 1) {
      this.loading_tickets = true;
    }

    if (this.assignedSearchSub) {
      this.assignedSearchSub.unsubscribe();
    }

    const requestId = this.assignedSearchRequestId;

    let params: {
      r_id: any;
      page: number;
      search?: string;
    } = {
      r_id: this.username,
      page: this.current_page[1],
    };

    const keyword = this.assignedSearchTerm?.trim();
    if (keyword) {
      params.search = keyword;
    }

    this.assignedSearchSub = this.api
      .get_cw_tickets_by_resolver_id(params)
      .subscribe(
        (data: any) => {
          if (requestId !== this.assignedSearchRequestId) {
            this.clearEvent(event);
            return;
          }

          if (!Array.isArray(data) || data.length === 0) {
            this.no_more_data[1] = true;
            this.current_page[1] = 0;
            this.loading_tickets = false;
            this.clearEvent(event);
            return;
          }

          this.tickets = this.tickets.concat(data);
          this.loading_tickets = false;
          this.current_page[1]++;
          this.clearEvent(event);

          if (this.current_page[1] === 2) {
            this.prefetchRemainingPagesInBackground();
          }
        },
        (error) => {
          if (requestId === this.assignedSearchRequestId) {
            this.loading_tickets = false;
          }
          console.error('Assigned ticket search error:', error);
          this.clearEvent(event);
        }
      );
  }

  filterAssignedTickets(ev: any) {
    this.assignedSearchTerm = ev.detail.value || '';

    this.assignedSearchRequestId++;
    this.current_page[1] = 1;
    this.no_more_data[1] = false;
    this.tickets = [];
    this.loading_tickets = true;

    this.getTickets(null);
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

    if (this.current_page[2] === 1) {
      this.loading_unassigned_tickets = true;
    }

    if (this.unassignedSearchSub) {
      this.unassignedSearchSub.unsubscribe();
    }

    const requestId = this.unassignedSearchRequestId;

    let params: {
      role: string;
      page: number;
      search?: string;
    } = {
      role: this.role + '_unassigned',
      page: this.current_page[2],
    };

    const keyword = this.unassignedSearchTerm?.trim();
    if (keyword) {
      params.search = keyword;
    }

    this.unassignedSearchSub = this.api
      .get_cw_tickets_by_admin_role(params)
      .subscribe(
        (data: any) => {
          if (requestId !== this.unassignedSearchRequestId) {
            this.clearEvent(event);
            return;
          }

          if (!Array.isArray(data) || data.length === 0) {
            this.no_more_data[2] = true;
            this.current_page[2] = 0;
            this.loading_unassigned_tickets = false;
            this.clearEvent(event);
            return;
          }

          this.unassigned_tickets = this.unassigned_tickets.concat(data);
          this.loading_unassigned_tickets = false;
          this.current_page[2]++;
          this.clearEvent(event);

          if (this.current_page[2] === 2) {
            this.prefetchRemainingPagesInBackground();
          }
        },
        (error) => {
          if (requestId === this.unassignedSearchRequestId) {
            this.loading_unassigned_tickets = false;
          }
          console.error('Unassigned ticket search error:', error);
          this.clearEvent(event);
        }
      );
  }

  filterUnassignedTickets(ev: any) {
    this.unassignedSearchTerm = ev.detail.value || '';

    this.unassignedSearchRequestId++;
    this.current_page[2] = 1;
    this.no_more_data[2] = false;
    this.unassigned_tickets = [];
    this.loading_unassigned_tickets = true;

    this.getunassignedTickets(null);
  }

  // getOverallTickets(event, dis_id) {
  //   if (this.no_more_data[4]) {
  //     this.clearEvent(event);
  //     return;
  //   }
  //   let params = {
  //     d_id: dis_id,
  //     page: this.current_page[4],
  //   };
  //   console.log(params);

  //   if (this.role == 'ven_master') {
  //     this.api
  //       .get_cw_tickets_districtwise_ven(params)
  //       .subscribe((data: any) => {
  //         if (data.length == 0 && !this.loading_overall_tickets) {
  //           this.no_more_data[4] = true;
  //           this.current_page[4] = 0;
  //           this.loading_overall_tickets = false;
  //           this.clearEvent(event);
  //           return;
  //         }

  //         this.overall_tickets = this.overall_tickets.concat(data);
  //         this.loading_overall_tickets = false;
  //         console.log('overall tickets are..', this.overall_tickets);
  //         this.current_page[4]++;
  //         this.clearEvent(event);
  //       });
  //   } else {
  //     this.api.get_cw_tickets_districtwise(params).subscribe((data: any) => {
  //       if (data.length == 0 && !this.loading_overall_tickets) {
  //         this.no_more_data[4] = true;
  //         this.current_page[4] = 0;
  //         this.loading_overall_tickets = false;
  //         this.clearEvent(event);
  //         return;
  //       }

  //       this.overall_tickets = this.overall_tickets.concat(data);
  //       this.loading_overall_tickets = false;
  //       console.log('overall tickets are..', this.overall_tickets);
  //       this.current_page[4]++;
  //       this.clearEvent(event);
  //     });
  //   }
  // }

  getOverallTickets(event, dis_id) {
    if (this.no_more_data[4]) {
      this.clearEvent(event);
      return;
    }
    let params = {
      d_id: dis_id,
      page: this.current_page[4],
    };

    const req$ =
      this.role == 'ven_master'
        ? this.api.get_cw_tickets_districtwise_ven(params)
        : this.api.get_cw_tickets_districtwise(params);

    req$.subscribe({
      next: (data: any) => {
        if (!Array.isArray(data) || data.length === 0) {
          this.no_more_data[4] = true;
          this.current_page[4] = 0;
          this.loading_overall_tickets = false;
          this.clearEvent(event);
          return;
        }

        this.overall_tickets = this.overall_tickets.concat(data);
        this.loading_overall_tickets = false;
        this.current_page[4]++;
        this.clearEvent(event);
      },
      error: () => {
        this.no_more_data[4] = true;
        this.loading_overall_tickets = false;
        this.clearEvent(event);
      },
    });
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
    }

    // Show tab loader only on first page (initial load or new search), not infinite scroll
    if (this.current_page[5] === 1) {
      this.loading_payment_tickets = true;
    }

    // Cancel previous slow search request if still running
    if (this.paymentSearchSub) {
      this.paymentSearchSub.unsubscribe();
    }

    const requestId = this.paymentSearchRequestId;

    let params: any = {
      page: this.current_page[5],
      r_id: this.username,
    };

    const keyword = this.paymentSearchTerm?.trim();
    if (keyword) {
      params.search = keyword;
    }

    this.paymentSearchSub = this.api
      .get_payment_involved_tickets_by_raiser_id(params)
      .subscribe(
        (data: any) => {
          if (requestId !== this.paymentSearchRequestId) {
            this.clearEvent(event);
            return;
          }

          if (!Array.isArray(data) || data.length === 0) {
            this.no_more_data[5] = true;
            this.current_page[5] = 0;
            this.loading_payment_tickets = false;
            this.clearEvent(event);
            return;
          }

          this.payment_tickets = this.payment_tickets.concat(data);
          this.loading_payment_tickets = false;
          this.current_page[5]++;
          this.clearEvent(event);

          if (this.current_page[5] === 2) {
            this.prefetchRemainingPagesInBackground();
          }
        },
        (error) => {
          if (requestId === this.paymentSearchRequestId) {
            this.loading_payment_tickets = false;
          }
          console.error('Payment ticket search error:', error);
          this.clearEvent(event);
        }
      );
  }






  // loadMore(event) {
  //   switch (this.tab) {
  //     case 'raised_tickets':
  //       this.getRaisedTickets(event);
  //       return;
  //     case 'assigned_tickets':
  //       this.getTickets(event);
  //       return;
  //     case 'unassigned_tickets':
  //       this.getunassignedTickets(event);
  //       return;
  //     case 'others':
  //       this.getAllTickets(event);
  //       return;
  //     case 'vendor_payment_tickets':
  //       this.getPaymentTickets(event);
  //       return;
  //     case 'others_admin':
  //       if (this.tab2 == 'district') {
  //         if (this.districtId) this.getOverallTickets(event, this.districtId);
  //       } else this.getAdminAllTickets(event);
  //       return;
  //   }
  // }

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

  // async presentDistrictSelector() {
  //   if (!this.modalState) {
  //     this.modalState = true;
  //     const modal = await this.modalCtrl.create({
  //       component: DistrictSelectorPage,
  //       cssClass: 'station-li-popup',
  //     });

  //     this.loading_overall_tickets = true;
  //     this.overall_tickets = [];
  //     this.no_more_data[4] = false;
  //     this.current_page[4] = 1;

  //     modal.onDidDismiss().then((dataReturned) => {
  //       if (dataReturned != null) {
  //         if (
  //           dataReturned['data'] != undefined &&
  //           dataReturned['data'] != null
  //         ) {
  //           if (dataReturned['data']['district'].length != 0) {
  //             this.districtId = dataReturned.data['district'][0]['district_id'];
  //             this.districtName =
  //               dataReturned.data['district'][0]['district_name'];
  //             console.log(this.districtName, this.districtId);

  //             this.loading_overall_tickets = true;
  //             this.overall_tickets = [];
  //             if (!this.searchTerm)
  //               this.getOverallTickets(null, this.districtId);
  //             else this.fetchSearchResults(this.searchTerm);
  //           }
  //         } else {
  //           this.districtId = null;
  //           this.districtName = null;
  //         }
  //       }
  //       this.modalState = false;
  //     });
  //     return await modal.present().then(() => { });
  //   }
  // }


  async presentDistrictSelector() {
    if (!this.modalState) {
      this.modalState = true;
      const modal = await this.modalCtrl.create({
        component: DistrictSelectorPage,
        cssClass: 'station-li-popup',
      });

      modal.onDidDismiss().then((dataReturned) => {
        if (
          dataReturned?.data?.district &&
          dataReturned.data.district.length !== 0
        ) {
          this.districtId = dataReturned.data.district[0].district_id;
          this.districtName = dataReturned.data.district[0].district_name;

          // Reset station/date filters when switching to a new district
          this.resetDistrictTabFilters();

          this.loading_overall_tickets = true;
          this.overall_tickets = [];
          this.no_more_data[4] = false;
          this.current_page[4] = 1;

          if (!this.searchTerm || this.searchTerm.trim() === '') {
            this.getOverallTickets(null, this.districtId);
          } else {
            this.fetchSearchResults(this.searchTerm.trim());
          }
        }
        this.modalState = false;
      });

      return await modal.present();
    }
  }


  filterItems(ev: any) {
    const rawVal = ev?.detail?.value ?? ev?.target?.value ?? '';
    this.searchTerm = String(rawVal).trim();

    if (this.searchTerm.length >= 1) {
      this.fetchSearchResults(this.searchTerm);
    } else {
      this.resetSearch();
    }
  }

  resetSearch() {
    this.searchTerm = '';
    this.filtereditems = null;
    this.districtSearchRequestId++;

    if (!this.districtId) {
      this.districtId = '1'; // Default Chennai ID
      this.districtName = 'Chennai';
    }

    this.loading_overall_tickets = true;
    this.overall_tickets = [];
    this.no_more_data[4] = false;
    this.current_page[4] = 1;
    this.cdr.detectChanges();

    this.getOverallTickets(null, this.districtId);
  }

  fetchSearchResults(keyword: string) {
    if (!this.districtId) {
      this.districtId = '1'; // Default Chennai ID
      this.districtName = 'Chennai';
    }

    const cleanKeyword = String(keyword).trim();
    if (!cleanKeyword) {
      this.resetSearch();
      return;
    }

    const requestId = ++this.districtSearchRequestId;
    this.loading_overall_tickets = true;
    this.overall_tickets = [];
    this.no_more_data[4] = true; // Prevent infinite scroll from mixing unfiltered pages into search results
    this.cdr.detectChanges();

    const param = {
      t_id: 'cwt' + cleanKeyword,
      d_id: this.districtId,
      role: this.role,
    };

    this.api.get_cw_tickets_by_id_search(param).subscribe({
      next: (data: any) => {
        if (requestId !== this.districtSearchRequestId) return;

        this.overall_tickets = Array.isArray(data) ? data : [];
        this.loading_overall_tickets = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        if (requestId !== this.districtSearchRequestId) return;

        console.error('Error fetching search results', error);
        this.overall_tickets = [];
        this.loading_overall_tickets = false;
        this.cdr.detectChanges();
      },
    });
  }


  filterPaymentTickets(ev: any) {
    this.paymentSearchTerm = ev.detail.value || '';

    this.paymentSearchRequestId++;
    this.current_page[5] = 1;
    this.no_more_data[5] = false;
    this.payment_tickets = [];
    this.loading_payment_tickets = true;

    this.getPaymentTickets(null);
  }

  ngOnDestroy() {


    _router.unsubscribe();

    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
    if (this.paymentSearchSub) {
      this.paymentSearchSub.unsubscribe();
    }
    if (this.assignedSearchSub) {
      this.assignedSearchSub.unsubscribe();
    }
  }


  onTabSearch(ev: any) {
    if (this.tab === 'vendor_payment_tickets') {
      this.filterPaymentTickets(ev);
    } else if (this.tab === 'assigned_tickets') {
      this.filterAssignedTickets(ev);
    } else if (this.tab === 'unassigned_tickets') {
      this.filterUnassignedTickets(ev);
    } else if (this.tab === 'raised_tickets') {
      this.filterRaisedTickets(ev);
    }
  }

  onTabDistrictFilterChange() {
    this.selectedTalukFilter = 'all';
  }

  get activeSearchTerm(): string {
    if (this.tab === 'vendor_payment_tickets') return this.paymentSearchTerm;
    if (this.tab === 'assigned_tickets') return this.assignedSearchTerm;
    if (this.tab === 'unassigned_tickets') return this.unassignedSearchTerm;
    if (this.tab === 'raised_tickets') return this.raisedSearchTerm;
    return '';
  }



  // Sort and filter methods
  get activeTabRawTickets(): any[] {
    switch (this.tab) {
      case 'raised_tickets':
        return this.raised_tickets;
      case 'assigned_tickets':
        return this.tickets;
      case 'unassigned_tickets':
        return this.unassigned_tickets;
      case 'vendor_payment_tickets':
        return this.payment_tickets;
      default:
        return [];
    }
  }

  // get hasActiveFilters(): boolean {
  //   return (
  //     this.selectedStatusFilter !== 'all' ||
  //     this.selectedDistrictFilter !== 'all' ||
  //     this.selectedTalukFilter !== 'all' ||
  //     this.selectedIssueTypeFilter !== 'all' ||
  //     this.selectedRaiserFilter !== 'all' ||
  //     !!this.selectedFromDate ||
  //     !!this.selectedToDate
  //   );
  // }

  // get activeFilterCount(): number {
  //   let count = 0;
  //   if (this.selectedStatusFilter !== 'all') count++;
  //   if (this.selectedDistrictFilter !== 'all') count++;
  //   if (this.selectedTalukFilter !== 'all') count++;
  //   if (this.selectedIssueTypeFilter !== 'all') count++;
  //   if (this.selectedRaiserFilter !== 'all') count++;
  //   if (this.selectedFromDate || this.selectedToDate) count++;
  //   return count;
  // }


  // Helper to get the latest status text from a ticket's threads
  getTicketCurrentStatus(ticket: any): string {

    return ticket?.difficulty ? String(ticket.difficulty).trim() : '';
  }

  // Dynamically extract all unique statuses from the loaded tickets
  getUniqueStatusOptions(): string[] {
    const list = this.activeTabRawTickets;
    if (!Array.isArray(list)) return [];

    const statuses = list
      .map((ticket) => this.getTicketCurrentStatus(ticket))
      .filter((status) => status !== '');

    return Array.from(new Set(statuses)).sort((a, b) => a.localeCompare(b));
  }

  getUniqueOptions(key: string): string[] {
    let list = this.activeTabRawTickets;
    if (!Array.isArray(list)) return [];

    // Narrow taluks to the selected district if one is picked
    if (key === 'taluk' && this.selectedDistrictFilter !== 'all') {
      list = list.filter(
        (t) =>
          (t.district || '').trim().toLowerCase() ===
          this.selectedDistrictFilter.toLowerCase()
      );
    }

    const values = list
      .map((item) => {
        if (key === 'raiser_name') {
          return (item.raiser_name || item.ticket_owner || '').trim();
        }
        return item[key] ? String(item[key]).trim() : '';
      })
      .filter((val) => val !== '');

    return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
  }

  // onDistrictFilterChange() {
  //   this.selectedTalukFilter = 'all';
  // }

  // getProcessedTickets(sourceList: any[]): any[] {
  //   if (!Array.isArray(sourceList)) return [];

  //   const fromStr = this.normalizeDateOnly(this.selectedFromDate);
  //   const toStr = this.normalizeDateOnly(this.selectedToDate);

  //   const filtered = sourceList.filter((ticket) => {
  //     const lastThread =
  //       ticket.threads && ticket.threads.length > 0
  //         ? ticket.threads[ticket.threads.length - 1]
  //         : null;
  //     const lastStatus = lastThread ? Number(lastThread.status) : null;


  //     // 1. Dynamic Status Filter
  //     if (
  //       this.selectedStatusFilter !== 'all' &&
  //       this.getTicketCurrentStatus(ticket).toLowerCase() !==
  //       this.selectedStatusFilter.toLowerCase()
  //     ) {
  //       return false;
  //     }

  //     // 2. District Filter
  //     if (
  //       this.selectedDistrictFilter !== 'all' &&
  //       (ticket.district || '').trim().toLowerCase() !==
  //       this.selectedDistrictFilter.toLowerCase()
  //     ) {
  //       return false;
  //     }

  //     // 3. Taluk Filter
  //     if (
  //       this.selectedTalukFilter !== 'all' &&
  //       (ticket.taluk || '').trim().toLowerCase() !==
  //       this.selectedTalukFilter.toLowerCase()
  //     ) {
  //       return false;
  //     }

  //     // 4. Issue Type (difficulty) Filter
  //     if (
  //       this.selectedIssueTypeFilter !== 'all' &&
  //       (ticket.difficulty || '').trim().toLowerCase() !==
  //       this.selectedIssueTypeFilter.toLowerCase()
  //     ) {
  //       return false;
  //     }

  //     // 5. Raiser Name Filter
  //     const raiser = (ticket.raiser_name || ticket.ticket_owner || '').trim().toLowerCase();
  //     if (
  //       this.selectedRaiserFilter !== 'all' &&
  //       raiser !== this.selectedRaiserFilter.toLowerCase()
  //     ) {
  //       return false;
  //     }
  //     if (fromStr || toStr) {
  //       const rawDate = ticket.threads?.[0]?.date || ticket.timestamp;
  //       const ticketDateStr = this.normalizeDateOnly(rawDate);

  //       if (!ticketDateStr) return false;
  //       if (fromStr && ticketDateStr < fromStr) return false;
  //       if (toStr && ticketDateStr > toStr) return false;
  //     }

  //     return true;
  //   });

  //   // 6. Safe cross-browser timestamp / ID sorting
  //   return [...filtered].sort((a, b) => {
  //     if (this.sortOrder === 'newest' || this.sortOrder === 'oldest') {
  //       const timeA = a.timestamp ? new Date(String(a.timestamp).replace(' ', 'T')).getTime() : 0;
  //       const timeB = b.timestamp ? new Date(String(b.timestamp).replace(' ', 'T')).getTime() : 0;
  //       return this.sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
  //     }
  //     if (this.sortOrder === 'id_desc') {
  //       return Number(b.id) - Number(a.id);
  //     }
  //     if (this.sortOrder === 'id_asc') {
  //       return Number(a.id) - Number(b.id);
  //     }
  //     return 0;
  //   });
  // }

  // async openSortOptions() {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Sort Tickets By',
  //     mode: 'ios',
  //     cssClass: 'custom-sort-sheet',
  //     buttons: [
  //       {
  //         text: 'Newest First',
  //         cssClass: this.sortOrder === 'newest' ? 'sort-option-selected' : '',
  //         handler: () => {
  //           this.sortOrder = 'newest';
  //           this.cdr.detectChanges();
  //         },
  //       },
  //       {
  //         text: 'Oldest First',
  //         cssClass: this.sortOrder === 'oldest' ? 'sort-option-selected' : '',
  //         handler: () => {
  //           this.sortOrder = 'oldest';
  //           this.cdr.detectChanges();
  //         },
  //       },
  //       {
  //         text: 'Ticket ID (High to Low)',
  //         cssClass: this.sortOrder === 'id_desc' ? 'sort-option-selected' : '',
  //         handler: () => {
  //           this.sortOrder = 'id_desc';
  //           this.cdr.detectChanges();
  //         },
  //       },
  //       {
  //         text: 'Ticket ID (Low to High)',
  //         cssClass: this.sortOrder === 'id_asc' ? 'sort-option-selected' : '',
  //         handler: () => {
  //           this.sortOrder = 'id_asc';
  //           this.cdr.detectChanges();
  //         },
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //       },
  //     ],
  //   });
  //   await actionSheet.present();
  // }

  // resetFilters() {
  //   this.selectedStatusFilter = 'all';
  //   this.selectedDistrictFilter = 'all';
  //   this.selectedTalukFilter = 'all';
  //   this.selectedIssueTypeFilter = 'all';
  //   this.selectedRaiserFilter = 'all';
  //   this.selectedFromDate = null;
  //   this.selectedToDate = null;
  // }






  get hasDistrictTabFilters(): boolean {
    return (
      this.selectedDistrictStation !== 'all' ||
      !!this.districtDateFrom ||
      !!this.districtDateTo
    );
  }

  get districtTabFilterCount(): number {
    let count = 0;
    if (this.selectedDistrictStation !== 'all') count++;
    if (this.districtDateFrom || this.districtDateTo) count++;
    return count;
  }

  // // Extract YYYY-MM-DD cleanly from any ISO datetime or DB string
  // private normalizeDateOnly(value: any): string | null {
  //   if (!value) return null;
  //   const str = String(value).trim();
  //   // If ISO string like "2026-10-28T14:30:00+05:30" or "2026-10-28 18:25:11"
  //   const isoMatch = str.match(/^(\d{4}-\d{2}-\d{2})/);
  //   if (isoMatch) return isoMatch[1];

  //   const parsed = moment(str, ['DD-MM-YYYY', 'YYYY/MM/DD', 'DD/MM/YYYY'], true);
  //   return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null;
  // }

  getDistrictStationOptions(): string[] {
    if (!Array.isArray(this.overall_tickets)) return [];
    const stations = this.overall_tickets
      .map((t) => (t.station_code ? String(t.station_code).trim() : ''))
      .filter((s) => s !== '');
    return Array.from(new Set(stations)).sort((a, b) => a.localeCompare(b));
  }

  getFilteredDistrictTickets(): any[] {
    if (!Array.isArray(this.overall_tickets)) return [];

    const fromStr = this.normalizeDateOnly(this.districtDateFrom);
    const toStr = this.normalizeDateOnly(this.districtDateTo);

    return this.overall_tickets.filter((ticket) => {
      // 1. Station-wise filter
      if (
        this.selectedDistrictStation !== 'all' &&
        (ticket.station_code || '').trim().toLowerCase() !==
        this.selectedDistrictStation.toLowerCase()
      ) {
        return false;
      }

      // 2. Date-wise filter (compares pure YYYY-MM-DD strings: "2026-10-28")
      // 2. Date-wise filter (excludes closed tickets and compares pure YYYY-MM-DD strings)
      if (fromStr || toStr) {
        const lastThread =
          Array.isArray(ticket.threads) && ticket.threads.length > 0
            ? ticket.threads[ticket.threads.length - 1]
            : null;
        if (Number(lastThread?.status) === 100) {
          return false;
        }

        const rawDate = ticket.threads?.[0]?.date || ticket.timestamp;
        const ticketDateStr = this.normalizeDateOnly(rawDate);

        if (!ticketDateStr) return false;
        if (fromStr && ticketDateStr < fromStr) return false;
        if (toStr && ticketDateStr > toStr) return false;
      }

      return true;
    });
  }

  // Triggered whenever Station, From Date, or To Date changes
  async onDistrictFilterChange() {
    this.filtering_district_tickets = true;
    this.cdr.detectChanges();

    // If a date/station filter is active and no matches are in the currently loaded page,
    // keep fetching remaining pages for this district until matches are found or data ends
    if (
      this.districtId &&
      this.hasDistrictTabFilters &&
      this.getFilteredDistrictTickets().length === 0 &&
      !this.no_more_data[4]
    ) {
      await this.fetchRemainingDistrictPages();
    }

    setTimeout(() => {
      this.filtering_district_tickets = false;
      this.cdr.detectChanges();
    }, 250);
  }

  private fetchRemainingDistrictPages(): Promise<void> {
    return new Promise((resolve) => {
      const fetchNext = () => {
        if (
          this.no_more_data[4] ||
          this.getFilteredDistrictTickets().length > 0
        ) {
          resolve();
          return;
        }

        const params = {
          d_id: this.districtId,
          page: this.current_page[4],
        };

        const req$ =
          this.role == 'ven_master'
            ? this.api.get_cw_tickets_districtwise_ven(params)
            : this.api.get_cw_tickets_districtwise(params);

        req$.subscribe({
          next: (data: any) => {
            if (!Array.isArray(data) || data.length === 0) {
              this.no_more_data[4] = true;
              this.current_page[4] = 0;
              resolve();
              return;
            }
            this.overall_tickets = this.overall_tickets.concat(data);
            this.current_page[4]++;
            fetchNext();
          },
          error: () => resolve(),
        });
      };

      fetchNext();
    });
  }

  clearDistrictDates() {
    this.districtDateFrom = null;
    this.districtDateTo = null;
    this.onDistrictFilterChange();
  }

  resetDistrictTabFilters() {
    this.selectedDistrictStation = 'all';
    this.districtDateFrom = null;
    this.districtDateTo = null;
    this.onDistrictFilterChange();
  }




  // // Call this when clicking the Filter button in the header
  // async openFilterModal() {
  //   this.filterModalOpen = true;

  //   // Fetch all remaining pages for the current tab so filter options & results include every page
  //   if (!this.isCurrentTabFullyLoaded()) {
  //     this.loading_filter_options = true;
  //     this.cdr.detectChanges();
  //     await this.fetchAllRemainingPagesForActiveTab();
  //     this.loading_filter_options = false;
  //     this.cdr.detectChanges();
  //   }
  // }

  private isCurrentTabFullyLoaded(): boolean {
    switch (this.tab) {
      case 'raised_tickets':
        return this.no_more_data[0];
      case 'assigned_tickets':
        return this.no_more_data[1];
      case 'unassigned_tickets':
        return this.no_more_data[2];
      case 'vendor_payment_tickets':
        return this.no_more_data[5];
      default:
        return true;
    }
  }

  private fetchAllRemainingPagesForActiveTab(): Promise<void> {
    return new Promise((resolve) => {
      const fetchNextPage = () => {
        if (this.isCurrentTabFullyLoaded()) {
          resolve();
          return;
        }

        if (this.tab === 'raised_tickets') {
          const params: any = { v_id: this.username, page: this.current_page[0] };
          if (this.role == '1') params.type = '0';
          if (this.raisedSearchTerm?.trim()) params.search = this.raisedSearchTerm.trim();

          this.api.get_cw_tickets_by_raiser_id(params).subscribe({
            next: (data: any) => {
              if (!Array.isArray(data) || data.length === 0) {
                this.no_more_data[0] = true;
                this.current_page[0] = 0;
                resolve();
                return;
              }
              this.raised_tickets = this.raised_tickets.concat(data);
              this.current_page[0]++;
              fetchNextPage();
            },
            error: () => resolve(),
          });
        } else if (this.tab === 'assigned_tickets') {
          const params: any = { r_id: this.username, page: this.current_page[1] };
          if (this.assignedSearchTerm?.trim()) params.search = this.assignedSearchTerm.trim();

          this.api.get_cw_tickets_by_resolver_id(params).subscribe({
            next: (data: any) => {
              if (!Array.isArray(data) || data.length === 0) {
                this.no_more_data[1] = true;
                this.current_page[1] = 0;
                resolve();
                return;
              }
              this.tickets = this.tickets.concat(data);
              this.current_page[1]++;
              fetchNextPage();
            },
            error: () => resolve(),
          });
        } else if (this.tab === 'unassigned_tickets') {
          const params: any = { role: this.role + '_unassigned', page: this.current_page[2] };
          if (this.unassignedSearchTerm?.trim()) params.search = this.unassignedSearchTerm.trim();

          this.api.get_cw_tickets_by_admin_role(params).subscribe({
            next: (data: any) => {
              if (!Array.isArray(data) || data.length === 0) {
                this.no_more_data[2] = true;
                this.current_page[2] = 0;
                resolve();
                return;
              }
              this.unassigned_tickets = this.unassigned_tickets.concat(data);
              this.current_page[2]++;
              fetchNextPage();
            },
            error: () => resolve(),
          });
        } else if (this.tab === 'vendor_payment_tickets') {
          const params: any = { page: this.current_page[5], r_id: this.username };
          if (this.paymentSearchTerm?.trim()) params.search = this.paymentSearchTerm.trim();

          this.api.get_payment_involved_tickets_by_raiser_id(params).subscribe({
            next: (data: any) => {
              if (!Array.isArray(data) || data.length === 0) {
                this.no_more_data[5] = true;
                this.current_page[5] = 0;
                resolve();
                return;
              }
              this.payment_tickets = this.payment_tickets.concat(data);
              this.current_page[5]++;
              fetchNextPage();
            },
            error: () => resolve(),
          });
        } else {
          resolve();
        }
      };

      fetchNextPage();
    });
  }

  // async openFilterDistrictSelector() {
  //   if (this.modalState) return;
  //   this.modalState = true;

  //   const modal = await this.modalCtrl.create({
  //     component: DistrictSelectorPage,
  //     cssClass: 'station-li-popup',
  //   });

  //   modal.onDidDismiss().then(async (dataReturned) => {
  //     this.modalState = false;
  //     const picked = dataReturned?.data?.district?.[0]?.district_name;
  //     if (picked) {
  //       this.selectedDistrictFilter = picked;
  //       this.selectedTalukFilter = 'all';

  //       // Ensure all pages are loaded so matches from later pages appear
  //       if (!this.isCurrentTabFullyLoaded()) {
  //         this.loading_filter_options = true;
  //         this.cdr.detectChanges();
  //         await this.fetchAllRemainingPagesForActiveTab();
  //         this.loading_filter_options = false;
  //         this.cdr.detectChanges();
  //       }
  //     }
  //   });

  //   await modal.present();
  // }



  // private prefetchRemainingPagesInBackground() {
  //   if (this.prefetching_pages || this.isCurrentTabFullyLoaded()) {
  //     return;
  //   }

  //   this.prefetching_pages = true;

  //   const fetchNextSilently = () => {
  //     if (this.isCurrentTabFullyLoaded()) {
  //       this.prefetching_pages = false;
  //       this.cdr.detectChanges();
  //       return;
  //     }

  //     if (this.tab === 'raised_tickets') {
  //       const params: any = { v_id: this.username, page: this.current_page[0] };
  //       if (this.role == '1') params.type = '0';
  //       if (this.raisedSearchTerm?.trim()) params.search = this.raisedSearchTerm.trim();

  //       this.api.get_cw_tickets_by_raiser_id(params).subscribe({
  //         next: (data: any) => {
  //           if (!Array.isArray(data) || data.length === 0) {
  //             this.no_more_data[0] = true;
  //             this.current_page[0] = 0;
  //             this.prefetching_pages = false;
  //             return;
  //           }
  //           this.raised_tickets = this.raised_tickets.concat(data);
  //           this.current_page[0]++;
  //           fetchNextSilently();
  //         },
  //         error: () => {
  //           this.prefetching_pages = false;
  //         },
  //       });
  //     } else if (this.tab === 'assigned_tickets') {
  //       const params: any = { r_id: this.username, page: this.current_page[1] };
  //       if (this.assignedSearchTerm?.trim()) params.search = this.assignedSearchTerm.trim();

  //       this.api.get_cw_tickets_by_resolver_id(params).subscribe({
  //         next: (data: any) => {
  //           if (!Array.isArray(data) || data.length === 0) {
  //             this.no_more_data[1] = true;
  //             this.current_page[1] = 0;
  //             this.prefetching_pages = false;
  //             return;
  //           }
  //           this.tickets = this.tickets.concat(data);
  //           this.current_page[1]++;
  //           fetchNextSilently();
  //         },
  //         error: () => {
  //           this.prefetching_pages = false;
  //         },
  //       });
  //     } else if (this.tab === 'unassigned_tickets') {
  //       const params: any = { role: this.role + '_unassigned', page: this.current_page[2] };
  //       if (this.unassignedSearchTerm?.trim()) params.search = this.unassignedSearchTerm.trim();

  //       this.api.get_cw_tickets_by_admin_role(params).subscribe({
  //         next: (data: any) => {
  //           if (!Array.isArray(data) || data.length === 0) {
  //             this.no_more_data[2] = true;
  //             this.current_page[2] = 0;
  //             this.prefetching_pages = false;
  //             return;
  //           }
  //           this.unassigned_tickets = this.unassigned_tickets.concat(data);
  //           this.current_page[2]++;
  //           fetchNextSilently();
  //         },
  //         error: () => {
  //           this.prefetching_pages = false;
  //         },
  //       });
  //     } else if (this.tab === 'vendor_payment_tickets') {
  //       const params: any = { page: this.current_page[5], r_id: this.username };
  //       if (this.paymentSearchTerm?.trim()) params.search = this.paymentSearchTerm.trim();

  //       this.api.get_payment_involved_tickets_by_raiser_id(params).subscribe({
  //         next: (data: any) => {
  //           if (!Array.isArray(data) || data.length === 0) {
  //             this.no_more_data[5] = true;
  //             this.current_page[5] = 0;
  //             this.prefetching_pages = false;
  //             return;
  //           }
  //           this.payment_tickets = this.payment_tickets.concat(data);
  //           this.current_page[5]++;
  //           fetchNextSilently();
  //         },
  //         error: () => {
  //           this.prefetching_pages = false;
  //         },
  //       });
  //     } else {
  //       this.prefetching_pages = false;
  //     }
  //   };

  //   fetchNextSilently();
  // }

  async openFilterDistrictSelector() {
    if (this.modalState) return;
    this.modalState = true;

    const modal = await this.modalCtrl.create({
      component: DistrictSelectorPage,
      cssClass: 'station-li-popup',
    });

    modal.onDidDismiss().then((dataReturned) => {
      this.modalState = false;
      const picked = dataReturned?.data?.district?.[0]?.district_name;
      if (picked) {
        this.selectedDistrictFilter = picked;
        this.selectedTalukFilter = 'all';
        this.prefetchRemainingPagesInBackground();
      }
    });

    await modal.present();
  }




  private stopActiveTabLoader() {
    if (this.tab === 'raised_tickets') this.loading_raised_tickets = false;
    else if (this.tab === 'assigned_tickets') this.loading_tickets = false;
    else if (this.tab === 'unassigned_tickets') this.loading_unassigned_tickets = false;
    else if (this.tab === 'vendor_payment_tickets') this.loading_payment_tickets = false;
  }







  get isTabDataLoading(): boolean {
    return (
      this.prefetching_pages ||
      (this.tab === 'raised_tickets' && this.loading_raised_tickets) ||
      (this.tab === 'assigned_tickets' && this.loading_tickets) ||
      (this.tab === 'unassigned_tickets' && this.loading_unassigned_tickets) ||
      (this.tab === 'vendor_payment_tickets' && this.loading_payment_tickets)
    );
  }

  openFilterModal() {
    this.filterModalOpen = true;
  }

  async openSortOptions() {
    if (this.isTabDataLoading) {
      this.authService.showToast('Please wait, tickets are still loading...');
      return;
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Sort Tickets By',
      mode: 'ios',
      cssClass: 'custom-sort-sheet',
      buttons: [
        {
          text: 'Newest First',
          cssClass: this.sortOrder === 'newest' ? 'sort-option-selected' : '',
          handler: () => {
            this.sortOrder = 'newest';
            this.cdr.detectChanges();
          },
        },
        {
          text: 'Oldest First',
          cssClass: this.sortOrder === 'oldest' ? 'sort-option-selected' : '',
          handler: () => {
            this.sortOrder = 'oldest';
            this.cdr.detectChanges();
          },
        },
        {
          text: 'Ticket ID (High to Low)',
          cssClass: this.sortOrder === 'id_desc' ? 'sort-option-selected' : '',
          handler: () => {
            this.sortOrder = 'id_desc';
            this.cdr.detectChanges();
          },
        },
        {
          text: 'Ticket ID (Low to High)',
          cssClass: this.sortOrder === 'id_asc' ? 'sort-option-selected' : '',
          handler: () => {
            this.sortOrder = 'id_asc';
            this.cdr.detectChanges();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  private prefetchRemainingPagesInBackground() {
    if (this.prefetching_pages || this.isCurrentTabFullyLoaded()) {
      return;
    }

    this.prefetching_pages = true;

    const fetchBatchParallel = () => {
      if (this.isCurrentTabFullyLoaded()) {
        this.prefetching_pages = false;
        this.cdr.detectChanges();
        return;
      }

      // Fetch 4 pages in parallel per batch (much faster than sequential 1-by-1)
      const batchPages = [0, 1, 2, 3];
      let pageIndex = 0;
      if (this.tab === 'raised_tickets') pageIndex = 0;
      else if (this.tab === 'assigned_tickets') pageIndex = 1;
      else if (this.tab === 'unassigned_tickets') pageIndex = 2;
      else if (this.tab === 'vendor_payment_tickets') pageIndex = 5;
      else {
        this.prefetching_pages = false;
        return;
      }

      const startPage = this.current_page[pageIndex];
      const requests = batchPages.map((offset) => {
        const pageNum = startPage + offset;
        if (this.tab === 'raised_tickets') {
          const params: any = { v_id: this.username, page: pageNum };
          if (this.role == '1') params.type = '0';
          if (this.raisedSearchTerm?.trim()) params.search = this.raisedSearchTerm.trim();
          return this.api.get_cw_tickets_by_raiser_id(params).pipe(catchError(() => of([])));
        } else if (this.tab === 'assigned_tickets') {
          const params: any = { r_id: this.username, page: pageNum };
          if (this.assignedSearchTerm?.trim()) params.search = this.assignedSearchTerm.trim();
          return this.api.get_cw_tickets_by_resolver_id(params).pipe(catchError(() => of([])));
        } else if (this.tab === 'unassigned_tickets') {
          const params: any = { role: this.role + '_unassigned', page: pageNum };
          if (this.unassignedSearchTerm?.trim()) params.search = this.unassignedSearchTerm.trim();
          return this.api.get_cw_tickets_by_admin_role(params).pipe(catchError(() => of([])));
        } else {
          const params: any = { page: pageNum, r_id: this.username };
          if (this.paymentSearchTerm?.trim()) params.search = this.paymentSearchTerm.trim();
          return this.api.get_payment_involved_tickets_by_raiser_id(params).pipe(catchError(() => of([])));
        }
      });

      forkJoin(requests).subscribe((results: any[]) => {
        let reachedEnd = false;
        let combined: any[] = [];

        for (const pageData of results) {
          if (!Array.isArray(pageData) || pageData.length === 0) {
            reachedEnd = true;
            break;
          }
          combined = combined.concat(pageData);
        }

        if (combined.length > 0) {
          if (this.tab === 'raised_tickets') this.raised_tickets = this.raised_tickets.concat(combined);
          else if (this.tab === 'assigned_tickets') this.tickets = this.tickets.concat(combined);
          else if (this.tab === 'unassigned_tickets') this.unassigned_tickets = this.unassigned_tickets.concat(combined);
          else if (this.tab === 'vendor_payment_tickets') this.payment_tickets = this.payment_tickets.concat(combined);
        }

        if (reachedEnd) {
          this.no_more_data[pageIndex] = true;
          this.current_page[pageIndex] = 0;
          this.prefetching_pages = false;
          this.cdr.detectChanges();
        } else {
          this.current_page[pageIndex] = startPage + batchPages.length;
          this.cdr.detectChanges();
          fetchBatchParallel();
        }
      });
    };

    fetchBatchParallel();
  }





  onMainFromDateChange(ev: any) {
    const val = ev?.detail?.value;
    const picked = Array.isArray(val) ? val[0] : val;
    if (picked) {
      this.selectedFromDate = String(picked).split('T')[0];
    }
    this.onMainTabDateChange();
  }

  onMainToDateChange(ev: any) {
    const val = ev?.detail?.value;
    const picked = Array.isArray(val) ? val[0] : val;
    if (picked) {
      this.selectedToDate = String(picked).split('T')[0];
    }
    this.onMainTabDateChange();
  }

  onMainTabDateChange() {
    if (!this.isCurrentTabFullyLoaded()) {
      this.prefetchRemainingPagesInBackground();
    }
    this.cdr.detectChanges();
  }

  get hasActiveFilters(): boolean {
    return (
      this.selectedDistrictFilter !== 'all' ||
      this.selectedTalukFilter !== 'all' ||
      this.selectedIssueTypeFilter !== 'all' ||
      this.selectedRaiserFilter !== 'all' ||
      !!this.selectedFromDate ||
      !!this.selectedToDate
    );
  }

  get activeFilterCount(): number {
    let count = 0;
    if (this.selectedDistrictFilter !== 'all') count++;
    if (this.selectedTalukFilter !== 'all') count++;
    if (this.selectedIssueTypeFilter !== 'all') count++;
    if (this.selectedRaiserFilter !== 'all') count++;
    if (this.selectedFromDate || this.selectedToDate) count++;
    return count;
  }

  getProcessedTickets(sourceList: any[]): any[] {
    if (!Array.isArray(sourceList)) return [];

    const fromStr = this.normalizeDateOnly(this.selectedFromDate);
    const toStr = this.normalizeDateOnly(this.selectedToDate);

    const filtered = sourceList.filter((ticket) => {
      // 1. District Filter
      if (
        this.selectedDistrictFilter !== 'all' &&
        (ticket.district || '').trim().toLowerCase() !==
        this.selectedDistrictFilter.toLowerCase()
      ) {
        return false;
      }

      // 2. Taluk Filter
      if (
        this.selectedTalukFilter !== 'all' &&
        (ticket.taluk || '').trim().toLowerCase() !==
        this.selectedTalukFilter.toLowerCase()
      ) {
        return false;
      }

      // 3. Issue Type (difficulty) Filter
      if (
        this.selectedIssueTypeFilter !== 'all' &&
        (ticket.difficulty || '').trim().toLowerCase() !==
        this.selectedIssueTypeFilter.toLowerCase()
      ) {
        return false;
      }

      // 4. Raiser Name Filter
      const raiser = (ticket.raiser_name || ticket.ticket_owner || '').trim().toLowerCase();
      if (
        this.selectedRaiserFilter !== 'all' &&
        raiser !== this.selectedRaiserFilter.toLowerCase()
      ) {
        return false;
      }

      // 5. Date-wise Filter (Matches Ticket Raised date only & excludes closed tickets)
      if (fromStr || toStr) {
        const threads = Array.isArray(ticket.threads) ? ticket.threads : [];
        const lastThread = threads.length > 0 ? threads[threads.length - 1] : null;
        if (Number(lastThread?.status) === 100 || Number(ticket.ticket_status) === 100) {
          return false;
        }

        const raisedThread =
          threads.find((th: any) => Number(th?.status) === 0) || threads[0];

        const raisedDateStr = this.normalizeDateOnly(raisedThread?.date || ticket.timestamp);

        if (!raisedDateStr) return false;
        if (fromStr && raisedDateStr < fromStr) return false;
        if (toStr && raisedDateStr > toStr) return false;
      }

      return true;
    });

    // 6. Safe cross-browser timestamp / ID sorting
    return [...filtered].sort((a, b) => {
      if (this.sortOrder === 'newest' || this.sortOrder === 'oldest') {
        const timeA =
          fromStr || toStr
            ? this.getTicketRaisedTime(a)
            : a.timestamp
              ? new Date(String(a.timestamp).replace(' ', 'T')).getTime()
              : this.getTicketRaisedTime(a);

        const timeB =
          fromStr || toStr
            ? this.getTicketRaisedTime(b)
            : b.timestamp
              ? new Date(String(b.timestamp).replace(' ', 'T')).getTime()
              : this.getTicketRaisedTime(b);

        return this.sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      }
      if (this.sortOrder === 'id_desc') {
        return Number(b.id) - Number(a.id);
      }
      if (this.sortOrder === 'id_asc') {
        return Number(a.id) - Number(b.id);
      }
      return 0;
    });
  }

  resetFilters() {
    this.selectedDistrictFilter = 'all';
    this.selectedTalukFilter = 'all';
    this.selectedIssueTypeFilter = 'all';
    this.selectedRaiserFilter = 'all';
    this.selectedFromDate = null;
    this.selectedToDate = null;
    this.cdr.detectChanges();
  }

  private normalizeDateOnly(value: any): string | null {
    if (!value) return null;
    if (Array.isArray(value)) value = value[0];
    const str = String(value).trim();
    if (!str) return null;

    // Matches "2026-10-13", "2026-10-13T17:17:00+05:30", or "2026-10-13 17:17:00"
    const isoMatch = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (isoMatch) {
      return `${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}-${isoMatch[3].padStart(2, '0')}`;
    }

    // Matches "13-10-2026" or "13/10/2026"
    const dmyMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (dmyMatch) {
      return `${dmyMatch[3]}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}`;
    }

    const parsed = moment(str);
    return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null;
  }
  get isInfiniteScrollDisabled(): boolean {
    const hasMainDateFilter = !!this.selectedFromDate || !!this.selectedToDate;
    if (hasMainDateFilter) {
      return true;
    }

    switch (this.tab) {
      case 'raised_tickets':
        return this.no_more_data[0] || this.loading_raised_tickets;
      case 'assigned_tickets':
        return this.no_more_data[1] || this.loading_tickets;
      case 'unassigned_tickets':
        return this.no_more_data[2] || this.loading_unassigned_tickets;
      case 'others':
        return this.no_more_data[2] || this.loading_all_tickets;
      case 'vendor_payment_tickets':
        return this.no_more_data[5] || this.loading_payment_tickets;
      case 'others_admin':
        if (this.tab2 === 'district') {
          const hasDistrictDateFilter = !!this.districtDateFrom || !!this.districtDateTo;
          return hasDistrictDateFilter || this.no_more_data[4] || this.loading_overall_tickets;
        }
        return this.no_more_data[3] || this.loading_hq_tickets;
      default:
        return true;
    }
  }

  loadMore(event) {
    const hasMainDateFilter = !!this.selectedFromDate || !!this.selectedToDate;
    if (hasMainDateFilter) {
      this.clearEvent(event);
      return;
    }

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
          const hasDistrictDateFilter = !!this.districtDateFrom || !!this.districtDateTo;
          if (this.districtId && !hasDistrictDateFilter) {
            this.getOverallTickets(event, this.districtId);
          } else {
            this.clearEvent(event);
          }
        } else {
          this.getAdminAllTickets(event);
        }
        return;
    }
  }

  private getTicketRaisedTime(ticket: any): number {
    const threads = Array.isArray(ticket.threads) ? ticket.threads : [];
    const raisedThread =
      threads.find((th: any) => Number(th?.status) === 0) || threads[0];

    if (raisedThread?.date) {
      const datePart = this.normalizeDateOnly(raisedThread.date);
      const timePart = raisedThread.time ? String(raisedThread.time).trim() : '00:00:00';
      if (datePart) {
        const parsed = new Date(`${datePart}T${timePart}`).getTime();
        if (!isNaN(parsed)) return parsed;
      }
    }

    return ticket.timestamp
      ? new Date(String(ticket.timestamp).replace(' ', 'T')).getTime()
      : 0;
  }
}
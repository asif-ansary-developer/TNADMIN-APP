var _router;
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/providers/api.service';
import { DistrictSelectorPage } from '../district-selector/district-selector.page';
import * as moment from 'moment';
import { AuthService } from 'src/app/guard/auth.service';
import { HttpClient } from '@angular/common/http';
import { RefreshHelperService } from 'src/app/helper/refresh-helper.service';
import { NgModel } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
  selector: 'app-view-tickets-ven-master',
  templateUrl: './view-tickets-ven-master.page.html',
  styleUrls: ['./view-tickets-ven-master.page.scss'],
})
export class ViewTicketsVenMasterPage implements OnInit {
  @ViewChild('distCtrl') distCtrl!: NgModel;
  role;
  username;
  rr;
  districtId;
  districtName;
  modalState = false;
  public all_tickets: any = [];
  public overall_tickets: any = [];
  public search_tickets: any = [];
  loading_all_tickets = true;
  loading_search_tickets = false;
  loading_overall_tickets = false;
  no_more_data = [false, false, false];
  tab = 'all';
  current_page = [1, 1, 1];
  filterFabActive = false;

  all_tickets_filter = 'all';
  all_tickets_request_state = false;
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

    this._moment = moment;
  }

  ngOnDestroy() {
    // _router.unsubscribe();

    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  cdrRefresh() {
    this.cdr.detectChanges();
  }
  openTicketResolverAction(ticketId) {
    this.router.navigateByUrl('ticket-system/ticket-resolver-action', {
      state: { ticket_id: ticketId, unassigned: true },
    });
  }

  ionViewDidEnter() {
    if (this.reload) this.display();
  }

  doRefresh(event) {
    this.display();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }
  display() {
    this.loading_all_tickets = true;
    this.loading_overall_tickets = true;
    this.loading_search_tickets = false;
    this.all_tickets = [];
    this.overall_tickets = [];
    this.search_tickets = [];
    this.no_more_data = [false, false, false];
    this.current_page = [1, 1, 1, 1, 1, 1];

    this.loadMore(null);
  }

  ngOnInit() {}

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

  getAllTickets(event) {
    const timer = setInterval(() => {
      if (this.all_tickets_request_state == false) {
        this.all_tickets_request_state = true;
        if (this.no_more_data[0]) {
          console.log('no more data');
          this.all_tickets_request_state = false;
          this.clearEvent(event);
          clearInterval(timer);
          return;
        }
        var params;
        if (this.all_tickets_filter == 'all')
          params = {
            page: this.current_page[0],
          };
        else if (this.all_tickets_filter == 'open')
          params = {
            page: this.current_page[0],
            status: '1',
          };
        else if (this.all_tickets_filter == 'closed')
          params = {
            page: this.current_page[0],
            status: '0',
          };

        console.log(params);

        this.api.get_all_cw_tickets_by_vendors(params).subscribe(
          (data: any) => {
            if (data.length === 0 && !this.loading_all_tickets) {
              this.no_more_data[0] = true;
              this.current_page[0] = 0;
              this.all_tickets_request_state = false;
              this.clearEvent(event);
              clearInterval(timer);
              return;
            }
            this.all_tickets = this.all_tickets.concat(data);
            this.loading_all_tickets = false;
            console.log('all tickets are..', this.all_tickets);
            this.current_page[0]++;
            this.all_tickets_request_state = false;
            this.clearEvent(event);
          },
          (error) => {
            this.all_tickets_request_state = false;
          }
        );
      }
      clearInterval(timer);
    });
  }

  getOverallTickets(event, dis_id) {
    if (this.no_more_data[1]) {
      this.clearEvent(event);
      return;
    }
    let params = {
      d_id: dis_id,
      page: this.current_page[1],
    };
    console.log(params);

    this.api.get_cw_tickets_districtwise_ven(params).subscribe((data: any) => {
      if (data.length == 0 && !this.loading_overall_tickets) {
        this.no_more_data[1] = true;
        this.current_page[1] = 0;
        this.loading_overall_tickets = false;
        this.clearEvent(event);
        return;
      }

      this.overall_tickets = this.overall_tickets.concat(data);
      this.loading_overall_tickets = false;
      console.log('overall tickets are..', this.overall_tickets);
      this.current_page[1]++;
      this.clearEvent(event);
    });
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
      this.no_more_data[1] = false;
      this.current_page[1] = 1;

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

              this.getOverallTickets(null, this.districtId);
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

  resetSearch() {
    this.searchTerm = null;
    // this.getOverallTickets(null, this.districtId);
    this.search_tickets = [];
    this.loading_search_tickets = false;
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

  fetchSearchResults(keyword: string) {
    if (keyword) {
      var param;
      param = {
        t_id: 'cwt' + keyword,
        d_id: this.districtId,
        role: this.role,
      };
      this.loading_search_tickets = true;
      this.api.get_cw_tickets_by_id_search(param).subscribe(
        (data) => {
          if (this.searchTerm && this.searchTerm.trim() != '') {
            this.search_tickets = data;
            this.loading_search_tickets = false;
          }
        },
        (error) => {
          console.error('Error fetching search results', error);
        }
      );
    } else {
      // this.authService.showToast('Please select a District');
    }
  }

  loadMore(event) {
    console.log('Current tab - ', this.tab);
    switch (this.tab) {
      case 'all':
        this.getAllTickets(event);
        return;
      case 'district':
        this.getOverallTickets(event, this.districtId);
        return;
      case 'search':
        // this.fetchSearchResults(this.searchTerm);
        return;
    }
  }

  allTicketsFilterClick(filter) {
    this.filterFabActive = false;
    console.log(this.all_tickets_request_state);
    const timer = setInterval(() => {
      if (!this.all_tickets_request_state) {
        this.all_tickets_filter = filter;
        this.no_more_data[0] = false;
        this.current_page[0] = 1;
        this.all_tickets = [];
        this.getAllTickets(null);
        clearInterval(timer);
      }
    });

    setTimeout(() => {}, 100);
  }
  tabHandler() {
    switch (this.tab) {
      case 'all':
        this.getAllTickets(null);
        return;
      case 'district':
        this.getOverallTickets(null, this.districtId);
        return;
      case 'search':
        if (this.search_tickets?.length == 0)
          this.fetchSearchResults(this.searchTerm);
        return;
    }
  }
}

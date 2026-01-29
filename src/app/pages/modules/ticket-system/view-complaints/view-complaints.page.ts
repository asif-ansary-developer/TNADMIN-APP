import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/guard/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { DistrictSelectorPage } from '../district-selector/district-selector.page';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-view-complaints',
  templateUrl: './view-complaints.page.html',
  styleUrls: ['./view-complaints.page.scss'],
})
export class ViewComplaintsPage implements OnInit {
  role;
  username;
  districtId;
  districtName;
  modalState = false;
  detail_modal_state = false;
  preview_modal_state = false;
  loading_complaints = true;
  public complaints_data: any = [];
  public selected_complaint;
  current_page = [1];
  no_more_data = [false];
  _moment;
  preview_img = null;
  @ViewChild('stationCtrl') stationCtrl!: NgModel;

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private modalCtrl: ModalController
  ) {
    this.role = localStorage.getItem('role');
    this.username = localStorage.getItem('username');
    this._moment = moment;
  }

  ngOnInit() {}
  ionViewDidEnter() {
    this.display();
  }

  doRefresh(event) {
    this.display();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  display() {
    this.loading_complaints = true;
    this.complaints_data = [];
    this.no_more_data = [false];
    this.current_page = [1];
    this.loadMore(null);
  }

  loadMore(event) {
    this.getAllComplaints(event);
  }

  getAllComplaints(event, district = null) {
    if (this.no_more_data[0]) {
      this.clearEvent(event);
      return;
    }

    var params;
    params = {
      u_id: this.username,
      page: this.current_page[0],
      d_id: this.districtId,
    };

    this.api.get_arg_complaints(params).subscribe((data: any) => {
      if (data.length === 0 && !this.loading_complaints) {
        this.no_more_data[0] = true;
        this.current_page[0] = 0;

        this.clearEvent(event);
        return;
      }

      this.complaints_data = this.complaints_data.concat(data);
      this.loading_complaints = false;
      console.log('complaints are..', this.complaints_data);
      this.current_page[0]++;
      this.clearEvent(event);
    });
  }

  clearEvent(event) {
    if (event) event.target.complete();
  }

  async presentDistrictSelector() {
    if (!this.modalState) {
      this.modalState = true;
      const modal = await this.modalCtrl.create({
        component: DistrictSelectorPage,
        cssClass: 'station-li-popup',
      });

      this.loading_complaints = true;
      this.complaints_data = [];
      this.no_more_data[0] = false;
      this.current_page[0] = 1;

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

              this.loading_complaints = true;
              this.complaints_data = [];
              if (!this.searchTerm)
                this.getAllComplaints(null, this.districtId);
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
    this.districtName = null;
    this.districtId = null;
    this.stationCtrl.control.setErrors(null);
    this.stationCtrl.control.markAsPristine();
    this.stationCtrl.control.markAsUntouched();
    this.stationCtrl.control.updateValueAndValidity();

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
    this.getAllComplaints(null, this.districtId);
  }

  fetchSearchResults(keyword: string) {
    if (keyword) {
      var param;
      param = {
        c_id: 'cwt' + keyword,
        d_id: this.districtId,
        role: this.role,
      };

      this.api.get_arg_complaints_by_search(param).subscribe(
        (data) => {
          console.log(data);
          if (this.searchTerm && this.searchTerm.trim() != '') {
            this.complaints_data = data;
            this.loading_complaints = false;
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

  viewComplaint(comp, index) {
    this.selected_complaint = comp;
    this.detail_modal_state = true;
    console.log('selected complaint', this.selected_complaint);
    this.complaints_data[index]['view_status'] = 1;
    this.api
      .update_arg_complaints_view_status({
        c_id: this.selected_complaint['c_id'],
        status: '1',
      })
      .subscribe((data) => {
        console.log(data);
      });
  }

  handleModalDismiss(e, modal) {
    if (modal == 'district') {
      if (this.detail_modal_state) {
        this.detail_modal_state = false;
      }
    } else {
      if (this.preview_modal_state) {
        this.preview_modal_state = false;
        this.preview_img = null;
      }
    }
  }
  previewImg(img) {
    this.preview_img = img;
    this.preview_modal_state = true;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import {
  ModalController,
  NavController,
  LoadingController,
} from '@ionic/angular';
import { take } from 'rxjs';
import { AuthService } from 'src/app/guard/auth.service';
import { ApiService } from 'src/app/providers/api.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.page.html',
  styleUrls: ['./preview.page.scss'],
})
export class PreviewPage implements OnInit {
  @Input() preview_data: any;
  preview_data2: any = {
    username: 'desk_111',
    user_id: 'desk_111',
    latitude: 13.004218,
    longitude: 80.201461,
    dept_id: '11',
    source_id: 'S2',
    owner_name: ' cN',
    incharge_name: 'inc',
    district_id: '2',
    taluk_id: '15',
    firka_id: '66',
    village_id: '866',
    mobile_no: '9999899998',
    alternate_no: '9999899992',
    landline_no: '9999899991',
    door_no: '26',
    street_name: 'alandur metro',
    area_locality: 'chennai',
    landmark: 'alandur metro',
    pincode: 600001,
    functional_status: 'Yes',
    equipment_list: [
      {
        name: 'Electric Drill',
        nos: 11,
        code: '104',
      },
      {
        name: 'JCB',
        nos: 1,
        code: '145',
      },
    ],
  };
  constructor(
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private api: ApiService,
    private authService: AuthService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    console.log(this.preview_data);
    // this.preview_data = this.preview_data2;
    // this.preview_data = this.preview_data2;
  }
  closeModal() {
    this.modalCtrl.dismiss();
  }

  submit() {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        cssClass: 'loading-backdrop',
        mode: 'ios',
      })
      .then((loadingEl) => {
        loadingEl.present();
        var params = JSON.stringify({
          username: localStorage.getItem('username'),
          latitude: this.preview_data['latitude'],
          longitude: this.preview_data['longitude'],
          dept_id: this.preview_data['department'],
          source_id: this.preview_data['source'],
          owner_name: this.preview_data['entity'],
          incharge_name: this.preview_data['incharge'],
          district_id: this.preview_data['district_id'],
          taluk_id: this.preview_data['taluk_id'],
          firka_id: this.preview_data['firka_id'],
          village_id: this.preview_data['village_id'],
          functional_status: this.preview_data['functional_status'],
          mobile_no: this.preview_data['incharge_no'],
          alternate_no: this.preview_data['alternate_no'],
          landline_no: this.preview_data['landline'],
          door_no: this.preview_data['plot'],
          street_name: this.preview_data['street'],
          area_locality: this.preview_data['city'],
          landmark: this.preview_data['landmark'],
          pincode: this.preview_data['pincode'],
          equipment_list: this.preview_data['equipment_list'],
        });

        console.log(params);
        this.api
          .post_inventory(params)
          .pipe(take(1))
          .subscribe(
            (data) => {
              console.log(data);
              loadingEl.dismiss();
              if (data['error'] != undefined) {
                this.authService.showAlert('Oops!', data['error']);
              } else {
                this.authService.showAlert(data['title'], data['msg']);
                this.navCtrl.navigateBack('home').then(() => this.closeModal());
              }
            },
            (err) => {
              console.log('ERROR!: ', err);
              console.log('ERROR!: ', JSON.stringify(err));
              loadingEl.dismiss();
              this.authService.showAlert('Failed!', 'Try again');
            }
          );
      });

    // this.navCtrl.navigateBack('home').then(() => this.closeModal());
  }
}

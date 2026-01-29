import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/guard/auth.service';

@Component({
  selector: 'app-raingauge',
  templateUrl: './raingauge.page.html',
  styleUrls: ['./raingauge.page.scss'],
})
export class RaingaugePage implements OnInit {
  _role;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService
  ) {
    this._role = localStorage.getItem('role');
  }

  ngOnInit() {}
  route(url) {
    this.navCtrl.navigateForward(url);
  }
  back() {
    this.navCtrl.navigateBack('/home');
  }
}

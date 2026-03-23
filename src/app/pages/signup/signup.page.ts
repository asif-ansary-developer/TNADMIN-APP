import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {

  form: any = {};

  states: any[] = [];
  districts: any[] = [];
  departments: any[] = [];
  roles: any[] = [];

  constructor(private navCtrl: NavController) {
    this.loadStates();
  }

  // Load states
  loadStates() {

    this.states = [
      { id: 1, name: 'Tamil Nadu' },
      { id: 2, name: 'Kerala' }
    ];

  }

  // Load districts
  loadDistricts() {

    if (this.form.state == 1) {
      this.districts = [
        { id: 1, name: 'Chennai' },
        { id: 2, name: 'Madurai' }
      ];
    }

  }

  // Load departments
  loadDepartments() {

    this.departments = [
      { id: 1, name: 'Revenue' },
      { id: 2, name: 'Municipality' }
    ];

  }

  // Load roles
  loadRoles() {

    this.roles = [
      { id: 1, name: 'Admin' },
      { id: 2, name: 'Officer' },
      { id: 3, name: 'Staff' }
    ];

  }

  signup() {

    console.log("Form Data", this.form);

  }

  goToLogin() {
    this.navCtrl.navigateBack('/login');
  }

}
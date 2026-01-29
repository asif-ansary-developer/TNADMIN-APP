import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { AuthService } from 'src/app/guard/auth.service';
import { ApiService } from 'src/app/providers/api.service';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.page.html',
  styleUrls: ['./add-inventory.page.scss'],
})
export class AddInventoryPage implements OnInit {
  lang;
  department;
  source;
  entity;
  incharge;
  incharge_number;
  alternate_number;
  landline_number;
  functional_status;

  district_id;
  taluk_id;
  firka_id;
  village_id;
  // equipment_list: { name: string; quantity: number }[] = [];
  equipment_list: { name: string; nos: number }[] = [{ name: '', nos: 0 }];

  public districts_data: any = [];
  public taluks_data: any = [];
  public firkas_data: any = [];
  public villages_data: any = [];
  public department_data: any = [];
  public source_data: any = [];

  constructor(private api: ApiService, private auth: AuthService) {
    this.lang = localStorage.getItem('language');
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.getDepartments();
    this.getSources();
    this.getDistricts();
  }

  getDepartments() {
    this.api
      .get_inventory_departments()
      .pipe(take(1))
      .subscribe((data) => {
        this.department_data = data;
        console.log('department data..', this.department_data);
      });
  }

  getSources() {
    this.api
      .get_inventory_sources()
      .pipe(take(1))
      .subscribe((data) => {
        this.source_data = data;
        console.log('sources data..', this.source_data);
      });
  }

  getDistricts() {
    this.api
      .get_master_districts()
      .pipe(take(1))
      .subscribe((data) => {
        this.districts_data = data;
        console.log('district data..', this.districts_data);
      });
  }

  getTaluks() {
    console.log('dis id', this.district_id);
    this.taluks_data = [];
    this.taluk_id = null;
    this.api
      .get_master_taluks_by_district_id({ id: this.district_id })
      .pipe(take(1))
      .subscribe((data) => {
        this.taluks_data = data;
        console.log('taluk data..', this.taluks_data);
      });
  }

  getFirkas() {
    console.log('taluk id', this.taluk_id);
    this.firkas_data = [];
    this.firka_id = null;

    this.api
      .get_master_firkas_by_taluk_id({ id: this.taluk_id })
      .pipe(take(1))
      .subscribe((data) => {
        this.firkas_data = data;
        console.log('firka data..', this.firkas_data);
      });
  }

  getVillages() {
    console.log('firk id', this.firka_id);
    this.villages_data = [];
    this.village_id = null;

    this.api
      .get_master_villages_by_firka_id({ id: this.firka_id })
      .pipe(take(1))
      .subscribe((data) => {
        this.villages_data = data;
        console.log('village data..', this.villages_data);
      });
  }

  addEquipment() {
    // console.log('equip list',this.equipment_list);
    if (
      this.equipment_list[this.equipment_list.length - 1]['name'] == '' ||
      this.equipment_list[this.equipment_list.length - 1]['nos'] == 0
    ) {
      this.auth.showToast('Fill the empty equipment entry!');
    } else {
      this.equipment_list.push({ name: '', nos: 0 });
    }
  }

  removeEquipment(index) {
    if (this.equipment_list.length == 1) {
      this.equipment_list = [{ name: '', nos: 0 }];
      this.auth.showToast('No entries to remove!');
    } else {
      this.equipment_list.splice(index, 1);
    }
  }
}

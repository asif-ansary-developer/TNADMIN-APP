import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-relief-camp',
  templateUrl: './relief-camp.page.html',
  styleUrls: ['../bridges/bridges.page.scss'],
})
export class ReliefCampPage implements OnInit {
  taluks_data = [];
  districts_data = [];
  firkas_data = [];
  source_data = [];
  villages_data = [];

  taluk_id;
  department_data = [];
  department;
  district_id;
  village_id;
  entity;
  firka_id;
  functional_status;
  equipment_list = [];
  lang;
  source;
  constructor() {}

  ngOnInit() {}

  getVillages() {}
  getFirkas() {}
  getTaluks() {}

  removeEquipment(i) {}
  addEquipment() {}
}

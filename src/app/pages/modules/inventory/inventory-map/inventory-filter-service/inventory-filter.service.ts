import { Injectable } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
import { ApiService } from 'src/app/providers/api.service';

@Injectable({
  providedIn: 'root',
})
export class InventoryFilterService {
  selectedSources: any[] = [];
  selectedEquipments: any[] = [];

  inventory_source: any = [];
  inventory_departments: any = [];
  equipment_data: any = [];

  constructor(private api: ApiService) {}

  setFilters(sources: any[], equipments: any[]) {
    this.selectedSources = sources;
    this.selectedEquipments = equipments;
  }

  getFilters() {
    return {
      sources: this.inventory_source.filter((item) => item.selected),
      equipments: this.equipment_data.filter((item) => item.selected),
    };
  }

  ResetFilters() {
    this.inventory_source.forEach((item) => (item.selected = false));
    this.equipment_data.forEach((item) => (item.selected = false));
  }

  getDepartments() {
    this.api
      .get_inventory_departments()
      .pipe(take(1))
      .subscribe((data) => {
        this.inventory_departments = data;
        console.log('department data..', this.inventory_departments);
      });
  }

  getSources(): any {
    if (this.inventory_source.length == 0)
      this.api
        .get_inventory_sources()
        .pipe(take(1))
        .subscribe((data) => {
          this.inventory_source = data;
          console.log('source data..', this.inventory_source);
        });
  }

  getEquipments(): any {
    if (this.equipment_data.length == 0)
      this.api
        .get_equipment_list()
        .pipe(take(1))
        .subscribe((data) => {
          this.equipment_data = data;
          console.log('equipment data..', this.equipment_data);
        });
  }
}

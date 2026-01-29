import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { take } from 'rxjs';
import { ApiService } from 'src/app/providers/api.service';
import { InventoryFilterService } from '../inventory-filter-service/inventory-filter.service';

@Component({
  selector: 'app-inventory-filter',
  templateUrl: './inventory-filter.page.html',
  styleUrls: ['./inventory-filter.page.scss'],
})
export class InventoryFilterPage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private api: ApiService,
    public filterService: InventoryFilterService,
    private cdr: ChangeDetectorRef
  ) {
    this.filterService.getSources();
    this.filterService.getEquipments();

    this.markSelectedFromApplied(this.filterService.inventory_source);
    this.markSelectedFromApplied(this.filterService.equipment_data);
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.init();
  }

  init() {
    this.cdr.detectChanges();
  }

  back() {
    this.navCtrl.back();
  }

  applyFilters() {
    this.markAppliedFromSelected(this.filterService.inventory_source);
    this.markAppliedFromSelected(this.filterService.equipment_data);

    const selectedSources = this.filterService.inventory_source;
    const selectedEquipments = this.filterService.equipment_data;

    this.filterService.setFilters(selectedSources, selectedEquipments);
    this.navCtrl.back();
  }

  ResetFilters() {
    this.filterService.ResetFilters();
    console.log('reset');
    this.init();
  }

  private markSelectedFromApplied(data: any[]) {
    data.forEach((item) => (item.selected = !!item.applied));
  }

  private markAppliedFromSelected(data: any[]) {
    data.forEach((item) => (item.applied = !!item.selected));
  }
}

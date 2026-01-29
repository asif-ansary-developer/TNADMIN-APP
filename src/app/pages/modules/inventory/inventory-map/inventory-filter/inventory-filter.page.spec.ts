import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryFilterPage } from './inventory-filter.page';

describe('InventoryFilterPage', () => {
  let component: InventoryFilterPage;
  let fixture: ComponentFixture<InventoryFilterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

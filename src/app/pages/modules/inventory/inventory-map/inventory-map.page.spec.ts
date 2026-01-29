import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryMapPage } from './inventory-map.page';

describe('InventoryMapPage', () => {
  let component: InventoryMapPage;
  let fixture: ComponentFixture<InventoryMapPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

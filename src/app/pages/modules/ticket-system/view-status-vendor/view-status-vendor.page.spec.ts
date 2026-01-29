import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewStatusVendorPage } from './view-status-vendor.page';

describe('ViewStatusVendorPage', () => {
  let component: ViewStatusVendorPage;
  let fixture: ComponentFixture<ViewStatusVendorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStatusVendorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

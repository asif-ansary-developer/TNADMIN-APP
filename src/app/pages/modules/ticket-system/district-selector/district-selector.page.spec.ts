import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DistrictSelectorPage } from './district-selector.page';

describe('DistrictSelectorPage', () => {
  let component: DistrictSelectorPage;
  let fixture: ComponentFixture<DistrictSelectorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

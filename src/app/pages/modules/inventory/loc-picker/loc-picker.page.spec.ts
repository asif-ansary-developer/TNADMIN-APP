import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocPickerPage } from './loc-picker.page';

describe('LocPickerPage', () => {
  let component: LocPickerPage;
  let fixture: ComponentFixture<LocPickerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocPickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

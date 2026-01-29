import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResolutionAlertPage } from './resolution-alert.page';

describe('ResolutionAlertPage', () => {
  let component: ResolutionAlertPage;
  let fixture: ComponentFixture<ResolutionAlertPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolutionAlertPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

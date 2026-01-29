import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaingaugePage } from './raingauge.page';

describe('RaingaugePage', () => {
  let component: RaingaugePage;
  let fixture: ComponentFixture<RaingaugePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RaingaugePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

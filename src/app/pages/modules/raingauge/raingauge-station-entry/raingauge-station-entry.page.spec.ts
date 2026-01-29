import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaingaugeStationEntryPage } from './raingauge-station-entry.page';

describe('RaingaugeStationEntryPage', () => {
  let component: RaingaugeStationEntryPage;
  let fixture: ComponentFixture<RaingaugeStationEntryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RaingaugeStationEntryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

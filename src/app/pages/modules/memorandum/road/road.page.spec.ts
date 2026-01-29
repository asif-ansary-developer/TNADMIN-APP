import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoadPage } from './road.page';

describe('RoadPage', () => {
  let component: RoadPage;
  let fixture: ComponentFixture<RoadPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RoadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

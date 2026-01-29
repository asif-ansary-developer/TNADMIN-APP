import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StationListPage } from './station-list.page';

describe('StationListPage', () => {
  let component: StationListPage;
  let fixture: ComponentFixture<StationListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StationListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewTicketsVenMasterPage } from './view-tickets-ven-master.page';

describe('ViewTicketsVenMasterPage', () => {
  let component: ViewTicketsVenMasterPage;
  let fixture: ComponentFixture<ViewTicketsVenMasterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTicketsVenMasterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

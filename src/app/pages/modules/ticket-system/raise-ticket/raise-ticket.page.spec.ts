import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaiseTicketPage } from './raise-ticket.page';

describe('RaiseTicketPage', () => {
  let component: RaiseTicketPage;
  let fixture: ComponentFixture<RaiseTicketPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

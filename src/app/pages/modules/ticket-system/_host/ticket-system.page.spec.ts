import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketSystemPage } from './ticket-system.page';

describe('TicketSystemPage', () => {
  let component: TicketSystemPage;
  let fixture: ComponentFixture<TicketSystemPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketSystemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

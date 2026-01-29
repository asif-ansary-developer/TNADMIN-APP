import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketViewerPage } from './ticket-viewer.page';

describe('TicketViewerPage', () => {
  let component: TicketViewerPage;
  let fixture: ComponentFixture<TicketViewerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

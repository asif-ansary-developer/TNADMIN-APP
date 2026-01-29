import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewComplaintsPage } from './view-complaints.page';

describe('ViewComplaintsPage', () => {
  let component: ViewComplaintsPage;
  let fixture: ComponentFixture<ViewComplaintsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComplaintsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

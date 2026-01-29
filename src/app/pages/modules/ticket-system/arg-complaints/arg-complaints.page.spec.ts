import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArgComplaintsPage } from './arg-complaints.page';

describe('ArgComplaintsPage', () => {
  let component: ArgComplaintsPage;
  let fixture: ComponentFixture<ArgComplaintsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArgComplaintsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

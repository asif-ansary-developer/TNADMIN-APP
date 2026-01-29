import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VisitListPage } from './visit-list.page';

describe('VisitListPage', () => {
  let component: VisitListPage;
  let fixture: ComponentFixture<VisitListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

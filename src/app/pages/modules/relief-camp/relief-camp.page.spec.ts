import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReliefCampPage } from './relief-camp.page';

describe('ReliefCampPage', () => {
  let component: ReliefCampPage;
  let fixture: ComponentFixture<ReliefCampPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReliefCampPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

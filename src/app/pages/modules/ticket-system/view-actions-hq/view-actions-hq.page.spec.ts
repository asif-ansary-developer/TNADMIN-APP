import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewActionsHqPage } from './view-actions-hq.page';

describe('ViewActionsHqPage', () => {
  let component: ViewActionsHqPage;
  let fixture: ComponentFixture<ViewActionsHqPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewActionsHqPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

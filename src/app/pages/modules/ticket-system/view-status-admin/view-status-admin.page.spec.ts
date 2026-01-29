import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewStatusAdminPage } from './view-status-admin.page';

describe('ViewStatusAdminPage', () => {
  let component: ViewStatusAdminPage;
  let fixture: ComponentFixture<ViewStatusAdminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStatusAdminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

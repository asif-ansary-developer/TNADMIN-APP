import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShelterListPage } from './shelter-list.page';

describe('ShelterListPage', () => {
  let component: ShelterListPage;
  let fixture: ComponentFixture<ShelterListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelterListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddInventorySlidePage } from './add-inventory-slide.page';

describe('AddInventorySlidePage', () => {
  let component: AddInventorySlidePage;
  let fixture: ComponentFixture<AddInventorySlidePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInventorySlidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

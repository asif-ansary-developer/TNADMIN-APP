import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmergencyCallRegPage } from './emergency-call-reg.page';

describe('EmergencyCallRegPage', () => {
  let component: EmergencyCallRegPage;
  let fixture: ComponentFixture<EmergencyCallRegPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyCallRegPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HutDamagePage } from './hut-damage.page';

describe('HutDamagePage', () => {
  let component: HutDamagePage;
  let fixture: ComponentFixture<HutDamagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HutDamagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

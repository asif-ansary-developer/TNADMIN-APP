import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HumanInjuryPage } from './human-injury.page';

describe('HumanInjuryPage', () => {
  let component: HumanInjuryPage;
  let fixture: ComponentFixture<HumanInjuryPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanInjuryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

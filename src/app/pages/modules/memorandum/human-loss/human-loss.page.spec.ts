import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HumanLossPage } from './human-loss.page';

describe('HumanLossPage', () => {
  let component: HumanLossPage;
  let fixture: ComponentFixture<HumanLossPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanLossPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

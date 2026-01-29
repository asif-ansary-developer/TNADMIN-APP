import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CattleLossPage } from './cattle-loss.page';

describe('CattleLossPage', () => {
  let component: CattleLossPage;
  let fixture: ComponentFixture<CattleLossPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CattleLossPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

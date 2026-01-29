import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BridgesPage } from './bridges.page';

describe('BridgesPage', () => {
  let component: BridgesPage;
  let fixture: ComponentFixture<BridgesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BridgesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

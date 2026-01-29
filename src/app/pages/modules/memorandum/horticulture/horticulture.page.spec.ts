import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HorticulturePage } from './horticulture.page';

describe('HorticulturePage', () => {
  let component: HorticulturePage;
  let fixture: ComponentFixture<HorticulturePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HorticulturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

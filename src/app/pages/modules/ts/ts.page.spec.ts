import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TsPage } from './ts.page';

describe('TsPage', () => {
  let component: TsPage;
  let fixture: ComponentFixture<TsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

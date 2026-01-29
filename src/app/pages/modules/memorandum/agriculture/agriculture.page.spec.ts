import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgriculturePage } from './agriculture.page';

describe('AgriculturePage', () => {
  let component: AgriculturePage;
  let fixture: ComponentFixture<AgriculturePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgriculturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

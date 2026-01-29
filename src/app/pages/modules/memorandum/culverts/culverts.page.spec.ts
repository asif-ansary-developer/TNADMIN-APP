import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CulvertsPage } from './culverts.page';

describe('CulvertsPage', () => {
  let component: CulvertsPage;
  let fixture: ComponentFixture<CulvertsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CulvertsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SericulturePage } from './sericulture.page';

describe('SericulturePage', () => {
  let component: SericulturePage;
  let fixture: ComponentFixture<SericulturePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SericulturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewClosuresPage } from './view-closures.page';

describe('ViewClosuresPage', () => {
  let component: ViewClosuresPage;
  let fixture: ComponentFixture<ViewClosuresPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewClosuresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

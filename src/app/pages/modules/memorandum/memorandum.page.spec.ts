import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MemorandumPage } from './memorandum.page';

describe('MemorandumPage', () => {
  let component: MemorandumPage;
  let fixture: ComponentFixture<MemorandumPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MemorandumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

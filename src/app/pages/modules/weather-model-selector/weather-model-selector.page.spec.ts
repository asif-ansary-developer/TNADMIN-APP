import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherModelSelectorPage } from './weather-model-selector.page';

describe('WeatherModelSelectorPage', () => {
  let component: WeatherModelSelectorPage;
  let fixture: ComponentFixture<WeatherModelSelectorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherModelSelectorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather-model-selector',
  templateUrl: './weather-model-selector.page.html',
  styleUrls: ['./weather-model-selector.page.scss'],
})
export class WeatherModelSelectorPage implements OnInit {
  weather_model;
  heatwave_model;
  constructor() {}

  ngOnInit() {}
}

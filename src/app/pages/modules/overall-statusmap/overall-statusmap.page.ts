import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
// import * as L from 'leaflet';
declare var L: any;
declare var L: any;

import { AuthService } from 'src/app/guard/auth.service';
import { ApiService } from 'src/app/providers/api.service';
@Component({
  selector: 'app-overall-statusmap',
  templateUrl: './overall-statusmap.page.html',
  styleUrls: ['./overall-statusmap.page.scss'],
})
export class OverallStatusmapPage implements OnInit, AfterViewInit {
  lang;
  username;
  map: any;
  mapState = false;
  markers = [];
  loader: any;
  isLoading = false;

  station_status: any = [];
  fabState = false;
  fab = '1';
  constructor(
    private loadingCtrl: LoadingController,
    private authSerivce: AuthService,
    private api: ApiService,
    private navCtrl: NavController,
    private translate: TranslateService,
    private http: HttpClient
  ) {
    this.lang = localStorage.getItem('language');
    this.username = localStorage.getItem('username');
    this.getStationStatus('1');
  }
  ngOnInit() {}

  ionViewDidEnter() {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [11, 78],
      zoom: 7,
      maxZoom: 15,
      zoomControl: false,
    });

    // const tiles = L.tileLayer(
    //   'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    //   {
    //     maxZoom: 18,
    //     minZoom: 3,
    //     attribution: '',
    //   }
    // );
    // tiles.addTo(this.map);

    this.map.getContainer().style.background = '#e5f1fa';

    this.http
      .get<any>('assets/geojson/map_country.geojson')
      .subscribe((data) => {
        L.geoJSON(data, {
          style: function (feature) {
            return {
              color: 'black',
              weight: 1,
              fillOpacity: 0,
            };
          },
        }).addTo(this.map);
      });

    this.http.get<any>('assets/geojson/districts.geojson').subscribe((data) => {
      L.geoJSON(data, {
        style: function (feature) {
          return {
            color: '#505050',
            weight: 1,
            fillOpacity: 0.2,
            fillColor: '#505050',
          };
        },
      }).addTo(this.map);
    });

    setTimeout(() => {
      this.map.invalidateSize();
      this.mapState = true;
      this.dismissLoader();
    }, 0);
  }

  ngAfterViewInit() {}

  getStationStatus(status) {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        mode: 'ios',
      })
      .then((loadingEl) => {
        loadingEl.present();

        // this.api.get_station_status_by_district_id({ id: status, d_id: 29 });
        this.api
          .get_station_status({ id: status })
          .subscribe(
            (data) => {
              this.station_status = data;
              if (this.station_status.length != 0) {
                console.log('Station status', this.station_status);

                const timer = setInterval(() => {
                  if (this.mapState) {
                    this.plotMarker();
                    // this.dismissLoader();
                    clearInterval(timer);
                    loadingEl.dismiss();
                  }
                });
              } else {
                const timer = setInterval(() => {
                  if (this.mapState) {
                    this.removeMarkers();
                    // this.dismissLoader();
                    clearInterval(timer);
                    loadingEl.dismiss();
                  }
                });
                this.station_status = null;
                // loadingEl.dismiss();

                this.authSerivce.showToast('No data');
              }
            },
            (Error) => {
              this.authSerivce.showToast('No data');
              // this.dismissLoader();

              loadingEl.dismiss();
            }
          );
      });
  }

  plotMarker() {
    this.removeMarkers();
    this.station_status.map((loc) => {
      var color = '#c8e5fd'; //Default color
      var border_color = '#555'; //Default color
      var scenario = loc.station_status; //Default scenario
      var shade = 'black';
      switch (scenario) {
        case 'Civil work completed':
          color = '#FFC106';
          break;
        case 'Fence work completed':
          color = '#06E1FF';
          break;
        case 'Civil and fence work completed':
          color = '#CDFF06';
          break;
        case 'Installation completed':
          color = '#90EE90';
          break;
        case 'Not initiated':
          color = '#4E5E6A';
          border_color = '#fff';
          shade = 'light';
          break;
      }

      var html =
        '<div class="custom-table"><table class="color"' +
        'style="--color:' +
        color +
        '30;' +
        '"><tbody>' +
        '<tr><td>' +
        this.translate.instant('Station code') +
        '</td><td>' +
        // (this.lang == 'en' ? loc.location_name : loc.location_name_ta) +
        loc.station_code +
        '</td></tr>' +
        '<tr><td>' +
        this.translate.instant('District') +
        '</td><td>' +
        loc.district_name +
        '</td></tr>' +
        '<tr><td>' +
        this.translate.instant('Taluk') +
        '</td><td>' +
        loc.taluk_name +
        '</td></tr>' +
        '<tr><td>' +
        this.translate.instant('Village') +
        '</td><td>' +
        loc.village_name +
        '</td></tr>' +
        '<tr><td>' +
        this.translate.instant('Building') +
        '</td><td>' +
        loc.building +
        '</td></tr>' +
        '<tr><td>' +
        this.translate.instant('Status') +
        '</td><td>' +
        loc.station_status +
        '</td></tr>' +
        '</tbody></table ></div>';

      let el = document.createElement('div');
      el.classList.add('marker');

      var s = '';
      if (loc.station_type == 'arg')
        s =
          `<svg width="12" height="12">
           <defs>
            <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.4" stdDeviation="1" flood-color="#101010" flood-opacity="1"/>
            </filter>
          </defs>
              <circle cx="6" cy="6" r="5" fill="` +
          color +
          `" stroke="` +
          border_color +
          `" stroke-width="1.1" />
            </svg>`;
      else
        s =
          `<svg width="12" height="12">
            <polygon points="0,12 6,0 12,12" style="fill:` +
          color +
          `; stroke:` +
          border_color +
          `; stroke-width:1.1" />
            </svg>`;
      el.innerHTML = s;

      const icon = L.divIcon({
        html: el,
        className: 'something',
        iconSize: [12, 12],
        // iconAnchor: [10, 10],
      });

      // const marker = L.circleMarker([loc.latitude, loc.longitude], {
      //   radius: 5.5,
      //   fillOpacity: 1,
      //   className:
      //     shade == 'light' ? 'c-marker-color-light' : 'c-marker-color-dark',
      //   color: color,
      //   weight: 1.4,
      // })
      const marker = L.marker([loc.latitude, loc.longitude], { icon: icon })
        .bindPopup(html)
        .on('click', (e) => {
          // this.map.setView(e.target.getLatLng());
        })
        .addTo(this.map);
      this.markers.push(marker);
    });
  }

  removeMarkers() {
    if (this.markers.length != 0) {
      this.markers.forEach((marker) => {
        marker.remove();
      });
      this.markers = [];
    }
  }

  back() {
    this.navCtrl.navigateBack('/home');
  }

  showHideBackdrop() {
    this.fabState = !this.fabState;
  }
  updateFAB(val) {
    this.fab = val;
    this.getStationStatus(this.fab);
  }

  async showLoader() {
    if (!this.isLoading) {
      this.loader = await this.loadingCtrl.create({
        spinner: 'dots',
        mode: 'ios',
      });
      this.loader.present().then(() => {
        this.isLoading = true;
      });
    }
  }

  async dismissLoader() {
    const timer = setInterval(() => {
      if (this.isLoading) {
        if (this.loadingCtrl.getTop != undefined) this.loader.dismiss();
        this.isLoading = false;
        clearInterval(timer);
      }
    });
  }
}

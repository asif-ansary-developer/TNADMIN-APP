import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/guard/auth.service';
import { ApiService } from 'src/app/providers/api.service';
// import * as L from 'leaflet';
declare var L: any;
declare var google;

@Component({
  selector: 'app-loc-picker',
  templateUrl: './loc-picker.page.html',
  styleUrls: ['./loc-picker.page.scss'],
})
export class LocPickerPage implements OnInit {
  map: any;
  mapState = false;
  markers = [];
  isLoading = false;
  loader: any;
  myLocMarker = [];
  @Input() address;
  @Input() taluk_id;
  latitude;
  longitude;
  marker;
  labelMarkerLayer: any = [];
  constructor(
    private http: HttpClient,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private api: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [11, 78],
      zoom: 7,
      // maxZoom: 15,
      zoomControl: false,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution: '',
      }
    );
    tiles.addTo(this.map);

    // this.map.getContainer().style.background = '#e5f1fa';

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

    const defaultIcon = new L.icon({
      iconUrl: '../../../../../assets/marker.svg',
      iconSize: [50, 50],
      iconAnchor: [2, 2],
      popupAnchor: [0, -2],
    });

    this.marker = L.marker([11, 78], { draggable: true })
      .addTo(this.map)
      .on('dragend', (e) => {
        var position = e.target.getLatLng();
        this.latitude = position.lat;
        this.longitude = position.lng;

        var point = L.point(this.latitude, this.longitude);
        console.log(this.latitude, this.longitude);
      });

    this.labelMarkerLayer = L.layerGroup();
    this.map.on('zoomend', () => {
      const currentZoom = this.map.getZoom();
      const minZoomLevel = 8;
      console.log('zoom', currentZoom);

      if (currentZoom >= minZoomLevel) {
        if (!this.map.hasLayer(this.labelMarkerLayer))
          this.labelMarkerLayer.addTo(this.map);
      } else if (this.map.hasLayer(this.labelMarkerLayer))
        this.map.removeLayer(this.labelMarkerLayer);
    });

    setTimeout(() => {
      this.map.invalidateSize();
      this.mapState = true;
      this.dismissLoader();
      this.convertToCoords();
    }, 50);
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

  closeModal() {
    this.modalCtrl.dismiss();
  }

  closeModalWithData() {
    if (this.taluk_id != undefined)
      this.loadingCtrl
        .create({
          keyboardClose: true,
          spinner: 'dots',
          cssClass: 'loading-backdrop',
          mode: 'ios',
        })
        .then((loadingEl) => {
          loadingEl.present();
          this.api
            .validate_inventory_coords({
              lat: this.latitude,
              lng: this.longitude,
              t_id: this.taluk_id,
            })
            .subscribe((data) => {
              loadingEl.dismiss();
              console.log(data);
              if (data) {
                if (data['error'] != undefined) {
                  this.authService.showAlert('Oops!', data['error']);
                } else {
                  // this.authService.showAlert(data['title'], data['msg']);
                  if (data['title'] == 'Success')
                    this.modalCtrl.dismiss({
                      latitude: this.latitude,
                      longitude: this.longitude,
                    });
                }
              }
            }),
            (err) => {
              console.log('ERROR!: ', JSON.stringify(err));
              loadingEl.dismiss();
              this.authService.showAlert('Failed!', 'Try again');
            };
        });
    else this.authService.showAlert('Oops!', 'Please fill the previous page');
  }

  convertToCoords() {
    let geocoder = new google.maps.Geocoder();
    var latlng;
    var add = this.address;

    geocoder.geocode({ address: add }, (results, status) => {
      if (status === 'OK') {
        const location = results[0].geometry.location;
        const coordinates = {
          latitude: location.lat(),
          longitude: location.lng(),
        };
        latlng = new google.maps.LatLng(
          parseFloat(location.lat()),
          parseFloat(location.lng())
        );
        this.latitude = coordinates.latitude;
        this.longitude = coordinates.longitude;

        console.log('Coordinates for address:', coordinates);
        this.marker.setLatLng([coordinates.latitude, coordinates.longitude]);
        this.map.setView([coordinates.latitude, coordinates.longitude], 16);
        // You can now use the coordinates as needed
      } else {
        console.error(
          'Geocode was not successful for the following reason: ' + status
        );
      }
    });
  }
}

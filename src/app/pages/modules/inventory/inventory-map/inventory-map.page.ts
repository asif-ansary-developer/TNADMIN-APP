import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { filter, forkJoin, skip } from 'rxjs';
import { AuthService } from 'src/app/guard/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { InventoryFilterService } from './inventory-filter-service/inventory-filter.service';
import { NavigationEnd, Router } from '@angular/router';
declare var google: any;
var animi;

@Component({
  selector: 'app-inventory-map',
  templateUrl: './inventory-map.page.html',
  styleUrls: ['./inventory-map.page.scss'],
})
export class InventoryMapPage implements OnInit {
  @ViewChild('pacInput') pacInput!: ElementRef;
  @ViewChild('pacInput2') pacInput2!: ElementRef;
  map: any;
  country_geojson: any = [];
  district_geojson: any = [];

  permission = false;
  coordinate: any;
  latitude;
  longitude;
  myLocMarker = [];
  plotMarkers = [];
  isLoading = false;
  isOpenClick = false;
  isOpen = false;

  loader;
  requestingPermission = false;
  mapState = false;
  proximityCircle: any | null = null;
  selected_item = null;
  inventory_locations: any = [];
  selected_place: any = [];
  selected_place_equip_list: any = [];
  selected_source_filter = [];
  selected_item_filter = [];
  filtered_e_search_list = [];

  loading_equip_list = false;

  routerSubscription;

  callOptionsOpen = false;
  callButtons: any[] = [];

  activeIntput = 'loc';

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private locationAccuracy: LocationAccuracy,
    private platform: Platform,
    private authService: AuthService,
    private api: ApiService,
    public cdr: ChangeDetectorRef,
    public filterService: InventoryFilterService,
    private navCtrl: NavController,
    private router: Router
  ) {
    this.filterService.getSources();
    this.filterService.getEquipments();
  }

  ngOnInit() {
    this.requestPermission();
    this.initMap();

    this.routerSubscription = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        skip(1)
      )
      .subscribe((e) => {
        console.log(e['url']);
        if (e['url'] == '/inventory/inventory-map') {
          console.log('page refreshed');

          this.selected_source_filter = this.filterService.inventory_source
            .filter((item) => item.applied)
            .map((item) => item.source_code);
          this.selected_item_filter = this.filterService.equipment_data
            .filter((item) => item.applied)
            .map((item) => item.item_code);
          this.getInventoryLocations(this.latitude, this.longitude);
        }
      });
  }

  initMap() {
    const mapEl = document.getElementById('map');
    const input = document.getElementById('pac-input') as HTMLInputElement;

    this.map = new google.maps.Map(mapEl, {
      center: { lat: 11.153932759472983, lng: 78.2554193920195 },
      zoom: 7,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    const infowindow = new google.maps.InfoWindow();
    let districtPolygons: any = [];

    forkJoin([
      this.http.get<any>('assets/geojson/map_country.geojson'),
      this.http.get<any>('assets/geojson/districts.geojson'),
    ]).subscribe(([mapCountryData, districtsData]) => {
      this.country_geojson = mapCountryData;
      this.district_geojson = districtsData;

      const countryLayer = new google.maps.Data();
      countryLayer.addGeoJson(this.country_geojson);
      countryLayer.setStyle({
        fillOpacity: 0,
        strokeColor: '#000000',
        fillColor: 'transparent',
        strokeWeight: 1,
      });
      countryLayer.setMap(this.map);

      const districtLayer = new google.maps.Data();
      districtLayer.addGeoJson(this.district_geojson);
      districtLayer.setStyle({
        fillOpacity: 0.5,
        fillColor: '#ffffff',
        strokeColor: '#505050',
        strokeWeight: 1,
      });
      districtLayer.setMap(this.map);

      this.district_geojson.features.forEach((feature) => {
        const geometry = feature.geometry;

        if (geometry.type === 'Polygon') {
          const coords = geometry.coordinates[0].map((coord: number[]) => ({
            lat: coord[1],
            lng: coord[0],
          }));
          districtPolygons.push(new google.maps.Polygon({ paths: coords }));
        } else if (geometry.type === 'MultiPolygon') {
          geometry.coordinates.forEach((polygonCoords: number[][][]) => {
            const coords = polygonCoords[0].map((coord: number[]) => ({
              lat: coord[1],
              lng: coord[0],
            }));
            districtPolygons.push(new google.maps.Polygon({ paths: coords }));
          });
        }
      });
      this.mapState = true;
    });

    const tamilNaduBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(8.0, 76.0), // southwest corner
      new google.maps.LatLng(13.5, 80.5) // northeast corner
    );

    const autocomplete = new google.maps.places.Autocomplete(input, {
      bounds: tamilNaduBounds,
      strictBounds: true,
      componentRestrictions: { country: 'in' },
      fields: ['geometry', 'name'],
      types: ['geocode'],
    });

    input.addEventListener('input', (e) => {
      console.log('Typing:', (e.target as HTMLInputElement).value);
      if (this.activeIntput == 'loc') {
      } else {
      }
    });

    autocomplete.addListener('place_changed', () => {
      if (this.activeIntput == 'loc') {
        const input2 = document.getElementById(
          'pac-input2'
        ) as HTMLInputElement;
        input2.value = null;

        this.removePlotMarkers();
        infowindow.close();

        if (!this.myLocMarker || this.myLocMarker.length === 0) {
          this.myLocMarker = [
            new google.maps.Marker({
              map: this.map,
              position: new google.maps.LatLng(11.1539, 78.2554),
              visible: false,
              draggable: true,
            }),
          ];
        }

        this.myLocMarker[0]?.setVisible(false);

        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        const latLng = place.geometry.location;

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: latLng }, (results, status) => {
          if (
            status === 'OK' &&
            results &&
            results.length > 0 &&
            results.some((r) =>
              r.address_components.some(
                (comp) => comp.long_name === 'Tamil Nadu'
              )
            )
          ) {
            const isInside = districtPolygons.some((poly) =>
              google.maps.geometry.poly.containsLocation(latLng, poly)
            );

            if (isInside) {
              this.map.panTo(latLng);
              this.myLocMarker[0]?.setPosition(latLng);
              this.myLocMarker[0]?.setVisible(true);

              if (this.proximityCircle) {
                this.proximityCircle.setMap(null);
              }

              this.proximityCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.1,
                map: this.map,
                center: latLng,
                radius: 10000,
              });

              this.map.fitBounds(this.proximityCircle.getBounds()!);

              console.log(latLng);
              this.latitude = latLng.lat();
              this.longitude = latLng.lng();
              this.getInventoryLocations(latLng.lat(), latLng.lng());
            } else {
              alert('Selected location is outside the district boundaries.');
              const ip = document.getElementById(
                'pac-input'
              ) as HTMLInputElement;
              ip.value = '';
              if (this.proximityCircle) this.proximityCircle.setMap(null);
            }
          } else {
            alert('Selected place is not within Tamil Nadu.');
            const ip = document.getElementById('pac-input') as HTMLInputElement;
            ip.value = null;
            if (this.proximityCircle) this.proximityCircle.setMap(null);
            this.myLocMarker[0].setPosition(
              new google.maps.LatLng(11.153932759472983, 78.2554193920195)
            );
            this.myLocMarker[0].setVisible(true);
            this.map.setOptions({
              center: { lat: 11.153932759472983, lng: 78.2554193920195 },
              zoom: 7,
            });
          }
        });
      } else {
      }
    });

    this.myLocMarker = [
      new google.maps.Marker({
        map: this.map,
        position: {},
        draggable: true,
        visible: false,
      }),
    ];

    this.proximityCircle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.1,
      map: this.map,
      center: {},
      radius: 10000, // meters = 10 km
    });

    google.maps.event.addListener(
      this.myLocMarker[0],
      'dragend',
      (event: any) => {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        console.log('Dragged to:', newLat, newLng);
        const zoomLevel = this.map.getZoom();
        if (zoomLevel < 10) {
          this.map.setZoom(12);
        }
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat: newLat, lng: newLng } },
          (results, status) => {
            const isInside = districtPolygons.some((poly) =>
              google.maps.geometry.poly.containsLocation(event.latLng, poly)
            );

            if (status === 'OK' && results.length) {
              let address = results[0].formatted_address;

              address = address.replace(/^[\dA-Z]+\+[\dA-Z]+\s*,?\s*/i, '');

              const input = document.getElementById(
                'pac-input'
              ) as HTMLInputElement;
              if (input) {
                input.value = address;
              }
            } else {
              console.error('Geocoder failed due to:', status);
            }
          }
        );

        this.latitude = newLat;
        this.longitude = newLng;
        if (this.activeIntput != 'loc')
          this.getInventoryLocations(
            this.latitude,
            this.longitude,
            this.selected_item
          );
        else this.getInventoryLocations(this.latitude, this.longitude);

        this.proximityCircle.setMap(null);
        this.map.panTo({ lat: newLat, lng: newLng });
        this.proximityCircle = new google.maps.Circle({
          strokeColor: '#FF0000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF0000',
          fillOpacity: 0.1,
          map: this.map,
          center: { lat: newLat, lng: newLng },
          radius: 10000, // meters = 10 km
        });
      }
    );
  }

  getInventoryItemsByLoc(id) {
    this.loading_equip_list = true;
    this.selected_place_equip_list = [];
    this.api.get_inventory_items_list({ unique_id: id }).subscribe((data) => {
      this.selected_place_equip_list = data;
      console.log(this.selected_place_equip_list);
      this.loading_equip_list = false;
      this.cdr.detectChanges();
    });
  }

  getInventoryLocations(lat, lng, item = null) {
    var param;
    if (this.activeIntput != 'loc') {
      if (!item) item = this.selected_item;
      this.filterService.ResetFilters();
      this.selected_item_filter = [];
      this.selected_source_filter = [];
      param = {
        lat: lat,
        lng: lng,
        i_filter: [item.item_code],
      };
      console.log(param);
      const input = document.getElementById('pac-input2') as HTMLInputElement;
      input.value = item.item_name;
    } else
      param = {
        lat: lat,
        lng: lng,
        s_filter:
          this.selected_source_filter.length != 0
            ? this.selected_source_filter
            : null,
        i_filter:
          this.selected_item_filter.length != 0
            ? this.selected_item_filter
            : null,
      };
    console.log('inventory location param', JSON.stringify(param));
    this.api.get_inventory_stockhouse_get(param).subscribe((data) => {
      console.log('inventory locations', data);
      console.log('inventory location param', JSON.stringify(param));
      this.inventory_locations = data;
      this.removePlotMarkers();
      if (this.inventory_locations?.length == 0)
        this.authService.showToast('No locations found');
      else {
        this.inventory_locations?.forEach((place, index) => {
          const latLng = new google.maps.LatLng(
            parseFloat(place.latitude),
            parseFloat(place.longitude)
          );

          const iconMap = {
            S1: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
            S2: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            S3: 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png',
            S4: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png',
            S5: 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png',
            S6: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
          };

          const icon = {
            url: iconMap[place.source_id],
            // scaledSize: new google.maps.Size(10, 10),
          };

          const marker = new google.maps.Marker({
            position: latLng,
            map: this.map,
            title: place.landmark,
            index: index,
            icon: icon,
          });
          marker.setMap(this.map);
          marker.addListener('click', () => {
            this.getInventoryItemsByLoc(place?.unique_id);
            console.log('Clicked marker ID (slno):', marker.index);
            console.log('place', place);
            this.selected_place = place;
            this.isOpen = true;
            this.isOpenClick = true;
            console.log(':clik', this.isOpen, this.isOpenClick);
            this.cdr.detectChanges();
          });
          this.plotMarkers.push(marker);
        });
      }
    });
  }

  get contactNumbers(): string {
    const place = this.selected_place;
    return [place?.landline_no, place?.alternate_no, place?.mobile_no]
      .filter((num) => !!num && num !== '0' && num !== 0 && num !== '')
      .join(', ');
  }
  get sourceType(): string {
    const place = this.selected_place;
    const sources = this.filterService.inventory_source;
    const sourceId = place.source_id;
    console.log(sourceId);
    const match = sources?.find((item) => item.source_code === sourceId);
    console.log(sources);
    console.log(match?.source_name);
    return match?.source_name;
  }

  navigateToGoogleMaps(lat, lng) {
    lat = parseFloat(lat);
    lng = parseFloat(lng);

    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, '_blank');
  }

  openCallOptions() {
    this.callButtons = [];

    if (this.selected_place.landline_no) {
      this.callButtons.push({
        text: 'Landline: ' + this.selected_place.landline_no,
        icon: 'call',
        handler: () => {
          window.open('tel:' + this.selected_place.landline_no, '_system');
        },
      });
    }

    if (this.selected_place.alternate_no) {
      this.callButtons.push({
        text: 'Alternate: ' + this.selected_place.alternate_no,
        icon: 'call',
        handler: () => {
          window.open('tel:' + this.selected_place.alternate_no, '_system');
        },
      });
    }

    if (this.selected_place.mobile_no) {
      this.callButtons.push({
        text: 'Mobile: ' + this.selected_place.mobile_no,
        icon: 'call',
        handler: () => {
          window.open('tel:' + this.selected_place.mobile_no, '_system');
        },
      });
    }

    this.callButtons.push({
      text: 'Cancel',
      role: 'cancel',
    });

    this.callOptionsOpen = true;
  }

  closeBottomModal(modal) {
    modal.dismiss();
    this.isOpenClick = false;
    this.isOpen = false;
    console.log(':clos');
  }

  removePlotMarkers() {
    if (this.plotMarkers && this.plotMarkers.length > 0) {
      this.plotMarkers.forEach((marker) => marker.setMap(null));
      this.plotMarkers = [];
    }
  }

  navigateToFilter() {
    this.navCtrl.navigateForward('inventory/inventory-map/inventory-filter');
  }

  requestPermission() {
    this.showLoader();

    this.requestingPermission = true;
    Geolocation.checkPermissions()
      .then((status) => {
        console.log('First status...', JSON.stringify(status));

        if (
          status.location == 'granted' &&
          status.coarseLocation === 'granted'
        ) {
          this.permission = true;
          this.turnOnGPS();
        } else {
          console.log('default status...', JSON.stringify(status));
          this.permission = false;
          Geolocation.requestPermissions().then((permissionStatus) => {
            console.log(
              'req permission status...',
              JSON.stringify(permissionStatus)
            );

            if (
              permissionStatus.location == 'granted' &&
              permissionStatus.coarseLocation == 'granted'
            ) {
              this.permission = true;
              this.turnOnGPS();
            } else {
              this.permission = false;
              this.requestingPermission = false;
              this.authService.showToast('Please enable Location permission!');
              this.dismissLoader();
            }
          });
        }
      })
      .catch((err) => {
        this.permission = false;
        this.authService.showAlert(null, 'Please enable Location service!');

        this.dismissLoader();
        this.requestingPermission = false;
      });
  }

  turnOnGPS() {
    if (this.platform.is('android')) {
      this.locationAccuracy
        .request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
        .then(
          () => {
            console.log('Request successful');
            this.getLocation();
          },
          (error) => {
            this.dismissLoader();

            this.requestingPermission = false;
            console.log('Error requesting location permissions', error);
          }
        );
    } else {
      this.getLocation();
    }
  }

  getLocation() {
    console.log('getiing location');
    Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1,
    })
      .then((data) => {
        console.log(JSON.stringify(data));
        this.coordinate = {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
          accuracy: data.coords.accuracy,
        };
        this.latitude = data.coords.latitude;
        this.longitude = data.coords.longitude;

        const timer = setInterval(() => {
          if (this.mapState) {
            const currentLatLng = new google.maps.LatLng(
              this.latitude,
              this.longitude
            );

            const mapBounds = this.map.getBounds();

            if (!mapBounds || !mapBounds.contains(currentLatLng)) {
              this.myLocMarker[0].setPosition(
                new google.maps.LatLng(11.153932759472983, 78.2554193920195)
              );
              this.myLocMarker[0].setVisible(true);

              this.map.setOptions({
                center: { lat: 11.153932759472983, lng: 78.2554193920195 },
                zoom: 6,
              });
              this.proximityCircle.setCenter(currentLatLng);

              console.log('default');
              this.dismissLoader();
            } else {
              const latLng = new google.maps.LatLng(
                data.coords.latitude,
                data.coords.longitude
              );

              this.map.setOptions({
                center: {
                  lat: data.coords.latitude,
                  lng: data.coords.longitude,
                },
              });
              this.myLocMarker[0].setPosition(latLng);
              this.myLocMarker[0].setVisible(true);
              this.map.setZoom(12);
              this.map.panTo(latLng);
              this.proximityCircle.setCenter(latLng);
              console.log('custom');
              this.dismissLoader();
            }

            this.getInventoryLocations(this.latitude, this.longitude);
            clearInterval(timer);
            this.requestingPermission = false;
          }
        });
      })
      .catch((err) => {
        this.dismissLoader();
        console.log('Error getting location!');
        console.log(err);
        this.requestingPermission = false;
      });
  }

  async showLoader() {
    if (!this.isLoading) {
      this.isLoading = true;
      this.loader = await this.loadingCtrl.create({
        spinner: 'dots',
        mode: 'ios',
      });
      this.loader.present().then(() => { });
    }
  }

  dismissLoader() {
    const timer = setInterval(() => {
      if (this.isLoading && this.loader) {
        if (this.isLoading) {
          this.loader.dismiss();
        }
        this.isLoading = false;
        this.loader = null;
        clearInterval(timer);
      }
    });
  }

  ngOnDestroy() {
    this.dismissLoader();
  }

  onBreakpointChange(e) {
    console.log(e.detail.breakpoint);

    if (e.detail.breakpoint == 1 && this.isOpenClick) {
    } else if (e.detail.breakpoint == 0) {
      this.isOpenClick = false;
    }
  }

  leaveAnimation(baseEl: any) {
    const animation = animi
      .create()
      .addElement(baseEl)
      .keyframes([
        { offset: 0, opacity: 1 },
        { offset: 1, opacity: 0 },
      ])
      .duration(0);
    return animation;
  }

  async filterItems(ev: any) {
    const input = document.getElementById('pac-input2') as HTMLInputElement;
    var searchTerm = input.value;
    console.log('searchterm', searchTerm);
    if (searchTerm && searchTerm.trim() != '') {
      var s_term = searchTerm;
      // var s_term = 'ARG' + this.searchTerm;
      // console.log(s_term);
      this.filtered_e_search_list =
        await this.filterService.equipment_data.filter((item) => {
          return item.item_name.toLowerCase().includes(s_term.toLowerCase());
        });
      console.log(this.filtered_e_search_list);
    } else {
      this.filtered_e_search_list = this.filterService.equipment_data;
    }
  }
}

import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  ActionSheetController,
  IonContent,
  LoadingController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { FilterPage } from './filter/filter.page';
import { ApiService } from 'src/app/providers/api.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from 'src/app/guard/auth.service';
import { PreviewPage } from './preview/preview.page';
import { Geolocation } from '@capacitor/geolocation';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.page.html',
  styleUrls: ['./maintenance.page.scss'],
})
export class MaintenancePage implements OnInit {
  @ViewChild('swiper_maintenance', { static: true }) swiper?: SwiperComponent;
  @ViewChild('content', { static: false }) content: IonContent;

  activeSlide = 0;
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 10,
    speed: 100,
    allowTouchMove: false,
  };
  previewModalState = false;

  form_1: FormGroup;
  public district_data: any = [];
  public taluk_data: any = [];
  public station_data: any = [];
  today;
  district;
  taluk;
  taluk_name;
  district_name;
  station;
  station_name;
  date;
  purpose;
  modalState = false;

  form_2: FormGroup;
  public maintenance_menu: any = [];
  maintenance_type;
  issue = '';
  replacement_detail = '';
  // before_img: any =
  //   'data:image/png;base64,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';
  // after_img: any =
  //   'data:image/png;base64,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';
  before_img;
  after_img;
  during_img;
  // after_img;
  before_img_help_text = false;
  during_img_help_text = false;
  after_img_help_text = false;
  maintenance_performed;
  checkbox_touched = false;
  checkbox_checked = false;
  selected_maintenance_types = [];

  form_3: FormGroup;
  remarks;

  camera_mode;
  latitude;
  longitude;
  permission = false;
  constructor(
    private cdr: ChangeDetectorRef,
    private modalController: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private api: ApiService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private locationAccuracy: LocationAccuracy
  ) {
    this.getDistricts();
    this.getMaintananceMenu();
    this.today = moment().utcOffset('+05:30').format('yyyy-MM-DD');
  }

  async requestPermission() {
    try {
      const status = await Geolocation.checkPermissions();
      console.log('First status...', JSON.stringify(status));

      if (
        status.location === 'granted' &&
        status.coarseLocation === 'granted'
      ) {
        this.permission = true;
        this.getLocation();
      } else {
        console.log('Default status...', JSON.stringify(status));
        this.permission = false;
        await this.requestGeolocationPermission();
      }
    } catch (err) {
      console.error(err);
      this.turnOnGPS();
    }
  }

  async requestGeolocationPermission() {
    try {
      const permissionStatus = await Geolocation.requestPermissions();
      console.log(
        'Request permission status...',
        JSON.stringify(permissionStatus)
      );

      if (
        permissionStatus.location === 'granted' &&
        permissionStatus.coarseLocation === 'granted'
      ) {
        this.permission = true;
        this.getLocation();
      } else {
        this.permission = false;
        this.authService.showToast('Please enable Location permission!');
      }
    } catch (err) {
      console.error('Error requesting location permissions', err);
      this.authService.showToast('Failed to request location permissions!');
    }
  }

  async turnOnGPS() {
    if (this.platform.is('android')) {
      try {
        await this.locationAccuracy.request(
          this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY
        );
        console.log('Request successful');
        this.requestPermission();
      } catch (error) {
        console.error('Error requesting location permissions', error);
        this.authService.showToast('Failed to enable high accuracy location!');
      }
    } else {
      this.getLocation();
    }
  }

  async getLocation() {
    console.log('getiing location');
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1,
    })
      .then((data) => {
        console.log(JSON.stringify(data));

        this.latitude = data.coords.latitude;
        this.longitude = data.coords.longitude;
      })
      .catch((err) => {
        console.log(err, 'Error getting location!');
        this.authService.showToast('Error getting location!');
      });
  }

  addLatLongToImage(imgUri) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imgUri;

      img.onload = () => {
        // Set canvas dimensions to match the image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');

        // Draw the original image onto the canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Calculate font size as a percentage of the image height
        const fontSize = canvas.height * 0.03; // 3% of image height
        ctx.font = `${fontSize}px monospace`;
        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';

        // Add shadow for better readability
        ctx.shadowColor = 'white';
        ctx.shadowOffsetX = fontSize * 0.1;
        ctx.shadowOffsetY = fontSize * 0.1;
        ctx.shadowBlur = fontSize * 0.2;

        // Add latitude, longitude, and ID text
        const text = `Lat: ${this.latitude} Lng: ${this.longitude}\nID: ${this.station} - ${this.station_name}`;
        const lines = text.split('\n');
        const xPosition = canvas.width * 0.05; // 5% of image width for padding
        let yPosition = canvas.height * 0.05; // 5% of image height for the first line

        lines.forEach((line) => {
          ctx.fillText(line, xPosition, yPosition);
          yPosition += fontSize * 1.5; // Line spacing proportional to font size
        });

        // Convert the canvas to an image URI
        const newImgUri = canvas.toDataURL('image/jpg');
        resolve(newImgUri);
      };

      img.onerror = (err) => {
        reject(new Error('Failed to load the image: ' + err));
      };
    });
  }

  ngOnInit() {
    this.requestPermission();
    this.form_1 = this.formBuilder.group({
      district: ['', Validators.required],
      taluk: ['', [Validators.required]],
      station: ['', [Validators.required]],
      stationName: ['', [Validators.required]],
      visitDate: new FormControl(null, Validators.required),
      purpose: ['', [Validators.required]],
    });

    this.form_2 = this.formBuilder.group({
      // maintenanceType: ['', Validators.required],
      // maintenancePerformed: ['', Validators.required],
    });

    this.form_3 = this.formBuilder.group({
      remarksDetail: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  getDistricts() {
    this.station = null;
    this.api
      .districts_by_username_get({ id: localStorage.getItem('username') })
      .subscribe((data) => {
        this.district_data = data;
        console.log('vendor districts', this.district_data);
      });
  }

  getTaluks() {
    this.station = null;
    this.api
      // .get_taluk_data_by_district_id({ id: this.district })
      .get_taluks_by_district_code({ id: this.district })
      .subscribe((data) => {
        this.taluk_data = data;
        console.log('vendor taluks', this.taluk_data);
      });
  }

  getStations() {
    this.station = null;
    console.log({ id: this.district, name: this.taluk });
    this.api
      // .stations_by_district_get({ id: this.district})
      .stations_by_district_taluk_get({ id: this.district, name: this.taluk })
      .subscribe((data) => {
        console.log('stations', data);
        this.station_data = data;
      });
  }

  updateName(val) {
    console.log(val);
    switch (val) {
      case 'dis':
        const dist = this.district_data.filter(
          (data) => data.district_id == this.district
        );
        if (dist.length > 0) this.district_name = dist[0]['district_name'];
        return;
      case 'tal':
        // const tal = this.taluk_data.filter(
        //   (data) => data.taluk_id == this.taluk
        // );
        // if (dist.length > 0) this.district_name = dist[0]['district_name'];
        return;

      case 'stat':
        const stat = this.station_data.filter(
          (data) => data.station_code == this.station
        );
        if (stat.length > 0) this.station_name = stat[0]['location_name'];
        return;
    }
  }

  visitDateChange(event) {
    console.log(event);
    console.log(this.date);
    console.log('Selected date:', event.detail.value);
  }

  getMaintananceMenu() {
    this.api.get_vendor_maintenance_menus().subscribe((data) => {
      this.maintenance_menu = data;
      this.maintenance_menu['type'].forEach((_, index) => {
        this.form_2.addControl('type_' + index, new FormControl(false));
      });
    });
  }

  typeChange(event) {
    console.log('Selected type:', event.detail.value);
  }

  async getPhoto() {
    var buttons = [
      {
        text: 'Camera',
        handler: () => {
          this.getCamera(1);
        },
      },
      {
        text: 'Gallery',
        handler: () => {
          this.getCamera(2);
        },
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {},
      },
    ];

    (await this.actionSheetCtrl.create({ buttons: buttons })).present();
  }

  getCamera = (src) => {
    Camera.checkPermissions().then((status) => {
      if (status.camera == 'granted' && status.photos == 'granted') {
        switch (src) {
          case 1:
            Camera.getPhoto({
              quality: 50,
              allowEditing: false,
              source: CameraSource.Camera,
              resultType: CameraResultType.DataUrl,
              width: 600, // Set width to reduce resolution
              height: 800, //
            }).then(async (image) => {
              const compressedImage = await this.compressImage(image.dataUrl);
              this.setImage(compressedImage);
              // this.setImage(image.dataUrl);
            });
            break;

          case 2:
            Camera.getPhoto({
              quality: 50,
              allowEditing: false,
              source: CameraSource.Photos,
              resultType: CameraResultType.DataUrl,
              width: 600, // Set width to reduce resolution
              height: 800, //
            }).then(async (image) => {
              const compressedImage = await this.compressImage(image.dataUrl);
              this.setImage(compressedImage);
              // this.setImage(image.dataUrl);
            });
            break;
        }
      } else {
        this.authService.showToast('Please enable camera access');
        Camera.requestPermissions().then((permissionStatus) => {
          console.log(permissionStatus);
          if (
            permissionStatus.camera == 'granted' &&
            permissionStatus.photos == 'granted'
          ) {
            this.getPhoto();
          }
        });
      }
    });
  };

  async setImage(img) {
    if (!this.station) {
      this.authService.showToast('Please select station');
      return;
    }
    if (this.latitude && this.longitude) {
      var _case = 0;
      switch (this.camera_mode) {
        case 1:
          this.before_img = img;
          _case = 1;
          break;
        case 2:
          this.during_img = img;
          _case = 2;
          break;
        case 3:
          this.after_img = img;
          _case = 3;
          break;
      }
    } else {
      this.authService.showToast('Please enable GPS!');
    }
  }

  clearAttachment() {
    switch (this.camera_mode) {
      case 1:
        this.before_img = null;
        break;
      case 2:
        this.during_img = null;
        break;
      case 3:
        this.after_img = null;
        break;
    }
  }

  onCheckboxChange(type: string, index: number, event: any): void {
    const isChecked = event.detail.checked;
    if (type == 'External Issue')
      if (isChecked) {
        if (!this.form_2.contains('issueDetail'))
          this.form_2.addControl(
            'issueDetail',
            new FormControl('', [
              Validators.maxLength(100),
              Validators.minLength(5),
              Validators.required,
            ])
          );
      } else {
        if (this.form_2.contains('issueDetail'))
          this.form_2.removeControl('issueDetail');
        this.issue = null;
      }

    if (type == 'Replacement')
      if (isChecked) {
        if (!this.form_2.contains('replacementDetail'))
          this.form_2.addControl(
            'replacementDetail',
            new FormControl('', [
              Validators.maxLength(100),
              Validators.minLength(5),
              Validators.required,
            ])
          );
      } else {
        if (this.form_2.contains('replacementDetail'))
          this.form_2.removeControl('replacementDetail');
        this.replacement_detail = null;
        this.during_img = null;
      }

    if (isChecked && !this.selected_maintenance_types.includes(type)) {
      this.selected_maintenance_types.push(type);
    } else if (!isChecked && this.selected_maintenance_types.includes(type)) {
      const typeIndex = this.selected_maintenance_types.indexOf(type);
      if (typeIndex !== -1) {
        this.selected_maintenance_types.splice(typeIndex, 1);
      }
    }
    this.isAnyCheckboxTouchedAndChecked();
  }

  isAnyCheckboxTouchedAndChecked(): void {
    this.checkbox_touched = true;
    console.log(this.checkbox_touched);
    this.checkbox_checked = this.maintenance_menu['type'].some(
      (_, index) => this.form_2.get('type_' + index)?.value
    );
  }

  verify() {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        mode: 'ios',
      })
      .then(async (el) => {
        el.present();

        const result = await this.updateImages();
        if (result) {
          if (!this.previewModalState) {
            this.previewModalState = true;
            const modal = await this.modalController.create({
              component: PreviewPage,
              mode: 'ios',
              componentProps: {
                preview_data: {
                  district_id: this.district,
                  district_name: this.district_name,
                  taluk: this.taluk,
                  station_code: this.station,
                  station_name: this.station_name,
                  visit_date: this.today,
                  purpose: this.purpose,
                  maintenance_type: this.selected_maintenance_types,
                  issue_detail: this.issue,
                  replacement_detail: this.replacement_detail,
                  before_img: this.before_img,
                  during_img: this.during_img,
                  after_img: this.after_img,
                  remarks: this.remarks,
                },
              },
            });
            modal.onDidDismiss().then((dataReturned) => {
              this.previewModalState = false;
            });
            return await modal.present().then(() => {
              el.dismiss();
            });
          }
        }
      });
  }

  prevSlide() {
    this.swiper.swiperRef.slidePrev();
    console.log('form_2.invalid', this.form_2.invalid);
    console.log('activeSlide', !this.checkbox_checked && this.checkbox_touched);
    console.log(
      'rest',
      !this.form_2.get('issueDetail').valid &&
        this.form_2.get('issueDetail').touched &&
        this.activeSlide != 1
    );

    console.log(
      (!this.before_img && this.before_img_help_text) ||
        (!this.during_img && this.during_img_help_text) ||
        (!this.after_img &&
          this.after_img_help_text &&
          !this.checkbox_checked &&
          this.checkbox_touched)
    );
  }

  onSwiper(swiper) {
    this.activeSlide = swiper.activeIndex;
  }

  onSlideChange() {
    this.content.scrollToTop(0);
    this.activeSlide = this.swiper.swiperRef.activeIndex;
    console.log('active_slide', this.activeSlide);
    this.cdr.detectChanges();
  }

  goToSlide(index) {
    this.content.scrollToTop(0);
    this.swiper.swiperRef.slideTo(index);
  }

  nextSlide() {
    this.swiper.swiperRef.slideNext();
  }

  async presentModal(filter) {
    if (!this.modalState) {
      this.modalState = true;
      const modal = await this.modalController.create({
        component: FilterPage,
        mode: 'ios',
        cssClass: 'filter-li-popup',
        componentProps: {
          filter_name: filter,
          data:
            filter == 'district'
              ? this.district_data
              : filter == 'station'
              ? this.station_data
              : this.district_data,
        },
      });

      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned != null) {
          console.log(dataReturned);
          if (
            dataReturned['data'] != undefined &&
            dataReturned['data'] != null
          ) {
            // if (dataReturned['data']['data'].length != 0) {
            // if (filter == 'department') {
            //   this.department = dataReturned['data']['data'][0]['dept_id'];
            //   this.department_name =
            //     dataReturned['data']['data'][0]['dept_name'];
            //   this.form_1.get('department').setValue(this.department_name);
            //   this.form_1.get('source').setValue(null);
            // } else if (filter == 'source') {
            //   this.source = dataReturned['data']['data'][0]['source_code'];
            //   this.source_name =
            //     dataReturned['data']['data'][0]['source_name'];
            //   this.form_1.get('source').setValue(this.source_name);
            // } else if (filter == 'equipment') {
            //   this.addEquipment(dataReturned['data']['data'][0]);
            // }
            // }
          } else {
          }
          this.modalState = false;
        }
      });
      return await modal.present().then(() => {});
    }
    // this.cdr.detectChanges();
  }

  async compressImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set maximum dimensions for resizing
        const MAX_WIDTH = 600; // Example: Adjust dimensions as needed
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        // Scale dimensions to maintain aspect ratio
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            height = (MAX_WIDTH / width) * height;
            width = MAX_WIDTH;
          } else {
            width = (MAX_HEIGHT / height) * width;
            height = MAX_HEIGHT;
          }
        }

        // Resize the canvas
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Compress the resized image to a data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6); // Compression quality
        resolve(compressedDataUrl);
      };

      img.onerror = (err) => {
        reject(new Error('Failed to load image for compression: ' + err));
      };
    });
  }

  async updateImages() {
    this.before_img = await this.addLatLongToImage(this.before_img);
    this.during_img = this.form_2.contains('replacementDetail')
      ? await this.addLatLongToImage(this.during_img)
      : '';
    this.after_img = await this.addLatLongToImage(this.after_img);
    return true;
  }

  getSlideIndicatorBackground(): string {
    const issueDetail = this.form_2.get('issueDetail');
    const replacementDetail = this.form_2.get('replacementDetail');

    // Conditions for invalid states
    const isInvalid = (detail) => !detail?.valid && detail?.touched;

    const hasMissingImages =
      (!this.before_img && this.before_img_help_text) ||
      (!this.during_img && this.during_img_help_text) ||
      (!this.after_img && this.after_img_help_text);

    const checkboxInvalid = !this.checkbox_checked && this.checkbox_touched;

    // Determine the background color
    if (!issueDetail || !replacementDetail) {
      if (this.activeSlide != 1 && (hasMissingImages || checkboxInvalid)) {
        return 'var(--ion-color-danger)';
      }
      return '';
    }

    if (
      isInvalid(issueDetail) ||
      isInvalid(replacementDetail) ||
      (this.activeSlide != 1 && (hasMissingImages || checkboxInvalid))
    ) {
      return 'var(--ion-color-danger)';
    }

    if (
      this.form_2.valid &&
      this.before_img &&
      this.during_img &&
      this.after_img &&
      this.checkbox_checked
    ) {
      return '#6ab200'; // Success state
    }

    return ''; // Default state
  }
}

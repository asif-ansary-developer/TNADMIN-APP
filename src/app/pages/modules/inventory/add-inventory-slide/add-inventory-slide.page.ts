import {
  ChangeDetectorRef,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  NgModel,
  Validators,
} from '@angular/forms';
import { IonContent, ModalController, NavController } from '@ionic/angular';
import { take } from 'rxjs';
import { AuthService } from 'src/app/guard/auth.service';
import { ApiService } from 'src/app/providers/api.service';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { FilterPage } from '../filter/filter.page';
import { PreviewPage } from '../preview/preview.page';
import { LocPickerPage } from '../loc-picker/loc-picker.page';

@Component({
  selector: 'app-add-inventory-slide',
  templateUrl: './add-inventory-slide.page.html',
  styleUrls: ['./add-inventory-slide.page.scss'],
})
export class AddInventorySlidePage implements OnInit {
  @ViewChild('swiper_inventory', { static: true }) swiper?: SwiperComponent;
  @ViewChildren('equipmentNameCtrl') equipmentNameCtrls: QueryList<NgModel>;
  @ViewChildren('equipmentQuantityCtrl')
  equipmentQuantityCtrls: QueryList<NgModel>;
  @ViewChild('content', { static: false }) content: IonContent;

  activeSlide = 0;
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 10,
    speed: 100,
    allowTouchMove: false,
  };
  modalState = false;
  previewModalState = false;
  locModalState = false;

  lang;
  department;
  department_name;
  source;
  source_name;
  entity;
  incharge;
  incharge_number;
  alternate_number;
  landline_number;
  functional_status;

  district_id;
  taluk_id;
  firka_id;
  village_id;
  district_name;
  taluk_name;
  firka_name;
  village_name;
  landmark;

  plot_no;
  street;
  city;
  postal_code;

  state = 'Tamil nadu';
  country = 'India';
  latitude;
  longitude;

  // equipment_list: { name: string; nos: any }[] = [{ name: '', nos: null }];
  equipment_list: { name: string; nos: any; code: any }[] = [];

  public districts_data: any = [];
  public taluks_data: any = [];
  public firkas_data: any = [];
  public villages_data: any = [];
  public department_data: any = [];
  public source_data: any = [];
  public equipment_data: any = [];

  form_1: FormGroup;
  form_2: FormGroup;
  form_3: FormGroup;
  form_3a: FormGroup;
  form_4: FormGroup;
  form_5: FormGroup;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private modalCtrl: ModalController
  ) {
    this.lang = localStorage.getItem('language');
  }

  ngOnInit() {
    this.form_1 = this.formBuilder.group({
      department: ['', Validators.required],
      source: ['', [Validators.required]],
    });

    this.form_2 = this.formBuilder.group({
      entity: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      incharge: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      inchargeNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      alternateNumber: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      landline: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
        ],
      ],
    });

    this.form_3 = this.formBuilder.group({
      district: ['', [Validators.required]],
      taluk: ['', [Validators.required]],
      village: ['', [Validators.required]],
      firka: ['', [Validators.required]],
    });

    this.form_3a = this.formBuilder.group({
      plotNo: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(30),
        ],
      ],
      street: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(30),
        ],
      ],
      city: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
        ],
      ],
      landmark: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      postalCode: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });

    this.form_4 = this.formBuilder.group({
      equipmentList: this.formBuilder.array([]),
    });

    this.form_5 = this.formBuilder.group({
      functionalStatus: ['', Validators.required],
    });
  }

  verify() {
    this.previewPage();
  }

  async previewPage() {
    if (!this.previewModalState) {
      this.previewModalState = true;
      const modal = await this.modalController.create({
        component: PreviewPage,
        // cssClass: 'filter-li-popup',
        mode: 'ios',
        componentProps: {
          preview_data: {
            department: this.department,
            department_name: this.department_name,
            taluk_id: this.taluk_id,
            taluk_name: this.taluk_name,
            district_id: this.district_id,
            district_name: this.district_name,
            firka_id: this.firka_id,
            firka_name: this.firka_name,
            village_id: this.village_id,
            village_name: this.village_name,
            pincode: this.postal_code,
            plot: this.plot_no,
            street: this.street,
            city: this.city,
            landmark: this.landmark,
            address:
              this.plot_no +
              ',' +
              this.street +
              ',' +
              this.city +
              ',' +
              this.state +
              ',' +
              this.country +
              ',' +
              this.postal_code,
            latitude: this.latitude,
            longitude: this.longitude,
            source: this.source,
            source_name: this.source_name,
            entity: this.entity,
            incharge: this.incharge,
            incharge_no: this.incharge_number,
            alternate_no: this.alternate_number,
            landline: this.landline_number,
            equipment_list: this.equipment_list,
            functional_status: this.functional_status,
          },
        },
      });
      modal.onDidDismiss().then((dataReturned) => {
        this.previewModalState = false;
      });
      return await modal.present().then(() => {});
    }
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
            filter == 'department'
              ? this.department_data
              : filter == 'source'
              ? this.source_data
              : this.equipment_data,
        },
      });
      modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned != null) {
          console.log(dataReturned);
          if (
            dataReturned['data'] != undefined &&
            dataReturned['data'] != null
          ) {
            if (dataReturned['data']['data'].length != 0) {
              if (filter == 'department') {
                this.department = dataReturned['data']['data'][0]['dept_id'];
                this.department_name =
                  dataReturned['data']['data'][0]['dept_name'];
                this.form_1.get('department').setValue(this.department_name);
                this.form_1.get('source').setValue(null);
              } else if (filter == 'source') {
                this.source = dataReturned['data']['data'][0]['source_code'];
                this.source_name =
                  dataReturned['data']['data'][0]['source_name'];
                this.form_1.get('source').setValue(this.source_name);
              } else if (filter == 'equipment') {
                this.addEquipment(dataReturned['data']['data'][0]);
              }
            }
          } else {
          }
          this.modalState = false;
        }
      });
      return await modal.present().then(() => {});
    }
    // this.cdr.detectChanges();
  }

  addEquipment(eqp) {
    console.log(eqp);

    const equipment = this.formBuilder.group({
      name: [
        eqp.item_name || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      nos: [1, [Validators.required, Validators.min(1)]],
    });

    const isLastEntryValid =
      this.equipmentList.length === 0 ||
      (this.equipmentList.at(this.equipmentList.length - 1) as FormGroup).valid;

    if (isLastEntryValid) {
      this.equipmentList.push(equipment);

      this.equipment_list.push({
        name: equipment.get('name')?.value || '',
        nos: equipment.get('nos')?.value || 0,
        code: eqp.item_id,
      });
    } else {
      this.auth.showToast('Fill the empty equipment entry!');
    }

    console.log(this.equipment_list);
  }

  addEquipment3(e_data) {
    console.log(e_data);
    const equipment = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      nos: ['', [Validators.required, Validators.min(1)]],
    });
    if (this.equipmentList.length == 0) {
      this.equipmentList.push(equipment);
      equipment.get('name')?.setValue(e_data.item_name);
      this.equipment_list.push({
        name: equipment.get('name')?.value || '',
        nos: equipment.get('nos')?.value || null,
        code: e_data.code,
      });
    } else {
      const lastEquipment = this.equipmentList.at(
        this.equipmentList.length - 1
      ) as FormGroup;
      if (lastEquipment.valid) {
        this.equipmentList.push(equipment);
        equipment.get('name')?.setValue(e_data.item_name);
        this.equipment_list.push({
          name: equipment.get('name')?.value || '',
          nos: equipment.get('nos')?.value || 0,
          code: e_data.code,
        });
      } else {
        this.auth.showToast('Fill the empty equipment entry!');
      }
    }

    console.log(this.equipment_list);
  }

  removeEquipment(index: number) {
    // if (this.equipmentList.length > 1) {
    this.equipmentList.removeAt(index);
    this.equipment_list.splice(index, 1);
    this.cdr.detectChanges();
    console.log(this.equipment_list);
    // } else if (this.equipmentList.length === 1) {
    //   if (
    //     this.equipment_list[0]['name'] == '' &&
    //     this.equipment_list[0]['nos'] == null
    //   ) {
    //     this.auth.showToast('No entries to remove!');
    //   }
    //   this.equipmentList.at(index).reset();
    //   this.equipment_list[index] = { name: '', nos: 0 };
    // }
  }

  patchEquipmentList(index) {
    const equipment = this.equipmentList.at(index);
    this.equipment_list[index] = {
      name: equipment.get('name')?.value || '',
      nos: equipment.get('nos')?.value || 0,
      code: this.equipment_list[index]['code'],
    };

    console.log(this.equipment_list);
  }

  get equipmentList(): FormArray {
    return this.form_4.get('equipmentList') as FormArray;
  }

  ionViewDidEnter() {
    this.getDepartments();
    this.getSources();
    this.getDistricts();
    this.getEquipments();
  }

  getDepartments() {
    this.api
      .get_inventory_departments()
      .pipe(take(1))
      .subscribe((data) => {
        this.department_data = data;
        console.log('department data..', this.department_data);
      });
  }

  getSources() {
    this.api
      .get_inventory_sources()
      .pipe(take(1))
      .subscribe((data) => {
        this.source_data = data;
        console.log('sources data..', this.source_data);
      });
  }

  getDistricts() {
    this.api
      .get_master_districts()
      .pipe(take(1))
      .subscribe((data) => {
        this.districts_data = data;
        console.log('district data..', this.districts_data);
      });
  }

  getTaluks() {
    console.log('dis id', this.district_id);
    this.firka_id = null;
    this.village_id = null;
    this.latitude = null;
    this.longitude = null;

    var temp = this.districts_data.findIndex(
      (x) => x.district_id == this.district_id
    );
    this.district_name = this.districts_data[temp]['district_name'];

    this.taluks_data = [];
    this.taluk_id = null;
    this.api
      .get_master_taluks_by_district_id({ id: this.district_id })
      .pipe(take(1))
      .subscribe((data) => {
        this.taluks_data = data;
        console.log('taluk data..', this.taluks_data);
      });
  }

  getFirkas() {
    this.village_id = null;
    this.latitude = null;
    this.longitude = null;

    var temp = this.taluks_data.findIndex((x) => x.taluk_id == this.taluk_id);
    this.taluk_name = this.taluks_data[temp]['taluk_name'];

    console.log('taluk id', this.taluk_id);
    this.firkas_data = [];
    this.firka_id = null;

    this.api
      .get_master_firkas_by_taluk_id({ id: this.taluk_id })
      .pipe(take(1))
      .subscribe((data) => {
        this.firkas_data = data;
        console.log('firka data..', this.firkas_data);
      });
  }

  getVillages() {
    // this.latitude = null;
    // this.longitude = null;

    var temp = this.firkas_data.findIndex((x) => x.firka_id == this.firka_id);
    this.firka_name = this.firkas_data[temp]['firka_name'];

    console.log('firk id', this.firka_id);
    this.villages_data = [];
    this.village_id = null;

    this.api
      .get_master_villages_by_firka_id({ id: this.firka_id })
      .pipe(take(1))
      .subscribe((data) => {
        this.villages_data = data;
        console.log('village data..', this.villages_data);
      });
  }

  villageOnChange() {
    var temp = this.villages_data.findIndex(
      (x) => x.village_id == this.village_id
    );
    this.village_name = this.villages_data[temp]['village_name'];
  }
  
  getEquipments() {
    this.api
      .get_equipment_list()
      .pipe(take(1))
      .subscribe((data) => {
        this.equipment_data = data;
        console.log('equipment data..', this.equipment_data);
      });
  }

  prevSlide() {
    this.swiper.swiperRef.slidePrev();
  }

  onSwiper(swiper) {
    // console.log(swiper);
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

  async validateAddress() {
    var address =
      this.plot_no +
      ', ' +
      this.street +
      ', ' +
      this.city +
      ', ' +
      this.state +
      ', ' +
      this.country +
      ', ' +
      this.postal_code;
    if (!this.locModalState) {
      this.locModalState = true;
      const modal = await this.modalController.create({
        component: LocPickerPage,
        componentProps: { address: address, taluk_id: this.taluk_id },
      });
      modal.onDidDismiss().then((dataReturned) => {
        console.log(dataReturned);
        if (dataReturned != null) {
          console.log(dataReturned);
          if (
            dataReturned['data'] != undefined &&
            dataReturned['data'] != null
          ) {
            if (dataReturned['data']['latitude'] != undefined) {
              this.latitude = dataReturned['data']['latitude'];
            } else this.latitude = null;

            if (dataReturned['data']['longitude'] != undefined) {
              this.longitude = dataReturned['data']['longitude'];
            } else this.longitude = null;
          }
        }

        this.locModalState = false;
      });
      return await modal.present().then(() => {});
    }
  }

  invalidateAddress() {
    this.latitude = null;
    this.longitude = null;
  }

  updateName(val, name) {
    console.log(val, name);
    switch (val) {
      case 'dis':
        this.district_name = name;
        return;
      case 'tal':
        this.taluk_name = name;
        return;
      case 'fir':
        this.firka_name = name;
        return;
      case 'vil':
        this.village_name = name;
        return;
    }
  }
}

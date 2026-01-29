import { Component, Input, OnInit } from '@angular/core';
import {
  NavController,
  ModalController,
  LoadingController,
} from '@ionic/angular';
import { ApiService } from 'src/app/providers/api.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
})
export class FilterPage implements OnInit {
  @Input() filter_name: any;
  @Input() data: any;
  @Input() transformed_data: any = [];
  lang: string;
  role;
  filtereditems: any;
  searchTerm: string = '';
  filtered_list;

  constructor(
    private api: ApiService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {
    this.lang = localStorage.getItem('language');
    this.role = localStorage.getItem('role');
  }

  ngOnInit() {
    this.transformData();
  }

  transformData() {
    console.log('data', this.data);
    console.log('filter_name', this.filter_name);

    const transformationMap: {
      [key: string]: (arr: any[]) => { id: any; content: any }[];
    } = {
      district: (arr: District[]) =>
        arr.map((datum) => ({
          id: datum.district,
          content: datum.district_name,
        })),
      // source: (arr: Source[]) =>
      //   arr.map((datum) => ({
      //     id: datum.source_code,
      //     content: datum.source_name,
      //   })),
      // equipment: (arr: Equipment[]) =>
      //   arr.map((datum) => ({
      //     id: datum.item_code,
      //     content: datum.item_name,
      //   })),
    };

    const transformFunction = transformationMap[this.filter_name];

    if (transformFunction) {
      this.transformed_data = transformFunction(this.data);
      this.filtered_list = this.transformed_data;
    } else {
      console.warn('Unknown filter_name:', this.filter_name);
      this.transformed_data = [];
      this.filtered_list = [];
    }

    console.log('transformed', this.transformed_data);
  }

  async filterItems(ev: any) {
    this.searchTerm = ev.target.value;
    console.log('searchterm', this.searchTerm);
    if (this.searchTerm && this.searchTerm.trim() != '') {
      var s_term = this.searchTerm;
      this.filtered_list = await this.transformed_data.filter((item) => {
        return item.content.toLowerCase().includes(s_term.toLowerCase());
      });
      console.log(this.filtered_list);
    } else {
      this.filtered_list = this.data;
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
  closeModalwithData(data) {
    this.modalCtrl.dismiss({
      data: data,
    });
  }

  submit(item) {
    console.log('selected', item);
    item = [item];
    switch (this.filter_name) {
      case 'department':
        const updateData = (
          arr: Filter[]
        ): { dept_id: any; dept_name: any }[] => {
          return arr.map((datum) => ({
            dept_id: datum.id,
            dept_name: datum.content,
          }));
        };
        var data = updateData(item);
        this.closeModalwithData(data);
        return;
      case 'source':
        const updateData2 = (
          arr: Filter[]
        ): { source_code: any; source_name: any }[] => {
          return arr.map((datum) => ({
            source_code: datum.id,
            source_name: datum.content,
          }));
        };
        var data2 = updateData2(item);
        this.closeModalwithData(data2);
        return;
      case 'equipment':
        const updateData3 = (
          arr: Filter[]
        ): { item_id: any; item_name: any }[] => {
          return arr.map((datum) => ({
            item_id: datum.id,
            item_name: datum.content,
          }));
        };
        var data3 = updateData3(item);
        this.closeModalwithData(data3);
        return;
    }
  }
}
interface District {
  district: any;
  district_name: any;
}
interface Station {
  station: any;
  station_name: any;
}
interface Equipment {
  item_code: any;
  item_name: any;
}
interface Filter {
  id: any;
  content: any;
}

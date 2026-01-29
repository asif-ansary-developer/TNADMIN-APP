import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-memorandum',
  templateUrl: './memorandum.page.html',
  styleUrls: ['./memorandum.page.scss'],
})
export class MemorandumPage implements OnInit {
  pages = [
    {
      title: 'Agriculture',
      route: 'agriculture',
    },
    {
      title: 'Bridges',
      route: 'bridges',
    },
    {
      title: 'Culverts',
      route: 'culverts',
    },
    {
      title: 'Horticulture',
      route: 'horticulture',
    },
    {
      title: 'Human Injury',
      route: 'human-injury',
    },
    {
      title: 'Human Loss',
      route: 'human-loss',
    },
    {
      title: 'Hut Damage',
      route: 'hut-damage',
    },
    {
      title: 'Livestock Loss',
      route: 'cattle-loss',
    },
    // {
    //   title: 'Relief Camp',
    //   route: 'relief-camp',
    // },
    {
      title: 'Roads',
      route: 'road',
    },
    {
      title: 'Sericulture',
      route: 'sericulture',
    },
  ];
  constructor(private navCtrl: NavController) {}

  routeTo(route) {
    this.navCtrl.navigateForward('memorandum/' + route);
  }

  close() {
    console.log('lick');
    this.navCtrl.navigateBack('home');
  }
  ngOnInit() {}
}

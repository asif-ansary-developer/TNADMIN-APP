import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-respond',
  templateUrl: './respond.page.html',
  styleUrls: ['./respond.page.scss'],
})
export class RespondPage implements OnInit {
  emergency_call_data: any;
  loading;
  action;
  note_open_state = false;
  constructor(public router: Router) {
    if (router.getCurrentNavigation().extras.state) {
      this.emergency_call_data =
        this.router.getCurrentNavigation().extras.state?.param;
      console.log(this.emergency_call_data);
    }
  }
  ngOnInit() {}

  openAction() {
    this.note_open_state = !this.note_open_state;
  }
}

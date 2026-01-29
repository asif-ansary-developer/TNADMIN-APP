import { ApiService } from 'src/app/providers/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import {
  AnimationController,
  GestureController,
  LoadingController,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { AuthService } from 'src/app/guard/auth.service';
import { RefreshHelperService } from 'src/app/helper/refresh-helper.service';

@Component({
  selector: 'app-ticket-raiser-action',
  templateUrl: './ticket-raiser-action.page.html',
  styleUrls: ['./ticket-raiser-action.page.scss'],
})
export class TicketRaiserActionPage
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('note', { read: ElementRef }) note_element: ElementRef;
  @ViewChild('content', { read: ElementRef }) content: ElementRef;
  @ViewChild('textbox') textbox;
  ticket_id;
  lastest_element;
  reply_text;
  _moment;
  p_role;
  note_open_state = false;
  preview_state = false;
  public ticket: any;

  canDismiss = true;
  preview_img = null;

  username;
  today;
  refreshSubscription;

  constructor(
    private api: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loadingCtrl: LoadingController,
    private http: HttpClient,
    private authService: AuthService,
    public modalCtrl: ModalController,
    private navCtrl: NavController,
    private gestureCtrl: GestureController,
    private platform: Platform,
    private refreshHelper: RefreshHelperService,
    private animationCtrl: AnimationController,
    private route: ActivatedRoute
  ) {
    const navParams = this.router.getCurrentNavigation().extras.state;
    if (navParams) {
      console.log('ticket_id', JSON.stringify(navParams));
      this.ticket_id = navParams.ticket_id;
      navParams.p_role
        ? (this.p_role = navParams.p_role)
        : (this.p_role = 'rasier');
      console.log('ticket_id', this.ticket_id);
    } else {
      this.route.queryParams.subscribe((params) => {
        this.ticket_id = params['ticket_id'];
        console.log('Received Ticket ID from Query Params:', this.ticket_id);
      });
    }

    this.username = localStorage.getItem('username');

    this._moment = moment;

    this.today = moment().utcOffset('+05:30').format('yyyy-MM-DD');
  }

  ngOnInit() {
    this.refreshSubscription = this.refreshHelper
      .refresh()
      .subscribe((needRefresh) => {
        console.log('refresh', needRefresh);
        if (needRefresh) {
          this.display();
          this.ngAfterViewInit();
          this.refreshHelper.needPageRefresh.next(false);
        }
      });
  }

  ngAfterViewInit(): void {
    this.scrollToLastedEL();
  }

  ionViewDidEnter() {
    this.display();
  }

  sendReminder() {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        spinner: 'dots',
        cssClass: 'loading-backdrop',
        mode: 'ios',
      })
      .then((loadingEl) => {
        // loadingEl.present();
        var params = JSON.stringify({
          ticket_id: this.ticket_id,
          msg_from: '1',
          text: '_|||Reminder',
          extra_param: 'update_thread_cwt',
        });
        console.log('param', params);
        this.api
          .post_admin(params)
          .pipe(take(1))
          .subscribe(
            (data) => {
              console.log(data);
              this.getTicket();
              // loadingEl.dismiss();
            },
            (err) => {
              console.log('ERROR!: ', err);
              // loadingEl.dismiss();
              this.authService.showAlert('Failed!', 'Try again');
            }
          );
      });
  }

  sendMsgAsRaiser() {
    if (this.reply_text === '' || this.reply_text == null) {
      console.log('empty', this.reply_text);
    } else {
      var text = this.reply_text;
      this.loadingCtrl
        .create({
          keyboardClose: true,
          spinner: 'dots',
          cssClass: 'loading-backdrop',
          mode: 'ios',
        })
        .then((loadingEl) => {
          // loadingEl.present();
          var params = JSON.stringify({
            ticket_id: this.ticket_id,
            msg_from: '1',
            text: text,
            extra_param: 'update_thread_cwt',
          });
          console.log('param', params);
          this.api
            .post_admin(params)
            .pipe(take(1))
            .subscribe(
              (data) => {
                console.log(data);
                this.getTicket();
                // loadingEl.dismiss();
              },
              (err) => {
                console.log('ERROR!: ', err);
                // loadingEl.dismiss();
                this.authService.showAlert('Failed!', 'Try again');
              }
            );
        });

      this.textbox.setFocus();
      this.reply_text = null;
    }
  }

  getTicket() {
    let params = {
      t_id: this.ticket_id,
    };
    this.api.get_cw_ticket_by_id(params).subscribe((data) => {
      if (data) {
        this.ticket = data[0];
      }
      console.log('ticket ..', this.ticket);

      this.scrollToLastedEL();
    });

    this.reply_text = null;
  }

  scrollToLastedEL() {
    this.cdr.detectChanges();
    this.lastest_element = null;
    this.lastest_element = this.content.nativeElement.children;

    if (this.lastest_element != undefined && this.lastest_element != null) {
      const timer = setInterval(() => {
        if (this.lastest_element.length != 0) {
          this.lastest_element[
            this.lastest_element.length - 1
          ].scrollIntoView();
          clearInterval(timer);
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.modalCtrl.getTop() != undefined) {
      this.modalCtrl.dismiss();
    }

    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  closeTicDetails() {
    this.note_open_state = false;
  }

  openTicDetails() {
    if (!this.note_open_state) this.note_open_state = true;
  }

  display() {
    this.getTicket();
  }
  doRefresh(event) {
    this.display();
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  handleModalDismiss(e) {
    if (this.preview_state) {
      this.preview_state = false;
      this.preview_img = null;
    }
  }
}

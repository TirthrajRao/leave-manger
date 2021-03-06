import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LeaveService } from '../../services/leave.service';
import { config } from '../../config';
import { AlertController } from '@ionic/angular';
// import { $ } from 'protractor';
declare var $: any;



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  UserDetail;
  path = config.baseMediaUrl;
  todaysLeave: any = [];
  todayLeavesCount;
  approvedLeaves: any = [];
  approvedLeavesCount;
  pendingLeaves: any = [];
  pendingLeavesCount;
  isReasonVisible: boolean = false;
  leaveReason;
  loading: boolean = false;
  constructor(public _userService: UserService,
    public _leaveService: LeaveService,
    public alertController: AlertController) { }

  ngOnInit() {
    this.getUserDetail()
    this.todayNotPresentUser();
    $(".nav-item  a ").click(function () {
      $(".nav-item  a").removeClass("active");
      $(this).addClass("active");
    });
  }

  /**
   * Get Single user details
   */
  getUserDetail() {
    this._userService.getUserDetail().subscribe((res: any) => {
      console.log("user details==========>", res.data);
      this.UserDetail = res.data;
      console.log("data=======>", res.data, this.UserDetail);
      // this.UserDetail.dob = this.UserDetail.dob.split("T")[0];
    }, err => {
      console.log(err);
    })
  }

  /**
   * Get user whose not present today
   */
  todayNotPresentUser() {
    this.loading = true;
    this.approvedLeaves = [];
    this.pendingLeaves = [];
    console.log("today not present user")
    this._leaveService.todayNotPresentUser().subscribe((res: any) => {
      console.log("not present user", res)
      $('.step_one').css({ 'display': 'block' });
      $('.step_two').css({ 'display': 'none' })
      $('.step_three').css({ 'display': 'none' })
      this.todaysLeave = res.data;
      this.todayLeavesCount = res.data.length;
      this.loading = false;
      console.log("not present user=======>", res, this.todaysLeave, this.todayLeavesCount);
    }, err => {
      console.log(err);
      this.loading = false;
    })
  }

  /**
   * Get Approved Leaves
   */
  getApprovedLeaves() {
    console.log("approved leaves");
    this.pendingLeaves = [];
    this.todaysLeave = [];
    this.loading = true;
    this._leaveService.getApprovedLeaves().subscribe((res: any) => {
      this.approvedLeaves = res.data;
      this.approvedLeavesCount = res.data.length;
      $('.step_two').css({ 'display': 'block' });
      $('.step_one').css({ 'display': 'none' });
      $('.step_three').css({ 'display': 'none' })
      // $('.step_one').css({ 'display': 'none' });
      this.loading = false;
      console.log("approved leaves", res, this.approvedLeaves, this.approvedLeavesCount);
    }, err => {
      console.log("err");
      this.loading = false;
    })
  }

  /**
   * Get Pending Leaves
   */
  getPendingLeaves() {
    console.log("Pending leaves");
    this.loading = true;
    this.approvedLeaves = [];
    this.todaysLeave = [];
    this._leaveService.getPendingLeaves().subscribe((res: any) => {

      $('.step_two').css({ 'display': 'none' });
      $('.step_one').css({ 'display': 'none' });
      $('.step_three').css({ 'display': 'block' })
      this.pendingLeaves = res.data;
      this.pendingLeavesCount = res.data.length;
      this.loading = false;
      console.log("Pending leaves", res, this.pendingLeaves, this.pendingLeavesCount);
    }, err => {
      console.log("err");
      this.loading = false;
    })
  }
  /**
   * Display leave Reason
   */
  async presentAlert(data) {
    console.log(data);
    let date = data.date
    let extrahours = data.extraHours;
    console.log(extrahours)
    let finalDate = date.date + '/' + date.month + '/' + date.year;
    console.log(finalDate);
    console.log(date)
    const alert = await this.alertController.create({
      message: '<b>' + 'Reason :' + '</b>' + ' ' + data.reason + '<br>' + '<b>' + 'Date :' + '</b>' + ' ' + finalDate + '<br>' + (data.extraHours !== null && data.extraHours !== '' ? '<b>' + 'Compensation:' + '</b>' + data.extraHours : ''),
      buttons: ['OK'],
      cssClass: 'alertCustomCss'
    });
    await alert.present();
  }


  getNoOfDays(days) {
    // console.log(days);
    if (days < 0) {
      return 'You have no leaves..'
    } else {
      const noOfDays = Math.floor(days / 8)
      // console.log("Days", noOfDays);
      const noOfhours = days % 8;
      // console.log("noOfhours", noOfhours);
      if (!noOfDays && noOfhours) {
        if (noOfhours > 1) {
          return noOfhours + ' hours'
        } else {
          return noOfhours + ' hour'
        }
      } else if (noOfDays && !noOfhours) {
        if (noOfDays > 1) {
          return noOfDays + ' Days'
        } else {
          return noOfDays + ' Day'
        }
      } else {
        if (noOfDays > 1 && noOfhours > 1) {
          return noOfDays + ' Days ' + noOfhours + ' hours';
        } else if (noOfDays == 1 && noOfhours == 1) {
          return noOfDays + ' Day ' + noOfhours + ' hour';
        } else if (noOfDays > 1 && noOfhours == 1) {
          return noOfDays + ' Days ' + noOfhours + ' hour';
        } else {
          return noOfDays + ' Day ' + noOfhours + ' hours';
        }
      }
    }
  }

}

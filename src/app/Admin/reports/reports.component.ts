import { Component, OnInit } from '@angular/core';
import { LeaveService } from '../../services/leave.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
declare var $: any;
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  monthLeaveForm: FormGroup;
  yearLeaveForm: FormGroup;
  monthLeaveCount;
  yearLeaveCount;
  monthLeaveReport: any = [];
  yearLeaveReport: any = [];
  loading: boolean = false;
  constructor(public _leaveService: LeaveService) {
    this.monthLeaveForm = new FormGroup({
      month: new FormControl('', [Validators.required]),
    });

    this.yearLeaveForm = new FormGroup({
      year: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit() { }

  /**
   * Get month leave report
   * @param {object} data 
   */
  getMonthLeaveReport(data) {
    $(".no-leave-of-year").css({ 'display': 'none' });
    this.yearLeaveReport = [];
    this.loading = true;
    console.log(data);
    this._leaveService.getMonthLeaveReport(data).subscribe((res: any) => {
      this.monthLeaveReport = res.data;
      this.monthLeaveCount = res.data.length;
      if (!res.data.length) {
        $('.no-leaves-of-month').css({ 'display': 'block' });
      }
      console.log("month report=======>", res);
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    })
  }

  /**
   * Get year leave report
   * @param {Object} data 
   */
  getYearLeaveReport(data) {
    $('.no-leaves-of-month').css({ 'display': 'none' });
    this.monthLeaveReport = [];
    console.log(data);
    this.loading = true;
    this._leaveService.getYearLeaveReport(data).subscribe((res: any) => {
      this.yearLeaveReport = res.data;
      this.yearLeaveCount = res.data.length;
      if (!res.data.length) {
        $('.no-leave-of-year').css({ 'display': 'block' })
      }
      console.log("year report=======>", this.yearLeaveReport, this.yearLeaveCount);
      this.loading = false;
    }, err => {
      console.log(err);
      this.loading = false;
    })
  }

}

import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { CommonApi } from 'src/app/lib/services/api/common.api';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Constants, ApiUrls } from '../../config/constants';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authState = new BehaviorSubject(false);
  userData;

  constructor(
    private router: Router,
    private commonService: CommonService,
    private commonApi: CommonApi,
    public platform: Platform,
    public storgeService: StorageService
  ) {
    this.platform.ready().then(() => {
      this.ifLoggedIn();
    });
  }

  checkAuthStatus() {
    return this.authState.value;
  }

  ifLoggedIn() {
    var auth = this.storgeService.get(Constants.AUTH_TOKEN);
    if (auth) {
      this.authState.next(true);
      this.userData = auth;
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.storgeService.set(Constants.AUTH_TOKEN, '');
  }

  sendOtp(phone) {
    return this.commonApi
      .postData(ApiUrls.auth.sendOtp+'/sms', phone)
      .pipe(catchError((err) => this.errorHandler(err)));
  }

  verifyOtp(otp) {
    return this.commonApi
      .postData(ApiUrls.auth.verifyOtp, otp)
      .pipe(catchError((err) => this.errorHandler(err)));
  }

  resendOtp(otp, type) {
    const url =
      type === 'sms' ? '/sms' : '/call';
    return this.commonApi
      .postData(ApiUrls.auth.sendOtp+url, otp)
      .pipe(catchError((err) => this.errorHandler(err)));
  }

  private errorHandler(err) {
    this.commonService.toast(err.status == 200?err.error.error ? err.error.error.message : err.error.message:err.error.error.message);
    return throwError(err);
  }

  logOutUser(): void {
    console.log("Inside Service Logout");
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private otpResponse: any = null;

  setOtpResponse(data: any): void {
    this.otpResponse = data;
    localStorage.setItem('otpResponse', JSON.stringify(data));
  }

  getOtpResponse(): any {
    if (!this.otpResponse) {
      const stored = localStorage.getItem('otpResponse');
      if (stored) {
        this.otpResponse = JSON.parse(stored);
      }
    }
    return this.otpResponse;
  }

  clearOtpResponse(): void {
    this.otpResponse = null;
    localStorage.removeItem('otpResponse');
  }
}

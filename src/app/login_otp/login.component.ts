import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthStateService } from '../auth-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  otp: string = '';
  showOtp: boolean = false;
  isLoading: boolean = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authState: AuthStateService
  ) {}

  ngOnInit(): void {
    const storedEmail = localStorage.getItem('otpEmail');
    if (storedEmail) {
      this.email = storedEmail;
    }
  }

  toggleOtpVisibility(): void {
    this.showOtp = !this.showOtp;
  }

  onLogin(): void {
    if (!this.email || !this.otp) {
      Swal.fire({ title: 'Please fill all fields', icon: 'warning' });
      return;
    }

    this.isLoading = true;

    const payload = { email: this.email, otp: this.otp };
    this.apiService.verifyOtp(payload).subscribe({
      next: (res: any) => {
        console.log('OTP verified:', res);

        // 🔐 Save OTP response to auth state
        this.authState.setOtpResponse(res);

        Swal.fire({
          title: 'OTP Verified Successfully',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
          timerProgressBar: true,
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (error: any) => {
        console.error('OTP verification failed:', error);
        Swal.fire({
          title: 'Invalid OTP. Please try again.',
          icon: 'error',
        });
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onReset(): void {
    this.email = '';
    this.otp = '';
    this.showOtp = false;
    this.authState.clearOtpResponse();
  }
}

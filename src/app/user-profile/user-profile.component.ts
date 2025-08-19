import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // ✅ Import SweetAlert2

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const payload = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };

      this.http.post<any>('http://localhost:5959/contactManagementSystem/api/users/loginUserip', payload)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            console.log('Login successful:', response);

            // ✅ Show SweetAlert2 popup with redirect
            Swal.fire({
              title: 'OTP Sent Successfully!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
              timerProgressBar: true
            }).then(() => {
              this.route.navigate(['/otp-sent']);
            });
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Login failed:', error);
            Swal.fire('Login Failed', 'Please check credentials.', 'error');
          }
        });
    } else {
      Swal.fire('Invalid Form', 'Please fill all required fields.', 'warning');
    }
  }
}

// import { Component } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-sent',
  templateUrl: './otp-sent.component.html',
  styleUrls: ['./otp-sent.component.css']
})
export class OtpSentComponent {


  
  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigate(['/loginOTP']); // replace '/next-page' with your route
    }, 1000); // 10000 milliseconds = 10 seconds
  }

}

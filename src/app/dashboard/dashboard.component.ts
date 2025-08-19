import { Component, OnInit } from '@angular/core';
import { AuthStateService } from '../auth-state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userId: string = '';
  message: string = '';

  // ✅ Menu toggle states
  isContactMenuOpen: boolean = false;
  isNotebookMenuOpen: boolean = false;

  constructor(
    private authState: AuthStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const response = this.authState.getOtpResponse();

    if (response?.result?.length) {
      const resultData = response.result[0];

      this.userId = resultData['UserId :'] || resultData.UserId || resultData.userId || '';
      this.message = resultData.message || '';

      if (this.userId) {
        localStorage.setItem('userId', this.userId);
        localStorage.setItem('userMessage', this.message);
      }
    } else {
      const storedUserId = localStorage.getItem('userId');
      const storedMessage = localStorage.getItem('userMessage');
      if (storedUserId) this.userId = storedUserId;
      if (storedMessage) this.message = storedMessage;
    }

    console.log('User ID:', this.userId);
    console.log('Message:', this.message);
  }

  // 📂 Toggle Contact menu with auto-close Notebook menu
  toggleContactMenu(): void {
    if (this.isContactMenuOpen) {
      this.isContactMenuOpen = false;
    } else {
      this.isContactMenuOpen = true;
      this.isNotebookMenuOpen = false;
    }
  }

  // 📂 Toggle Notebook menu with auto-close Contact menu
  toggleNotebookMenu(): void {
    if (this.isNotebookMenuOpen) {
      this.isNotebookMenuOpen = false;
    } else {
      this.isNotebookMenuOpen = true;
      this.isContactMenuOpen = false;
    }
  }

  // ➕ Add New Contact
  onNewContactClick(): void {
    this.router.navigate(['/add-contact']);
  }

  // ➕ Add New Note
  onNewNoteClick(): void {
    console.log('New Note clicked');
    this.router.navigate(['/note-book']);
  }

  // 📖 Show Contact
  onViewContactClick(): void {
    this.router.navigate(['/view-contact']);
  }

  // 📖 Show Notes
  onViewNotesClick(): void {
    console.log('View Notes clicked');
    this.router.navigate(['/view-notes']);
  }
}

import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from '../api.service';  // adjust the import path

@Component({
  selector: 'app-note-book',
  templateUrl: './note-book.component.html',
  styleUrls: ['./note-book.component.css']
})
export class NoteBookComponent implements OnInit {

  currentDateTime!: string;
  currentDayName!: string;
  showNotes: boolean = false;

  userId: string | null = null;
  message: string | null = null;

  noteTitle: string = '';   // Title input
  notes: string = '';       // Notes content
  errorMessage: string = ''; 
  successMessage: string = ''; 

  constructor(private apiService: ApiService) {}  // Inject ApiService

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    this.message = localStorage.getItem('message');  

    this.updateDateTime();
    setInterval(() => {
      this.updateDateTime();
    }, 1000);
  }

  updateDateTime() {
    const now = new Date();
    this.currentDateTime = now.toLocaleString();
    this.currentDayName = now.toLocaleDateString(undefined, { weekday: 'long' });
  }

  toggleNotes(): void {
    this.showNotes = !this.showNotes;
    this.errorMessage = '';
    this.successMessage = '';
  }

  saveNotes(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.noteTitle.trim()) {
      this.errorMessage = 'Please enter a title.';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: this.errorMessage,
      });
      return;
    }

    if (!this.notes.trim()) {
      this.errorMessage = 'Please write some notes before saving.';
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: this.errorMessage,
      });
      return;
    }

    if (!this.userId) {
      this.errorMessage = 'User ID is missing. Please login again.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: this.errorMessage,
      });
      return;
    }

    // Compose data to send to API
    const data = {
      userId: this.userId,
      noteStatus: "ACTIVE",           // Hardcoded as requested
      noteBookName: this.noteTitle,
      noteBookContent: this.notes
    };

    // Call ApiService to save note
    this.apiService.AddNewNotes(data).subscribe({
      next: (response) => {
        console.log('Note saved successfully:', response);

        // Save locally as well
        localStorage.setItem('userNoteTitle', this.noteTitle);
        localStorage.setItem('userNotes', this.notes);

        // Clear inputs
        this.noteTitle = '';
        this.notes = '';

        this.successMessage = 'Notes saved successfully!';
        Swal.fire({
          icon: 'success',
          title: 'Saved!',
          text: this.successMessage,
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.error('Error saving note:', error);
        this.errorMessage = 'Failed to save note. Please try again later.';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.errorMessage,
        });
      }
    });
  }

  resetNotes(): void {
    this.noteTitle = '';
    this.notes = '';
    this.errorMessage = '';
    this.successMessage = '';
  }
}

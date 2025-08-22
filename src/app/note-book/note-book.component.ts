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

  // 🔹 File attachment
  attachedFile: File | null = null;
  attachedFileName: string | null = null;
  attachedFileType: string | null = null;
  attachedFileBase64: string | null = null;

  constructor(private apiService: ApiService) { }

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

  // 🔹 Handle file selection and convert to Base64
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.attachedFile = file;
      this.attachedFileName = file.name;
      this.attachedFileType = file.type;

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        this.attachedFileBase64 = base64String;
      };
      reader.readAsDataURL(file);
    }
  }

  // 🔹 Remove attached file
  resetFile(): void {
    this.attachedFile = null;
    this.attachedFileName = null;
    this.attachedFileType = null;
    this.attachedFileBase64 = null;

    // also reset the <input type="file">
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  saveNotes(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.noteTitle.trim()) {
      this.errorMessage = 'Please enter a title.';
      Swal.fire({ icon: 'error', title: 'Oops...', text: this.errorMessage });
      return;
    }

    if (!this.notes.trim()) {
      this.errorMessage = 'Please write some notes before saving.';
      Swal.fire({ icon: 'error', title: 'Oops...', text: this.errorMessage });
      return;
    }

    if (!this.userId) {
      this.errorMessage = 'User ID is missing. Please login again.';
      Swal.fire({ icon: 'error', title: 'Error', text: this.errorMessage });
      return;
    }

    // 🔹 Prepare JSON body including Base64 file
    const data = {
      userId: this.userId,
      noteStatus: 'ACTIVE',
      noteBookName: this.noteTitle,
      noteBookContent: this.notes,
      attachmentBase64: this.attachedFileBase64,
      attachmentFileName: this.attachedFileName,
      attachmentFileType: this.attachedFileType
    };

    this.apiService.AddNewNotes(data).subscribe({
      next: (response) => {
        console.log('Note saved successfully:', response);

        // Save locally
        localStorage.setItem('userNoteTitle', this.noteTitle);
        localStorage.setItem('userNotes', this.notes);

        // Clear inputs
        this.resetNotes();

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
        Swal.fire({ icon: 'error', title: 'Error', text: this.errorMessage });
      }
    });
  }

  resetNotes(): void {
    this.noteTitle = '';
    this.notes = '';
    this.attachedFile = null;
    this.attachedFileName = null;
    this.attachedFileType = null;
    this.attachedFileBase64 = null;
    this.errorMessage = '';
    this.successMessage = '';

    // also clear file input element
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}

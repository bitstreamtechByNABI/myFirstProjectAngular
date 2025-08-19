import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from '../api.service';

// Note interface
interface Note {
  userId: string;
  noteStatus: string;
  noteBookName: string;
  noteBookContent: string;
}

@Component({
  selector: 'app-view-notes',
  templateUrl: './view-notes.component.html',
  styleUrls: ['./view-notes.component.css']
})
export class ViewNotesComponent implements OnInit {
  title: string = 'All Notes';

  notes: any[] = [];
  currentIndex: number = 0;

  // Pagination
  pageSize: number = 3;
  currentGroup: number = 0;

  showAll: boolean = false;
  errorMessage: string = '';

  // Show/hide content
  contentVisible: boolean = false;

  // Email Box
  email: string = '';
  showEmailBox: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId') || '12345';
    this.loadNotes(userId);
  }

  // ✅ Load Notes from API
  loadNotes(userId: string) {
    this.apiService.ViewNotes(userId).subscribe({
      next: (response: any) => {
        console.log("Full API Response:", response);

        if (!response || !Array.isArray(response.content)) {
          Swal.fire('Error', 'Invalid API response.', 'error');
          return;
        }

        this.notes = (response.content as Note[]).map((note: Note) => ({
          content: note.noteBookContent,
          title: note.noteBookName,
          color: this.generateRandomColor()
        }));

        this.currentIndex = 0;
        this.currentGroup = 0;
        this.contentVisible = false;
      },
      error: (err) => {
        console.error('Error fetching notes:', err);
        Swal.fire('Error', 'Failed to load notes from server.', 'error');
      }
    });
  }

  // ✅ Current Note Getter
  get currentNote() {
    return this.notes[this.currentIndex] || null;
  }

  // ✅ Total Groups for Pagination
  get totalGroups() {
    return Math.ceil(this.notes.length / this.pageSize);
  }

  pagedPages(): number[] {
    const start = this.currentGroup * this.pageSize;
    return Array.from({ length: this.pageSize }, (_, i) => start + i + 1)
      .filter(page => page <= this.notes.length);
  }

  // ✅ Navigation Controls
  nextGroup() {
    if (this.currentGroup < this.totalGroups - 1) {
      this.currentGroup++;
      this.currentIndex = this.currentGroup * this.pageSize;
      this.contentVisible = false;
    }
  }

  prevGroup() {
    if (this.currentGroup > 0) {
      this.currentGroup--;
      this.currentIndex = this.currentGroup * this.pageSize;
      this.contentVisible = false;
    }
  }

  nextNote() {
    if (this.currentIndex < this.notes.length - 1) {
      this.currentIndex++;
      this.currentGroup = Math.floor(this.currentIndex / this.pageSize);
      this.contentVisible = false;
    }
  }

  prevNote() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.currentGroup = Math.floor(this.currentIndex / this.pageSize);
      this.contentVisible = false;
    }
  }

  goTo(index: number) {
    if (index >= 0 && index < this.notes.length) {
      this.currentIndex = index;
      this.currentGroup = Math.floor(index / this.pageSize);
      this.contentVisible = false;
    }
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  // ✅ Random Pastel Color Generator
  private generateRandomColor() {
    const colors = [
      '#FFEBEE', '#E8F5E9', '#E3F2FD',
      '#FFF3E0', '#F3E5F5', '#E0F7FA', '#FFFDE7'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // ✅ Show / Hide Note Content
  showNoteContent() {
    if (!this.currentNote) return;
    localStorage.setItem('NoteId', this.currentNote.title);
    this.contentVisible = true;
  }

  hideNoteContent() {
    this.contentVisible = false;
  }

  // ✅ Go to Specific Page
  goToPageNumber(page: any) {
    const parsed = Math.floor(Number(page));
    const totalPages = this.notes.length;

    if (!Number.isFinite(parsed)) {
      this.errorMessage = 'Please enter a valid page number.';
      return;
    }

    if (parsed < 1 || parsed > totalPages) {
      this.errorMessage = `This page (${parsed}) is not available.`;
      return;
    }

    this.errorMessage = '';
    this.goTo(parsed - 1);
  }

  // ✅ Open Email Box
  openEmailBox() {
    this.showEmailBox = true;
  }

  // ✅ Open Quick Share Popup
  openEmailPopup() {
    Swal.fire({
      title: 'Quick Share',
      input: 'email',
      inputPlaceholder: 'Enter email address',
      showCancelButton: true,
      confirmButtonText: 'Send',
      cancelButtonText: 'Cancel',
      preConfirm: (email) => {
        if (!email) {
          Swal.showValidationMessage('Please enter an email');
        }
        return email;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.email = result.value;
        this.sendEmail();
      }
    });
  }

  // ✅ Send Email with Note
  sendEmail() {
    if (!this.email) {
      Swal.fire('Error', 'Please enter an email address.', 'warning');
      return;
    }

    const subject = this.currentNote?.title || "No Title";
    const body = this.currentNote?.content || "No Content";

    const mailtoLink = `mailto:${this.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;

    this.showEmailBox = false;
    this.email = '';
  }

  // ✅ Cancel Email
  cancelEmail() {
    this.showEmailBox = false;
    this.email = '';
  }
}

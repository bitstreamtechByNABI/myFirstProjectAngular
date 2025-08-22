import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from '../api.service';
import { finalize } from 'rxjs/operators';

// Updated Note interface including attachments
interface Note {
  userId: string;
  noteStatus: string;
  noteBookName: string;
  noteBookContent: string;
  attachment?: string;       // Base64 string
  attachmentName?: string;
  attachmentType?: string;
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

  // Loading flag
  isSending: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId') || '12345';
    this.loadNotes(userId);
  }

  // Load notes from API
  loadNotes(userId: string) {
    this.apiService.ViewNotes(userId).subscribe({
      next: (response: any) => {
        console.log("Full API Response:", response);

        if (!response || !Array.isArray(response.content)) {
          Swal.fire('Error', 'Invalid API response.', 'error');
          return;
        }

        // Map response to notes array including attachments
        this.notes = (response.content as Note[]).map((note: Note) => ({
          content: note.noteBookContent,
          title: note.noteBookName,
          color: this.generateRandomColor(),
          attachment: note.attachment,
          attachmentName: note.attachmentName,
          attachmentType: note.attachmentType
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

  get currentNote() {
    return this.notes[this.currentIndex] || null;
  }

  get totalGroups() {
    return Math.ceil(this.notes.length / this.pageSize);
  }

  pagedPages(): number[] {
    const start = this.currentGroup * this.pageSize;
    return Array.from({ length: this.pageSize }, (_, i) => start + i + 1)
      .filter(page => page <= this.notes.length);
  }

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

  private generateRandomColor() {
    const colors = [
      '#FFEBEE', '#E8F5E9', '#E3F2FD',
      '#FFF3E0', '#F3E5F5', '#E0F7FA', '#FFFDE7'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  showNoteContent() {
    if (!this.currentNote) return;
    localStorage.setItem('NoteId', this.currentNote.title);
    this.contentVisible = true;
  }

  hideNoteContent() {
    this.contentVisible = false;
  }

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

  // ✅ Updated sendEmail method to include attachment
  sendEmail() {
    if (!this.email) {
      Swal.fire('Error', 'Please enter an email address.', 'warning');
      return;
    }

    const subject = this.currentNote?.title || "No Title";
    const body = this.currentNote?.content || "No Content";

    // Prepare FormData for multipart/form-data
    const formData = new FormData();
    formData.append('to', this.email);
    formData.append('subject', subject);
    formData.append('body', body);

    // Attach current note attachment if available
    if (this.currentNote?.attachment && this.currentNote.attachmentName) {
      const byteCharacters = atob(this.currentNote.attachment);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: this.currentNote.attachmentType || 'application/octet-stream' });
      formData.append('attachment', blob, this.currentNote.attachmentName);
    }

    this.isSending = true;

    Swal.fire({
      title: 'Sending...',
      text: 'Please wait while your email is being sent.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.apiService.sendNotes(formData)
      .pipe(finalize(() => this.isSending = false))
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Email Sent!',
            text: 'Your note was sent successfully 🎉',
            timer: 2000,
            showConfirmButton: false
          });
          this.showEmailBox = false;
          this.email = '';
        },
        error: (err) => {
          console.error("Error sending email:", err);
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Could not send email. Try again later.',
            showConfirmButton: true
          });
        }
      });
  }

  cancelEmail() {
    this.showEmailBox = false;
    this.email = '';
  }

  // ✅ New method to download attachments
  downloadAttachment() {
    if (!this.currentNote?.attachment || !this.currentNote.attachmentName) return;

    const link = document.createElement('a');
    link.href = 'data:' + (this.currentNote.attachmentType || 'application/octet-stream') + ';base64,' + this.currentNote.attachment;
    link.download = this.currentNote.attachmentName;
    link.click();
  }

  // ✅ Optional: Upload new attachment for email
  onAttachmentChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        this.currentNote.attachment = base64;
        this.currentNote.attachmentName = file.name;
        this.currentNote.attachmentType = file.type;
      };
      reader.readAsDataURL(file);
    }
  }
}

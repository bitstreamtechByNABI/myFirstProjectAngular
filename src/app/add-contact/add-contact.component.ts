import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent {
  contactForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  selectedImageFile: File | null = null;
  isLoading = false;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  limitPhoneLength(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 10);
    this.contactForm.get('phoneNumber')?.setValue(input.value, { emitEvent: false });
  }

  onSubmit(): void {
    if (!this.contactForm.valid) {
      Swal.fire('Invalid Input', '❌ Please fill all fields correctly.', 'warning');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      Swal.fire('Error', '❌ User ID not found. Please log in again.', 'error');
      return;
    }

    const contactData = {
      ...this.contactForm.value,
      userId: userId
    };

    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(contactData)], { type: 'application/json' }));

    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    this.isLoading = true;

    this.apiService.AddNewContact(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.contactForm.reset();
        this.imagePreview = null;
        this.selectedImageFile = null;
        if (this.fileInput) this.fileInput.nativeElement.value = '';

        Swal.fire({
          title: 'Contact Added Successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      },
      error: (error) => {
        console.error('❌ Error saving contact:', error);
        this.isLoading = false;
        Swal.fire('Error', '❌ Failed to save contact.', 'error');
      }
    });
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent {
  contactForm: FormGroup;
  isLoading = false;
  imagePreview: string | ArrayBuffer | null = null;
  serverMessage: string = ''; // ✅ ensure it's typed and initialized
  isErrorMessage: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')]
      ],
      profileImage: [null]
    });
  }

  // Limit phone number length manually
  limitPhoneLength(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }
  }

  // Image upload handler
  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.contactForm.patchValue({ profileImage: file });
      this.contactForm.get('profileImage')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Submit form
  onSubmit() {
    if (this.contactForm.invalid) {
      this.serverMessage = 'Please fill all required fields correctly.';
      this.isErrorMessage = true;
      return;
    }

    this.isLoading = true;
    this.serverMessage = '';

    const formData = new FormData();
    Object.entries(this.contactForm.value).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    this.http.post('/api/contacts', formData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.isErrorMessage = false;
        this.serverMessage = res?.message || 'Contact saved successfully!';
        this.contactForm.reset();
        this.imagePreview = null;
      },
      error: (err) => {
        this.isLoading = false;
        this.isErrorMessage = true;
        if (err.error?.lastName) {
          this.serverMessage = err.error.lastName;
        } else if (err.error?.message) {
          this.serverMessage = err.error.message;
        } else {
          this.serverMessage = 'An unexpected error occurred.';
        }
      }
    });
  }
}

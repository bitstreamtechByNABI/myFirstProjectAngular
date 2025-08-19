import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.component.html',
  styleUrls: ['./view-contact.component.css']
})
export class ViewContactComponent implements OnInit {
  userId: string | null = null;
  contactData: any = { contactList: [] };
  allContacts: any[] = [];

  nameFilter: string = '';
  phoneFilter: string = '';

  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.loadContacts();
    }
  }

  loadContacts(): void {
    this.isLoading = true;
    this.apiService.GetUserContact(this.userId!).subscribe({
      next: (res) => {
        this.allContacts = res.phoneNumberList.contactList || [];
        this.contactData.contactList = [...this.allContacts];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching contact data:', err);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.contactData.contactList = this.allContacts.filter((contact: any) => {
      const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
      const phone = (contact.phoneNumber || '').toLowerCase();
      return (
        fullName.includes(this.nameFilter.toLowerCase()) &&
        phone.includes(this.phoneFilter.toLowerCase())
      );
    });
  }

  blockNonNumeric(event: KeyboardEvent): void {
    const charCode = event.charCode || event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  filterOnlyNumbers(event: any): void {
    const rawValue = event.target.value;
    const numericValue = rawValue.replace(/\D/g, '');
    this.phoneFilter = numericValue;
    this.applyFilters();
  }

  blockNonAlphabet(event: KeyboardEvent): void {
    const char = event.key;
    if (!/^[a-zA-Z\s]*$/.test(char)) {
      event.preventDefault();
    }
  }

  filterOnlyLetters(event: any): void {
    const rawValue = event.target.value;
    const alphabeticValue = rawValue.replace(/[^a-zA-Z\s]/g, '');
    this.nameFilter = alphabeticValue;
    this.applyFilters();
  }

  editContact(contact: any) {
    Swal.fire({
      title: 'Edit Contact',
      html: `
        <input id="firstName" class="swal2-input" placeholder="First Name" value="${contact.firstName}">
        <input id="lastName" class="swal2-input" placeholder="Last Name" value="${contact.lastName}">
        <input id="email" class="swal2-input" placeholder="Email" value="${contact.email}">
        <input type="file" id="imageFile" class="swal2-file">
        <img id="previewImage" src="${this.getImageSrc(contact.image)}" style="max-width:100px;margin-top:10px;border-radius:8px;" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Update',
      didOpen: () => {
        const fileInput = document.getElementById('imageFile') as HTMLInputElement;
        fileInput?.addEventListener('change', () => {
          const file = fileInput.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              (document.getElementById('previewImage') as HTMLImageElement).src = e.target.result;
            };
            reader.readAsDataURL(file);
          }
        });
      },
      preConfirm: () => {
        const fileInput = document.getElementById('imageFile') as HTMLInputElement;
        return new Promise((resolve) => {
          if (fileInput?.files && fileInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                firstName: (document.getElementById('firstName') as HTMLInputElement).value,
                lastName: (document.getElementById('lastName') as HTMLInputElement).value,
                email: (document.getElementById('email') as HTMLInputElement).value,
                image: (reader.result as string).split(',')[1] // Remove prefix
              });
            };
            reader.readAsDataURL(fileInput.files[0]);
          } else {
            resolve({
              firstName: (document.getElementById('firstName') as HTMLInputElement).value,
              lastName: (document.getElementById('lastName') as HTMLInputElement).value,
              email: (document.getElementById('email') as HTMLInputElement).value,
              image: contact.image // keep old image
            });
          }
        });
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.updateContact(contact.phoneNumber, result.value).subscribe({
          next: () => {
            Swal.fire('Updated!', 'Contact has been updated successfully.', 'success');
            this.loadContacts();
          },
          error: (err) => {
            Swal.fire('Error!', 'There was an error updating the contact.', 'error');
            console.error('Error updating contact:', err);
          }
        });
      }
    });
  }

  deleteContact(contact: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${contact.firstName} ${contact.lastName}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deletedContact(contact.phoneNumber).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Contact has been deleted successfully.', 'success');
            this.contactData.contactList = this.contactData.contactList.filter(
              (c: any) => c.phoneNumber !== contact.phoneNumber
            );
            this.allContacts = this.allContacts.filter(
              (c: any) => c.phoneNumber !== contact.phoneNumber
            );
          },
          error: (err) => {
            Swal.fire('Error!', 'There was an error deleting the contact.', 'error');
            console.error('Error deleting contact:', err);
          }
        });
      }
    });
  }

  getImageSrc(base64: string | null | undefined): string {
    if (!base64 || base64.trim() === '') {
      return 'assets/Default-welcomer.png';
    }
    return `data:image/png;base64,${base64}`;
  }
  
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  
  questionOptions: string[] = [
    "What is your pet's name?",
    "What is your mother’s maiden name?",
    "What is your favorite food?",
    "What city were you born in?",
    "What is your favorite color?"
  ];

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', Validators.required],
        country: ['', Validators.required]
      }),
      securityQuestions: this.fb.array([
        this.fb.group({
          question: ['', Validators.required],
          answer: ['', Validators.required]
        })
      ])
    });
  }

  get securityQuestions(): FormArray {
    return this.registerForm.get('securityQuestions') as FormArray;
  }

  addSecurityQuestion() {
    this.securityQuestions.push(
      this.fb.group({
        question: ['', Validators.required],
        answer: ['', Validators.required]
      })
    );
  }

  removeSecurityQuestion(index: number) {
    if (this.securityQuestions.length > 1) {
      this.securityQuestions.removeAt(index);
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      console.log('Form submitted successfully!', formData);

      this.apiService.registerUser(formData).subscribe({
        next: (res) => {
          console.log('Server response:', res);
          Swal.fire({
            title: res['result'][0]['message'] || 'Registered Successfully',
            icon: "success",
          });
        },
        error: (err) => {
          console.error('Error submitting form:', err);
          Swal.fire({
            title: 'Error',
            text: 'Something went wrong.',
            icon: "error",
          });
        }
      });
    } else {
      console.log('Please fill all required fields correctly.');
      this.registerForm.markAllAsTouched();
    }
  }
}

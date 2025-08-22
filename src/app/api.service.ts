import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root' // best practice instead of using @Injectable() without any config
})
export class ApiService {

  constructor(private https: HttpClient) { }

  // baseUrl1 = 'http://localhost:5959/';
  baseUrl2= 'http://localhost:5959/';

  // Master Start
  registerUser(data:any): Observable<any> {
    return this.https.post(`${this.baseUrl2}contactManagementSystemapi/users/register`, data); 
  }

  verifyOtp(data: any): Observable<any> {
  const url = `${this.baseUrl2}contactManagementSystem/api/users/verify-otp`;
  return this.https.post(url, data);
}

 AddNewContact(data: any): Observable<any> {
  const url = `${this.baseUrl2}contactManagementSystem/api/users/phone/no/register`;
  return this.https.post(url, data);
}

GetUserContact(userId: string): Observable<any> {
  const url = `${this.baseUrl2}contactManagementSystem/api/users/phonebook/get-user-details?userId=${userId}`;
  return this.https.get(url);
}


deletedContact(phoneNumber: string): Observable<any> {
  const url = `${this.baseUrl2}contactManagementSystem/api/users/phonebook/soft-delete/${phoneNumber}`;
  return this.https.put(url, {}); 
}

updateContact(phoneNumber: string, body: any): Observable<any> {
  const url = `${this.baseUrl2}contactManagementSystem/api/users/phonebook/update-by-phone/${phoneNumber}`;
  return this.https.put(url, body); 
}
// http://localhost:5959/contactManagementSystem/phonebook/noted/create

 AddNewNotes(data: any): Observable<any> {
  const url = `${this.baseUrl2}contactManagementSystem/phonebook/noted/create`;
  return this.https.post(url, data);
}

ViewNotes(userId: string): Observable<any> {
  const url = `${this.baseUrl2}contactManagementSystem/phonebook/noted/noted/get?userId=${userId}`;
  return this.https.get(url);
}

sendNotes(data: any): Observable<any> {
  const url = `${this.baseUrl2}contactManagementSystem/api/email/sendWithAttachment`;
  return this.https.post(url, data);
}


}

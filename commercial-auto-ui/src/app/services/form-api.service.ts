import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  errorMessages?: { [key: string]: string };
}

export interface FormConfig {
  title: string;
  description: string;
  fields: FormField[];
}

@Injectable({
  providedIn: 'root'
})
export class FormApiService {
  private apiUrl = 'http://localhost:8080/api/forms';

  constructor(private http: HttpClient) {}

  /**
   * Fetch registration form configuration from API
   */
  getRegistrationFormConfig(): Observable<FormConfig> {
    return this.http.get<FormConfig>(`${this.apiUrl}/registration`);
  }

  /**
   * Submit registration form data
   */
  submitRegistration(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registration/submit`, formData);
  }
}

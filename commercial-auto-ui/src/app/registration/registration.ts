import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface FormField {
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

interface FormConfig {
  title: string;
  description: string;
  fields: FormField[];
}

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule],
  templateUrl: './registration.html',
  styleUrl: './registration.scss'
})
export class Registration implements OnInit {
  registrationForm!: FormGroup;
  formConfig: FormConfig | null = null;
  isLoading = false;
  submitSuccess = false;
  submitError = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get form configuration from route resolver
    this.route.data.subscribe(data => {
      if (data['formConfig']) {
        this.formConfig = data['formConfig'];
        this.buildForm();
      }
    });
  }

  private buildForm(): void {
    if (!this.formConfig) return;

    const formControls: { [key: string]: any } = {};

    this.formConfig.fields.forEach(field => {
      const validators = [];

      // Add required validator
      if (field.required) {
        validators.push(Validators.required);
      }

      // Add minLength validator
      if (field.minLength) {
        validators.push(Validators.minLength(field.minLength));
      }

      // Add maxLength validator
      if (field.maxLength) {
        validators.push(Validators.maxLength(field.maxLength));
      }

      // Add min validator (for number fields)
      if (field.min !== undefined) {
        validators.push(Validators.min(field.min));
      }

      // Add max validator (for number fields)
      if (field.max !== undefined) {
        validators.push(Validators.max(field.max));
      }

      // Add pattern validator
      if (field.pattern) {
        validators.push(Validators.pattern(field.pattern));
      }

      // Add email validator for email fields
      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      // For checkboxes with requiredTrue validation
      const defaultValue = field.type === 'checkbox' ? false : '';
      formControls[field.name] = [defaultValue, validators];
    });

    this.registrationForm = this.fb.group(formControls);
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.submitSuccess = false;
    this.submitError = false;

    // Get form data
    const formData = this.registrationForm.value;
    console.log('Form submitted:', formData);

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.submitSuccess = true;
      this.registrationForm.reset();
    }, 1000);
  }

  getFieldError(fieldName: string): string {
    const field = this.registrationForm.get(fieldName);
    const fieldConfig = this.formConfig?.fields.find(f => f.name === fieldName);

    if (field && field.touched && field.errors && fieldConfig?.errorMessages) {
      const errorMessages = fieldConfig.errorMessages;

      // Check for each error type and return the corresponding message from API
      if (field.errors['required'] && errorMessages['required']) {
        return errorMessages['required'];
      }
      if (field.errors['requiredTrue'] && errorMessages['requiredTrue']) {
        return errorMessages['requiredTrue'];
      }
      if (field.errors['email'] && errorMessages['email']) {
        return errorMessages['email'];
      }
      if (field.errors['minlength'] && errorMessages['minLength']) {
        return errorMessages['minLength'];
      }
      if (field.errors['maxlength'] && errorMessages['maxLength']) {
        return errorMessages['maxLength'];
      }
      if (field.errors['pattern'] && errorMessages['pattern']) {
        return errorMessages['pattern'];
      }
      if (field.errors['min'] && errorMessages['min']) {
        return errorMessages['min'];
      }
      if (field.errors['max'] && errorMessages['max']) {
        return errorMessages['max'];
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registrationForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}

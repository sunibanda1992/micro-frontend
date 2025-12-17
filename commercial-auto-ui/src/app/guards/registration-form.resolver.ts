import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FormApiService, FormConfig } from '../services/form-api.service';

/**
 * Resolver to fetch registration form configuration before the route activates
 * This ensures the form data is available when the component loads
 */
export const registrationFormResolver: ResolveFn<FormConfig | null> = (
  route,
  state
): Observable<FormConfig | null> => {
  const formApiService = inject(FormApiService);

  return formApiService.getRegistrationFormConfig().pipe(
    map((apiResponse: any) => {
      // Map API response to our FormConfig interface
      const formConfig: FormConfig = {
        title: apiResponse.formTitle || 'User Registration',
        description: apiResponse.formDescription || 'Complete the form below',
        fields: apiResponse.fields.map((field: any) => {
          // Determine the field type based on controlType and inputType
          let type = field.controlType;
          if (field.controlType === 'input') {
            type = field.inputType; // text, email, password, tel, number
          }

          // Extract validation rules and error messages
          const validations = field.validations || [];
          const required = validations.some((v: any) => v.name === 'required' || v.name === 'requiredTrue');
          const minLengthValidation = validations.find((v: any) => v.name === 'minLength');
          const maxLengthValidation = validations.find((v: any) => v.name === 'maxLength');
          const patternValidation = validations.find((v: any) => v.name === 'pattern');
          const minValidation = validations.find((v: any) => v.name === 'min');
          const maxValidation = validations.find((v: any) => v.name === 'max');

          // Build error messages map from validations
          const errorMessages: { [key: string]: string } = {};
          validations.forEach((v: any) => {
            if (v.errorMessage) {
              errorMessages[v.name] = v.errorMessage;
            }
          });

          return {
            name: field.name,
            label: field.label,
            type: type,
            required: required,
            placeholder: field.placeholder,
            options: field.options,
            minLength: minLengthValidation?.value,
            maxLength: maxLengthValidation?.value,
            min: minValidation?.value,
            max: maxValidation?.value,
            pattern: patternValidation?.value,
            errorMessages: errorMessages
          };
        })
      };

      return formConfig;
    }),
    catchError(error => {
      console.error('Error fetching registration form config:', error);
      // Return null on error - component can handle missing data
      return of(null);
    })
  );
};

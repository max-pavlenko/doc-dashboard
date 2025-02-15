import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  toFormData<T extends Record<string, any>>(data: T): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  }
}

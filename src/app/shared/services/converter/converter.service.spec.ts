import { TestBed } from '@angular/core/testing';

import { ConverterService } from './converter.service';

describe('ConverterService', () => {
  let service: ConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConverterService);
  });

  it('should convert object to FormData correctly', () => {
    const data = { name: 'John Doe', age: '30' };
    const formData = service.toFormData(data);

    expect(formData.get('name')).toBe(data.name);
    expect(formData.get('age')).toBe(data.age);
  });

  it('should handle empty object', () => {
    const formData = service.toFormData({});
    expect(formData.entries().next().done).toBeTrue();
  });
});

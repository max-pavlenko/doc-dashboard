import { ErrorMessagePipe } from './error-message.pipe';
import { ERROR_MESSAGES, ErrorMessageMap } from '../../tokens/error-messages.token';
import { TestBed } from '@angular/core/testing';

describe('ErrorMessagePipe', () => {
  let pipe: ErrorMessagePipe;
  let errorsMap: ErrorMessageMap;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorMessagePipe,
        {
          provide: ERROR_MESSAGES,
          useValue: {
            required: () => 'This field is required',
            minlength: ({ requiredLength }) => `Minimum length is ${requiredLength}`,
          } satisfies ErrorMessageMap,
        },
      ],
    });

    pipe = TestBed.inject(ErrorMessagePipe);
    errorsMap = TestBed.inject(ERROR_MESSAGES);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the correct error message for "required" error', () => {
    const error = { required: true };
    expect(pipe.transform(error)).toBe(errorsMap['required']({}));
  });

  it('should return the correct error message for "minlength" error', () => {
    const error = { minlength: { requiredLength: '5' } };
    expect(pipe.transform(error)).toBe(errorsMap['minlength'](error.minlength));
  });

  it('should return "Invalid field" if error key is missing', () => {
    const error = { unknownError: true };
    expect(pipe.transform(error)).toBe('Invalid field');
  });

  it('should merge additional data into error message', () => {
    const error = { minlength: { requiredLength: '5' } };
    expect(pipe.transform(error, { customValue: 10 })).toBe(errorsMap['minlength'](error.minlength));
  });
});

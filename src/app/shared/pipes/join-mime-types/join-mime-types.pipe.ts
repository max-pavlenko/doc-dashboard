import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinMimeTypes',
})
export class JoinMimeTypesPipe implements PipeTransform {
  transform(mimeTypes: string[]): unknown {
    return mimeTypes.map((type) => `.${type.toLowerCase()}`).join(', ');
  }
}

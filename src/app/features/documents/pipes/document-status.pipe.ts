import { inject, Pipe, PipeTransform } from '@angular/core';
import { DocumentFilterStatus } from '@feature/documents/models/document.model';
import { DOCUMENT_STATUS_MAP } from '@shared/tokens/document-statuses';

@Pipe({
  name: 'documentStatus',
})
export class DocumentStatusPipe implements PipeTransform {
  statusMap = inject(DOCUMENT_STATUS_MAP);

  transform(status: DocumentFilterStatus): string {
    return this.statusMap[status];
  }
}

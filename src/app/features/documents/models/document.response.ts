import { AppDocument } from '@feature/documents/models/document.model';
import { PaginationContainer } from '@shared/models/query.model';
import { ChangeDocumentStatusRequest } from '@feature/documents/models/document.request';

export interface DocumentsQueryResponse extends PaginationContainer<AppDocument> {}

export interface PatchDocumentResponse {
  name: string;
}

export type ChangeDocumentStatusResponse = Pick<ChangeDocumentStatusRequest, 'status'>;

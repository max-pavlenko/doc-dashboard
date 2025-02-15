import { DocumentStatus } from '@feature/documents/models/document.model';
import { Unique } from '@shared/models/common.model';
import { Paginatable, Sortable } from '@shared/models/query.model';

export interface CreateDocumentRequest {
  status: DocumentStatus.Draft | DocumentStatus.ReadyForReview;
  file: string;
  name: string;
}

export type QueryDocumentsRequest = Paginatable &
  Partial<{ creatorId: string; creatorEmail: string; status: DocumentStatus; sort: Sortable }>;

export interface PatchDocumentRequest extends Unique {
  name?: string;
}

export interface ChangeDocumentStatusRequest extends Unique {
  status: DocumentStatus.UnderReview | DocumentStatus.Approved | DocumentStatus.Declined;
}

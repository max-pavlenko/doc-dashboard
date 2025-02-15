import { User } from '@feature/auth/models/auth.model';

export interface DocumentCreator extends User {
  description?: string;
}

// to prevent clash with TS built-in Document
export interface AppDocument {
  creator?: DocumentCreator;
  id: string;
  name: string;
  status: DocumentStatus;
  updatedAt: string;
  createdAt: string;
}

export interface AppDocumentFile extends Omit<AppDocument, 'creator'> {
  fileUrl: string;
}

export enum DocumentStatus {
  Draft = 'DRAFT',
  Revoked = 'REVOKE',
  ReadyForReview = 'READY_FOR_REVIEW',
  UnderReview = 'UNDER_REVIEW',
  Approved = 'APPROVED',
  Declined = 'DECLINED',
}

export type DocumentFilterStatus = DocumentStatus | 'all';

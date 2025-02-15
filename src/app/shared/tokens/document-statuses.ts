import { InjectionToken } from '@angular/core';
import { DocumentFilterStatus, DocumentStatus } from '@feature/documents/models/document.model';

export type DocumentStatusMap = Record<DocumentFilterStatus, string>;

export const DEFAULT_STATUS_MAP: DocumentStatusMap = {
  [DocumentStatus.Draft]: 'Draft',
  [DocumentStatus.Revoked]: 'Revoked',
  [DocumentStatus.ReadyForReview]: 'Ready for Review',
  [DocumentStatus.UnderReview]: 'Under Review',
  [DocumentStatus.Approved]: 'Approved',
  [DocumentStatus.Declined]: 'Declined',
  all: 'All',
};

export const DOCUMENT_STATUS_MAP = new InjectionToken('Document status map', {
  providedIn: 'root',
  factory: () => DEFAULT_STATUS_MAP,
});

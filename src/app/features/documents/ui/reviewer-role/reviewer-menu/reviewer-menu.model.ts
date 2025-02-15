import { DocumentStatus } from '@feature/documents/models/document.model';

export type ReviewerMenuEvent = DocumentStatus.Declined | DocumentStatus.Approved | DocumentStatus.UnderReview;

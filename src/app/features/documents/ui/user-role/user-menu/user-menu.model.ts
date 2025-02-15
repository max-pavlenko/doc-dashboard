import { AppDocument, DocumentStatus } from '@feature/documents/models/document.model';
import { EntityMutation } from '@shared/models/common.model';

export type UserMenuEventType = EntityMutation | DocumentStatus.Revoked | DocumentStatus.ReadyForReview;

export type UserMenuEvent = { document: AppDocument; action: UserMenuEventType };

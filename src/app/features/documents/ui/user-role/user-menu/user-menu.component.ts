import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenuItem } from '@angular/material/menu';
import { AppDocument, DocumentStatus } from '@feature/documents/models/document.model';
import { MatTooltip } from '@angular/material/tooltip';
import { EditDocumentModalComponent } from '@feature/documents/ui/edit-document-modal/edit-document-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, switchMap } from 'rxjs';
import { ConfirmModalComponent } from '@shared/ui/molecules/_modals/confirm-modal/confirm-modal.component';
import { ConfirmModalData } from '@shared/ui/molecules/_modals/confirm-modal/confirm-modal.model';
import { DocumentService } from '@feature/documents/services/document.service';
import { EditDocumentModalData } from '@feature/documents/ui/edit-document-modal/edit-document-modal.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserMenuEvent, UserMenuEventType } from '@feature/documents/ui/user-role/user-menu/user-menu.model';
import { DynamicOptionsMenu, EntityMutation, PermissionMap } from '@shared/models/common.model';
import { PdfViewService } from '@shared/ui/organisms/pdf-view/services/pdf-view.service';

@Component({
  selector: 'app-documents-user-menu',
  imports: [MatIcon, MatMenuItem, MatTooltip],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMenuComponent implements DynamicOptionsMenu<UserMenuEventType> {
  dialog = inject(MatDialog);
  documentService = inject(DocumentService);
  dr = inject(DestroyRef);
  snackBar = inject(MatSnackBar);
  pdfViewService = inject(PdfViewService);

  document = input.required<AppDocument>();
  mutated = output<UserMenuEvent>();

  tooltipTexts = {
    edit: "Applicable only if the status of the document is 'Draft' or 'Revoked'",
    revoke: "Applicable only if the status of the document is 'Ready for review'",
    delete: "Applicable only if the status of the document is 'Draft' or 'Revoked'",
    readyForReview: "Applicable only if the status of the document is 'Draft'",
  };
  protected readonly EntityMutation = EntityMutation;
  protected readonly DocumentStatus = DocumentStatus;

  isActionAvailable(action: UserMenuEventType) {
    const permissionMap: PermissionMap<UserMenuEventType> = {
      [EntityMutation.Edit]: () =>
        [DocumentStatus.Draft, DocumentStatus.Revoked].some((status) => this.document().status === status),
      [EntityMutation.Delete]: () =>
        [DocumentStatus.Draft, DocumentStatus.Revoked].some((status) => this.document().status === status),
      [DocumentStatus.Revoked]: () => this.document().status === DocumentStatus.ReadyForReview,
      [DocumentStatus.ReadyForReview]: () => this.document().status === DocumentStatus.Draft,
    };
    return permissionMap[action]();
  }

  onEdit() {
    const dialogRef = this.dialog.open(EditDocumentModalComponent, {
      data: { document: this.document() } satisfies EditDocumentModalData,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap((doc) => this.documentService.patchDocument({ ...doc, id: this.document().id }).pipe(map(() => doc))),
        takeUntilDestroyed(this.dr),
      )
      .subscribe((doc) => {
        this.snackBar.open(`Document '${this.document().name}' has been updated`, 'OK');
        this.mutated.emit({ document: { ...this.document(), ...doc }, action: EntityMutation.Edit });
      });
  }

  onRevoke() {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: 'Revoke document',
        description: `Are you sure you want to revoke the document '${this.document().name}'?`,
      } satisfies ConfirmModalData,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.documentService.revokeDocument({ id: this.document().id })),
        takeUntilDestroyed(this.dr),
      )
      .subscribe(() => {
        this.snackBar.open(`Document '${this.document().name}' has been revoked`, 'OK');
        this.mutated.emit({ document: { ...this.document(), status: DocumentStatus.Revoked }, action: DocumentStatus.Revoked });
      });
  }

  onDelete() {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: 'Delete document',
        description: `Are you sure you want to delete the document '${this.document().name}'?`,
        icon: 'delete',
      } satisfies ConfirmModalData,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.documentService.deleteDocument({ id: this.document().id })),
        takeUntilDestroyed(this.dr),
      )
      .subscribe(() => {
        this.snackBar.open(`Document '${this.document().name}' has been deleted`, 'OK');
        this.mutated.emit({ document: this.document(), action: EntityMutation.Delete });
      });
  }

  markAsReadyForReview() {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: 'Mark as ready for review',
        description: `Are you sure you want to mark the document '${this.document().name}' as ready for review?`,
      } satisfies ConfirmModalData,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap(() => this.documentService.sendDocumentToReview({ id: this.document().id })),
        takeUntilDestroyed(this.dr),
      )
      .subscribe(() => {
        this.snackBar.open(`Document '${this.document().name}' is ready for a review`, 'OK');
        this.mutated.emit({
          document: { ...this.document(), status: DocumentStatus.ReadyForReview },
          action: DocumentStatus.ReadyForReview,
        });
      });
  }

  openFile() {
    this.documentService
      .getOne(this.document().id)
      .pipe(takeUntilDestroyed(this.dr))
      .subscribe(({ fileUrl }) => {
        this.pdfViewService.document$.next(fileUrl);
      });
  }
}

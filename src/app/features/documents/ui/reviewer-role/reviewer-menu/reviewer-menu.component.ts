import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
import { MatMenuItem } from '@angular/material/menu';
import { AppDocument, DocumentStatus } from '@feature/documents/models/document.model';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmModalComponent } from '@shared/ui/molecules/_modals/confirm-modal/confirm-modal.component';
import { filter, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentService } from '@feature/documents/services/document.service';
import { ReviewerMenuEvent } from '@feature/documents/ui/reviewer-role/reviewer-menu/reviewer-menu.model';
import { ConfirmModalData } from '@shared/ui/molecules/_modals/confirm-modal/confirm-modal.model';
import { MatTooltip } from '@angular/material/tooltip';
import { DocumentStatusPipe } from '@feature/documents/pipes/document-status.pipe';
import { DynamicOptionsMenu, PermissionMap } from '@shared/models/common.model';
import { PdfViewService } from '@shared/ui/organisms/pdf-view/services/pdf-view.service';

@Component({
  selector: 'app-documents-reviewer-menu',
  imports: [MatMenuItem, MatIcon, MatTooltip],
  templateUrl: './reviewer-menu.component.html',
  styleUrl: './reviewer-menu.component.scss',
  providers: [DocumentStatusPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewerMenuComponent implements DynamicOptionsMenu<ReviewerMenuEvent> {
  dialog = inject(MatDialog);
  dr = inject(DestroyRef);
  snackBar = inject(MatSnackBar);
  documentStatusPipe = inject(DocumentStatusPipe);
  documentService = inject(DocumentService);
  pdfViewService = inject(PdfViewService);

  document = input.required<AppDocument>();
  statusChanged = output<ReviewerMenuEvent>();
  tooltipTexts = {
    underReview: "Applicable only if the status of the document is 'Ready for review'",
    approve: "Applicable only if the status of the document is 'Under a review'",
    decline: "Applicable only if the status of the document is 'Under a review'",
  };
  protected readonly DocumentStatus = DocumentStatus;

  isActionAvailable(action: ReviewerMenuEvent) {
    const permissionMap: PermissionMap<ReviewerMenuEvent> = {
      [DocumentStatus.UnderReview]: () => this.document().status === DocumentStatus.ReadyForReview,
      [DocumentStatus.Approved]: () => this.document().status === DocumentStatus.UnderReview,
      [DocumentStatus.Declined]: () => this.document().status === DocumentStatus.UnderReview,
    };
    return permissionMap[action]();
  }

  onStatusChange(status: ReviewerMenuEvent) {
    const dialogRef = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: 'Change document status',
        description: `
          Are you sure you want to change the status of the document '${this.document().name}' to '${this.documentStatusPipe.transform(status)}'?
        `,
      } satisfies ConfirmModalData,
    });
    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap(() => status === DocumentStatus.UnderReview && this.openFile()),
        switchMap(() => this.documentService.changeDocumentStatus({ id: this.document().id, status })),
        takeUntilDestroyed(this.dr),
      )
      .subscribe(() => {
        this.snackBar.open(`Document '${this.document().name}' status has been changed to ${status}`, 'OK');
        this.statusChanged.emit(status);
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

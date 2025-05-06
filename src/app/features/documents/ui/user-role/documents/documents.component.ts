import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatChip } from '@angular/material/chips';
import { DocumentStatusPipe } from '@feature/documents/pipes/document-status.pipe';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { AppDocument, DocumentFilterStatus, DocumentStatus } from '@feature/documents/models/document.model';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, filter, finalize, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddDocumentModalComponent } from '@feature/documents/ui/add-document-modal/add-document-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { DocumentService } from '@feature/documents/services/document.service';
import { AuthService } from '@feature/auth/services/auth.service';
import { UserMenuComponent } from '@feature/documents/ui/user-role/user-menu/user-menu.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserMenuEvent } from '@feature/documents/ui/user-role/user-menu/user-menu.model';
import { EntityMutation } from '@shared/models/common.model';
import { PaginationService } from '@shared/services/pagination/pagination.service';
import { PdfViewComponent } from '@shared/ui/organisms/pdf-view/pdf-view.component';
import { SortService } from '@shared/services/sort/sort.service';
import { PaginatorComponent } from '@shared/ui/organisms/paginator/paginator.component';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { LoadingTableComponent } from '@shared/ui/molecules/loading-table/loading-table.component';
import { TIME_MS } from '@shared/constants/common.constants';
import { MobileCardComponent } from '@shared/ui/molecules/mobile-card/mobile-card.component';

@Component({
  selector: 'app-documents',
  imports: [
    MatTable,
    MatLabel,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatCell,
    MatHeaderCell,
    MatChip,
    DocumentStatusPipe,
    DatePipe,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRowDef,
    MatRow,
    MatIconButton,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatSortHeader,
    MatSort,
    MatFormField,
    MatSuffix,
    ReactiveFormsModule,
    MatButton,
    NgTemplateOutlet,
    UserMenuComponent,
    PdfViewComponent,
    PaginatorComponent,
    MatOption,
    MatSelect,
    LoadingTableComponent,
    MobileCardComponent,
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [PaginationService, SortService],
})
export default class DocumentsComponent implements OnInit {
  dr = inject(DestroyRef);
  dialog = inject(MatDialog);
  documentService = inject(DocumentService);
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  paginationService = inject(PaginationService);
  sortService = inject(SortService);

  isLoading = signal(true);

  dataSource = new MatTableDataSource<AppDocument>();
  displayedColumns = ['name', 'status', 'updatedAt', 'actions'];
  documentStatuses: DocumentFilterStatus[] = ['all', ...Object.values(DocumentStatus)];
  docStatusControl = new FormControl<DocumentFilterStatus>('all');

  constructor() {
    effect(() => {
      if (this.isLoading()) {
        this.docStatusControl.disable({ emitEvent: false });
      } else {
        this.docStatusControl.enable({ emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.paginationService.initializePaginationFromUrl();
    this.docStatusControl.valueChanges.pipe(debounceTime(TIME_MS.DEBOUNCE), takeUntilDestroyed(this.dr)).subscribe(() => {
      this.paginationService.resetPagination();
    });
    combineLatest([this.paginationService.pagination$, this.sortService.sortParams$])
      .pipe(
        debounceTime(TIME_MS.DEBOUNCE),
        switchMap(() => this.loadDocuments()),
        takeUntilDestroyed(this.dr),
      )
      .subscribe(({ results, count }) => {
        this.dataSource.data = results;
        this.paginationService.totalItems.set(count);
      });
  }

  loadDocuments() {
    this.isLoading.set(true);

    return this.documentService
      .getAll({
        ...this.paginationService.pagination(),
        ...(this.docStatusControl.value !== 'all' && { status: this.docStatusControl.value! }),
        sort: this.sortService.sortParams(),
      })
      .pipe(
        takeUntilDestroyed(this.dr),
        finalize(() => this.isLoading.set(false)),
      );
  }

  onCreateDocument() {
    const dialogRef = this.dialog.open(AddDocumentModalComponent, {
      width: '30rem',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        switchMap((result) => this.documentService.createDocument(result)),
        tap(() => this.paginationService.resetPagination()),
        takeUntilDestroyed(this.dr),
      )
      .subscribe((newDoc) => {
        this.snackBar.open(`Document '${newDoc.name}' has been created`, 'OK');
      });
  }

  onLogOut() {
    this.authService.logOut();
    this.router.navigateByUrl('/');
  }

  onSortChange(sort: Sort) {
    this.sortService.updateSorting(sort);
    this.paginationService.updatePagination({ page: 1 });
  }

  manageUserMenuEvent({ document, action }: UserMenuEvent) {
    const currentPage = this.paginationService.pagination().page;
    const canGoBack = this.dataSource.data.length === 1 && currentPage > 1;
    const statusFilter = this.docStatusControl.value;
    const shouldGoBack =
      canGoBack && (action === EntityMutation.Delete || (document.status !== statusFilter && statusFilter !== 'all'));
    const nextPage = shouldGoBack ? currentPage - 1 : currentPage;
    this.paginationService.updatePagination({ page: nextPage });
  }
}

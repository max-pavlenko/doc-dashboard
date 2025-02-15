import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
import { DatePipe } from '@angular/common';
import { AppDocument } from '@feature/documents/models/document.model';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { DocumentService } from '@feature/documents/services/document.service';
import { AuthService } from '@feature/auth/services/auth.service';
import { Router } from '@angular/router';
import { PaginationService } from '@shared/services/pagination/pagination.service';
import { PdfViewComponent } from '@shared/ui/organisms/pdf-view/pdf-view.component';
import { SortService } from '@shared/services/sort/sort.service';
import { PaginatorComponent } from '@shared/ui/organisms/paginator/paginator.component';
import { LoadingTableComponent } from '@shared/ui/molecules/loading-table/loading-table.component';
import { TIME_MS } from '@shared/constants/common.constants';
import { ReviewerMenuComponent } from '@feature/documents/ui/reviewer-role/reviewer-menu/reviewer-menu.component';
import { ReviewerMenuEvent } from '@feature/documents/ui/reviewer-role/reviewer-menu/reviewer-menu.model';
import { MatInput } from '@angular/material/input';
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
    ReactiveFormsModule,
    MatButton,
    PdfViewComponent,
    PaginatorComponent,
    LoadingTableComponent,
    ReviewerMenuComponent,
    MatInput,
    MobileCardComponent,
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [PaginationService, SortService],
})
export default class DocumentsComponent implements OnInit {
  dr = inject(DestroyRef);
  router = inject(Router);
  dialog = inject(MatDialog);
  sortService = inject(SortService);
  fb = inject(NonNullableFormBuilder);
  documentService = inject(DocumentService);
  authService = inject(AuthService);
  paginationService = inject(PaginationService);

  isLoading = signal(true);

  dataSource = new MatTableDataSource<AppDocument>();
  displayedColumns = ['creator', 'creator_email', 'status', 'name', 'updatedAt', 'actions'];
  filterForm = this.fb.group({
    creatorEmail: [''],
  });

  ngOnInit(): void {
    this.paginationService.initializePaginationFromUrl();
    this.filterForm.valueChanges.pipe(debounceTime(TIME_MS.DEBOUNCE), takeUntilDestroyed(this.dr)).subscribe(() => {
      this.paginationService.resetPagination();
    });
    combineLatest([this.paginationService.pagination$, this.sortService.sortParams$])
      .pipe(debounceTime(TIME_MS.DEBOUNCE), takeUntilDestroyed(this.dr))
      .subscribe(() => {
        this.getDocuments();
      });
  }

  getDocuments() {
    this.isLoading.set(true);

    return this.documentService
      .getAll({
        ...this.paginationService.pagination(),
        ...this.filterForm.value,
        sort: this.sortService.sortParams(),
      })
      .pipe(
        takeUntilDestroyed(this.dr),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe(({ results, count }) => {
        this.dataSource.data = results;
        this.paginationService.totalItems.set(count);
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

  manageReviewerMenuEvent(status: ReviewerMenuEvent, document: AppDocument) {
    this.dataSource.data = this.dataSource.data.map((doc) => (doc.id === document.id ? { ...document, status } : doc));
  }
}

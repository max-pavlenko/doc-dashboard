import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { PaginationService } from '@shared/services/pagination/pagination.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  imports: [MatPaginator],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  paginationService = inject(PaginationService, { host: true });
  pageChanged = output<PageEvent>();

  onPageChange(event: PageEvent) {
    this.pageChanged.emit(event);
    this.paginationService.updatePagination({ page: event.pageIndex + 1, size: event.pageSize });
  }
}

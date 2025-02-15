import { computed, inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paginatable } from '@shared/models/query.model';
import { toObservable } from '@angular/core/rxjs-interop';

export const DEFAULT_PAGINATION: Paginatable = {
  page: 1,
  size: 10,
};

export const DEFAULT_PAGE_SIZES = [3, 5, 10];

export type UpdatePaginationParams = {
  updateQueryParams: boolean;
};

@Injectable()
export class PaginationService {
  router = inject(Router);
  route = inject(ActivatedRoute);

  pagination = signal(DEFAULT_PAGINATION);
  pagination$ = toObservable(this.pagination);

  config = signal({
    updateQueryParams: false,
  });

  pageSizes = signal(DEFAULT_PAGE_SIZES);
  totalItems = signal(0);

  updatePagination(pagination?: Partial<Paginatable>): void {
    const newPagination = { ...this.pagination(), ...pagination };

    this.pagination.set(newPagination);
    if (this.config().updateQueryParams) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: newPagination,
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }

  initializePaginationFromUrl(
    setupParams: UpdatePaginationParams = {
      updateQueryParams: true,
    },
  ): void {
    const params = this.route.snapshot.queryParams;
    const page = params['page'] ? parseInt(params['page'], 10) : DEFAULT_PAGINATION.page;
    const size = params['size'] ? parseInt(params['size'], 10) : DEFAULT_PAGINATION.size;
    this.config.set({ ...setupParams });
    this.updatePagination({ size, page });
  }

  resetPagination(): void {
    this.totalItems.set(0);
    this.updatePagination({ ...DEFAULT_PAGINATION, size: this.pagination().size });
  }
}

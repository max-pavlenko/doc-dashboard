import { SortDirection } from '@angular/material/sort';

export interface Paginatable {
  page: number;
  size: number;
}

export interface PaginationContainer<T> {
  results: T[];
  count: number;
}

export interface Sortable<T extends string = string> {
  field: T;
  direction: SortDirection;
}

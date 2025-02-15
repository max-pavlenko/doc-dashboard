import { computed, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Sort, SortDirection } from '@angular/material/sort';

@Injectable()
export class SortService {
  private field = signal<string>('');
  private direction = signal<SortDirection>('');

  sortParams = computed(() => ({
    field: this.field(),
    direction: this.direction(),
  }));
  sortParams$ = toObservable(this.sortParams);

  updateSorting({ direction, active: column }: Sort): void {
    if (this.field() === column) {
      this.direction.set(direction);
    } else {
      this.field.set(column);
      this.direction.set('asc');
    }
  }

  resetSorting() {
    this.field.set('');
    this.direction.set('');
  }
}

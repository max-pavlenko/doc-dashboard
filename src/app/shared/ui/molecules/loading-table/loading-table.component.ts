import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { SkeletonComponent } from '@shared/ui/atoms/skeleton/skeleton.component';

@Component({
  selector: 'app-loading-table',
  imports: [NgStyle, SkeletonComponent],
  templateUrl: './loading-table.component.html',
  styleUrl: './loading-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingTableComponent {
  amount = input.required<Record<'rows' | 'columns', number>>();

  amountsMap = computed(() =>
    Object.entries(this.amount()).reduce(
      (acc, [key, value]) => {
        return {
          ...acc,
          [key]: new Array(value).fill(0),
        };
      },
      {} as Record<'rows' | 'columns', number[]>,
    ),
  );

  get isMobile() {
    return window.innerWidth < 768;
  }
}

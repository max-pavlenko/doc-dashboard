import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  imports: [],
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {}

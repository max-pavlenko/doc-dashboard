import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-link',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {
  href = input.required<string>();
}

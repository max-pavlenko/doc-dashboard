import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-mobile-card',
  imports: [MatMenu, MatMenuTrigger, MatButton, MatCard],
  templateUrl: './mobile-card.component.html',
  styleUrl: './mobile-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileCardComponent {
  isWithMenu = input(true);
}

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-light-button',
  imports: [MatButton, MatProgressSpinner],
  templateUrl: './light-button.component.html',
  styleUrl: './light-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightButtonComponent {
  isLoading = input(false);
  isDisabled = input(false);
}

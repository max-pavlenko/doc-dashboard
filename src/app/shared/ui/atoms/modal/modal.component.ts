import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  imports: [MatIconButton, MatIcon],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class ModalComponent {
  dialogRef = inject(MatDialogRef);
  isWithCloseButton = input(true);
}

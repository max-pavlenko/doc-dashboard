import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { ModalComponent } from '@shared/ui/atoms/modal/modal.component';
import { MatIcon } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { ConfirmModalData } from '@shared/ui/molecules/_modals/confirm-modal/confirm-modal.model';

@Component({
  selector: 'app-confirm-modal',
  imports: [ModalComponent, MatIcon, MatButton],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent {
  data = inject<ConfirmModalData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);

  entity = input.required<string>();
}

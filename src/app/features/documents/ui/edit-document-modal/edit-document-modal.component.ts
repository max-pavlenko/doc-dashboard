import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ErrorMessagePipe } from '@shared/pipes/error-message/error-message.pipe';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ModalComponent } from '@shared/ui/atoms/modal/modal.component';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditDocumentModalData } from '@feature/documents/ui/edit-document-modal/edit-document-modal.model';

@Component({
  selector: 'app-edit-document-modal',
  imports: [
    ErrorMessagePipe,
    MatButton,
    MatDivider,
    MatError,
    MatFormField,
    MatInput,
    ModalComponent,
    ReactiveFormsModule,
    MatLabel,
  ],
  templateUrl: './edit-document-modal.component.html',
  styleUrl: './edit-document-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditDocumentModalComponent implements OnInit {
  data = inject<EditDocumentModalData>(MAT_DIALOG_DATA);
  fb = inject(NonNullableFormBuilder);
  dialogRef = inject(MatDialogRef);

  form = this.fb.group({
    name: this.fb.control('', [Validators.required]),
  });

  ngOnInit(): void {
    this.form.patchValue({ name: this.data.document.name });
  }

  async onEditDocument() {
    if (this.form.invalid) return;

    this.dialogRef.close(this.form.value);
  }
}

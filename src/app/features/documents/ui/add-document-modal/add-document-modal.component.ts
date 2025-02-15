import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentStatus } from '@feature/documents/models/document.model';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ErrorMessagePipe } from '@shared/pipes/error-message/error-message.pipe';
import { MatOption, MatSelect } from '@angular/material/select';
import { DocumentStatusPipe } from '@feature/documents/pipes/document-status.pipe';
import { FileAreaInputComponent } from '@shared/ui/molecules/_inputs/file-area-input/file-area-input.component';
import { ModalComponent } from '@shared/ui/atoms/modal/modal.component';
import { MatDivider } from '@angular/material/divider';
import { MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-document-modal',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    ErrorMessagePipe,
    MatSelect,
    MatOption,
    DocumentStatusPipe,
    FileAreaInputComponent,
    ModalComponent,
    MatDivider,
    MatButton,
  ],
  templateUrl: './add-document-modal.component.html',
  styleUrl: './add-document-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDocumentModalComponent implements OnInit {
  fb = inject(NonNullableFormBuilder);
  dialogRef = inject(MatDialogRef);

  form = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    status: this.fb.control(DocumentStatus.ReadyForReview),
    file: this.fb.control<null | File>(null, [Validators.required]),
  });
  availableStatuses: DocumentStatus[] = [DocumentStatus.Draft, DocumentStatus.ReadyForReview];
  acceptableMimeTypes = ['pdf'];

  ngOnInit(): void {
    this.form.controls.file.valueChanges.subscribe((file) => {
      this.form.controls.name.setValue(file?.name ?? '');
    });
  }

  async onAddDocument() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.value);
  }
}

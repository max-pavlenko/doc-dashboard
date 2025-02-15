import { Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { JoinPipe } from '@shared/pipes/join/join.pipe';
import { JoinMimeTypesPipe } from '@shared/pipes/join-mime-types/join-mime-types.pipe';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-file-area-input',
  standalone: true,
  imports: [MatIcon, MatIconButton, JoinPipe, JoinMimeTypesPipe, NgClass],
  templateUrl: './file-area-input.component.html',
  styleUrls: ['./file-area-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileAreaInputComponent),
      multi: true,
    },
  ],
})
export class FileAreaInputComponent implements ControlValueAccessor {
  maxFileSizeMb = input(100);
  acceptableMimeTypes = input<string[]>([]);

  file = signal<File | null>(null);
  isDragOver = signal(false);

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(file: File): void {
    this.file.set(file);
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onFileInput(event: Event) {
    const newFiles = Array.from((event.target as HTMLInputElement).files!);
    this.processFile(newFiles[0]);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave() {
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);

    const newFiles = Array.from(event.dataTransfer?.files || []);
    this.processFile(newFiles[0]);
  }

  processFile(file: File) {
    if (!file) return;

    this.file.set(file);
    this.onChange(file);
  }

  removeFile(fileInput: HTMLInputElement) {
    fileInput.value = ''; // to be able to select same file again
    this.file.set(null);
    this.onChange(null);
  }
}

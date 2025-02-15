import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import PSPDFKit, { Instance, ToolbarItem } from 'pspdfkit';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DEFAULT_MAT_CONFIGS } from '@shared/constants/ng-mat.constants';

@Injectable({
  providedIn: 'root',
})
export class PdfViewService {
  snackBar = inject(MatSnackBar);

  pdfInstance = signal<Instance | null>(null);
  document$ = new BehaviorSubject<string | null>(null);

  async loadPdf(doc: string, nativeEl: HTMLElement) {
    try {
      if (this.pdfInstance()) {
        PSPDFKit.unload(nativeEl);
      }
      const instance = await PSPDFKit.load({
        container: nativeEl,
        baseUrl: `${location.origin}/assets/`,
        document: doc,
        disableMultiSelection: true,
        initialViewState: new PSPDFKit.ViewState({
          readOnly: true,
          sidebarMode: 'THUMBNAILS',
        }),
      });
      instance.setToolbarItems((items) => [
        ...items,
        {
          type: 'custom',
          id: 'close-button',
          title: 'Close',
          icon: '/assets/icons/close.svg',
          onPress: () => this.unloadPdf(),
        } satisfies ToolbarItem,
      ]);
      this.pdfInstance.set(instance);
    } catch (error: any) {
      this.snackBar.open(`Failed to load PDF: ${error.message}`, 'OK', DEFAULT_MAT_CONFIGS.SNACK_BAR_ERROR);
      this.unloadPdf(nativeEl);
    }
  }

  unloadPdf(target: HTMLElement | Instance | null = this.pdfInstance()) {
    target && PSPDFKit.unload(target);
    this.document$.next(null);
    this.pdfInstance.set(null);
  }
}

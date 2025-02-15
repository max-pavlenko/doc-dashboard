import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, viewChild } from '@angular/core';
import { PdfViewService } from '@shared/ui/organisms/pdf-view/services/pdf-view.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-pdf-view',
  imports: [AsyncPipe, NgClass],
  templateUrl: './pdf-view.component.html',
  styleUrl: './pdf-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PdfViewComponent implements AfterViewInit {
  pdfViewService = inject(PdfViewService);
  dr = inject(DestroyRef);

  viewer = viewChild<ElementRef>('viewer');

  ngAfterViewInit() {
    this.pdfViewService.document$.pipe(filter(Boolean), takeUntilDestroyed(this.dr)).subscribe(async (document) => {
      if (document) {
        await this.pdfViewService.loadPdf(document, this.viewer()?.nativeElement);
      } else {
        this.pdfViewService.unloadPdf();
      }
    });
  }
}

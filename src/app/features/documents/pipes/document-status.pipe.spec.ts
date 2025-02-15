import { TestBed } from '@angular/core/testing';
import { DocumentStatusPipe } from './document-status.pipe';
import { DEFAULT_STATUS_MAP, DOCUMENT_STATUS_MAP, DocumentStatusMap } from '@shared/tokens/document-statuses';
import { DocumentStatus } from '@feature/documents/models/document.model';

describe('DocumentStatusPipe', () => {
  let pipe: DocumentStatusPipe;
  let statusMap: DocumentStatusMap;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DocumentStatusPipe,
        {
          provide: DOCUMENT_STATUS_MAP,
          useValue: DEFAULT_STATUS_MAP,
        },
      ],
    });

    pipe = TestBed.inject(DocumentStatusPipe);
    statusMap = TestBed.inject(DOCUMENT_STATUS_MAP);
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform status correctly', () => {
    expect(pipe.transform(DocumentStatus.Draft)).toBe(statusMap.DRAFT);
    expect(pipe.transform(DocumentStatus.UnderReview)).toBe(statusMap.UNDER_REVIEW);
    expect(pipe.transform(DocumentStatus.Approved)).toBe(statusMap.APPROVED);
  });
});

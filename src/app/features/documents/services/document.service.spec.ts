import { TestBed } from '@angular/core/testing';
import { DocumentService } from './document.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ConverterService } from '@shared/services/converter/converter.service';
import { environment } from '../../../../environments/environment';
import {
  ChangeDocumentStatusRequest,
  CreateDocumentRequest,
  PatchDocumentRequest,
  QueryDocumentsRequest,
} from '@feature/documents/models/document.request';
import { AppDocument, AppDocumentFile, DocumentStatus } from '@feature/documents/models/document.model';
import {
  ChangeDocumentStatusResponse,
  DocumentsQueryResponse,
  PatchDocumentResponse,
} from '@feature/documents/models/document.response';
import { Unique } from '@shared/models/common.model';
import { provideHttpClient } from '@angular/common/http';

describe('DocumentService', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;
  let converterServiceSpy: jasmine.SpyObj<ConverterService>;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    const converterSpy = jasmine.createSpyObj('ConverterService', ['toFormData']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        DocumentService,
        { provide: ConverterService, useValue: converterSpy },
      ],
    });

    service = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);
    converterServiceSpy = TestBed.inject(ConverterService) as jasmine.SpyObj<ConverterService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getOne', () => {
    it('should fetch a document by ID', () => {
      const mockDocument: AppDocumentFile = { id: '123', name: 'Test Document' } as AppDocumentFile;

      service.getOne('123').subscribe((document) => {
        expect(document).toEqual(mockDocument);
      });

      const req = httpMock.expectOne(`${apiUrl}/document/123`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDocument);
    });
  });

  describe('getAll', () => {
    it('should fetch all documents with query params', () => {
      const mockResponse: DocumentsQueryResponse = { results: [], count: 0 };
      const queryParams: QueryDocumentsRequest = { page: 1, size: 10 };

      service.getAll(queryParams).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/document?page=1&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('createDocument', () => {
    it('should create a new document', () => {
      const requestBody: CreateDocumentRequest = { status: DocumentStatus.Draft, file: '', name: 'New Doc' };
      const mockResponse: AppDocument = { id: '123', name: 'New Doc' } as AppDocument;

      const formDataMock = new FormData();
      converterServiceSpy.toFormData.and.returnValue(formDataMock);

      service.createDocument(requestBody).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/document`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(formDataMock);
      req.flush(mockResponse);
    });
  });

  describe('patchDocument', () => {
    it('should update an existing document', () => {
      const requestBody: PatchDocumentRequest = { id: '123', name: 'Updated Doc' };
      const mockResponse: PatchDocumentResponse = { name: requestBody.name! };

      service.patchDocument(requestBody).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/document/123`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ name: 'Updated Doc' });
      req.flush(mockResponse);
    });
  });

  describe('changeDocumentStatus', () => {
    it('should change document status', () => {
      const requestBody: ChangeDocumentStatusRequest = { id: '123', status: DocumentStatus.Approved };
      const mockResponse: ChangeDocumentStatusResponse = { status: requestBody.status };

      service.changeDocumentStatus(requestBody).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/document/123/change-status`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ status: DocumentStatus.Approved });
      req.flush(mockResponse);
    });
  });

  describe('sendDocumentToReview', () => {
    it('should send a document to review', () => {
      const requestBody: Unique = { id: '123' };

      service.sendDocumentToReview(requestBody).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/document/123/send-to-review`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush({});
    });
  });

  describe('revokeDocument', () => {
    it('should revoke a document review', () => {
      const requestBody: Unique = { id: '123' };

      service.revokeDocument(requestBody).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/document/123/revoke-review`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush({});
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', () => {
      const requestBody: Unique = { id: '123' };

      service.deleteDocument(requestBody).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/document/123`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});

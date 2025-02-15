import { inject, Injectable } from '@angular/core';
import {
  ChangeDocumentStatusRequest,
  CreateDocumentRequest,
  PatchDocumentRequest,
  QueryDocumentsRequest,
} from '@feature/documents/models/document.request';
import { Unique } from '@shared/models/common.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { AppDocument, AppDocumentFile } from '@feature/documents/models/document.model';
import {
  ChangeDocumentStatusResponse,
  DocumentsQueryResponse,
  PatchDocumentResponse,
} from '@feature/documents/models/document.response';
import { ConverterService } from '@shared/services/converter/converter.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  http = inject(HttpClient);
  converterService = inject(ConverterService);

  apiUrl = environment.apiUrl;

  getOne(id: string) {
    return this.http.get<AppDocumentFile>(`${this.apiUrl}/document/${id}`);
  }

  getAll(payload: QueryDocumentsRequest) {
    const { sort, ...rest } = payload;

    return this.http.get<DocumentsQueryResponse>(`${this.apiUrl}/document`, {
      params: {
        ...rest,
        ...(sort?.field && sort?.direction && { sort: `${sort.field},${sort.direction}` }),
      },
    });
  }

  createDocument(body: CreateDocumentRequest) {
    return this.http.post<AppDocument>(`${this.apiUrl}/document`, this.converterService.toFormData(body));
  }

  patchDocument({ id, ...body }: PatchDocumentRequest) {
    return this.http.patch<PatchDocumentResponse>(`${this.apiUrl}/document/${id}`, body);
  }

  changeDocumentStatus({ id, ...body }: ChangeDocumentStatusRequest) {
    return this.http.post<ChangeDocumentStatusResponse>(`${this.apiUrl}/document/${id}/change-status`, body);
  }

  sendDocumentToReview({ id }: Unique) {
    return this.http.post<void>(`${this.apiUrl}/document/${id}/send-to-review`, {});
  }

  revokeDocument({ id }: Unique) {
    return this.http.post<void>(`${this.apiUrl}/document/${id}/revoke-review`, {});
  }

  deleteDocument({ id }: Unique) {
    return this.http.delete(`${this.apiUrl}/document/${id}`);
  }
}

import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { FileHolder } from './file-holder.model';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  public filesHolder$: BehaviorSubject<FileHolder[]> = new BehaviorSubject([]);

  constructor(private http: HttpClient) {}

  addFiles(files: File[]): void {
    this.filesHolder$.next([
      ...this.filesHolder$.value,
      ...Array.from(files).map((file) => {
        const httpRequest = this.createFileUploadRequest(file);
        return {
          file: file,
          progress$: this.http.request(httpRequest).pipe(
            map((event: HttpEvent<any>) => {
              return this.fileUploadProgressReport(event);
            })
          ),
        };
      }),
    ]);
  }

  public removeFile(index) {
    const files = this.filesHolder$.value.slice();
    this.http
      .delete(`http://localhost:3000/api/files/${files[index].file.name}`)
      .subscribe();
    files.splice(index, 1);
    this.filesHolder$.next(files);
  }

  private createFileUploadRequest(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const httpRequest = new HttpRequest(
      'POST',
      'http://localhost:3000/api/files',
      formData,
      {
        reportProgress: true,
      }
    );
    return httpRequest;
  }

  private fileUploadProgressReport(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent: {
        return 0;
      }
      case HttpEventType.UploadProgress: {
        return Math.round((event.loaded / event.total) * 100);
      }
      case HttpEventType.Response: {
        return 100;
      }
      default: {
        return 0;
      }
    }
  }
}

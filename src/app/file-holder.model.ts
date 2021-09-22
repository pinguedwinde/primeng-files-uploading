import { Observable } from 'rxjs';
export interface FileHolder {
  file: File;
  progress$: Observable<number>;
}

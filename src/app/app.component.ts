import { FileService } from './file.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';

import { FileHolder } from './file-holder.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('fileinput', { static: true })
  public fileInput: ElementRef;
  public filesHolder$: Observable<FileHolder[]> =
    this.fileService.filesHolder$.asObservable();
  public over: boolean = false;

  constructor(
    private primengConfig: PrimeNGConfig,
    private fileService: FileService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

  public openFile(): void {
    this.fileInput.nativeElement.click();
  }

  public addFiles($event): void {
    const files = $event.target.files;
    this.fileService.addFiles(files);
  }

  public removeFile(index: number): void {
    this.fileService.removeFile(index);
  }

  dropFile($event) {
    if ($event.dataTransfer) {
      const files = $event.dataTransfer.files;
      this.fileService.addFiles(files);
    }
  }
}

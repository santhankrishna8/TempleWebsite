import { Component, ElementRef, ViewChild } from '@angular/core';
import { PHOTOS } from './photos';

@Component({
  selector: 'app-photos',
  standalone: true,
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.css'
})
export class PhotosComponent {
  photos = PHOTOS;
  @ViewChild('viewer') viewer!: ElementRef<HTMLDialogElement>;
  @ViewChild('strip') strip!: ElementRef<HTMLElement>;

  open(i: number) {
    this.viewer.nativeElement.showModal();
    const strip = this.strip.nativeElement;
    strip.scrollTo({ left: i * strip.clientWidth, behavior: 'instant' });
  }
}

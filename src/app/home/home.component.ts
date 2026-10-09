import { Component } from '@angular/core';
import { PHOTOS } from '../photos/photos';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  slides = PHOTOS;
  current = 0;

  // Slides are full-width, so the index is just scroll position / width.
  onScroll(track: HTMLElement) {
    this.current = Math.round(track.scrollLeft / track.clientWidth);
  }

  go(track: HTMLElement, i: number) {
    const n = this.slides.length;
    track.scrollTo({ left: ((i + n) % n) * track.clientWidth, behavior: 'smooth' }); // wraps at both ends
  }
}

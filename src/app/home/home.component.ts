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

  pad = (n: number) => String(n).padStart(2, '0');

  // Slide nearest the track's centre is the current one.
  onScroll(track: HTMLElement, thumbs: HTMLElement) {
    const mid = track.scrollLeft + track.clientWidth / 2;
    const items = Array.from(track.children) as HTMLElement[];
    const dist = (el: HTMLElement) => Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
    const best = items.reduce((b, el, i) => (dist(el) < dist(items[b]) ? i : b), 0);
    if (best !== this.current) {
      this.current = best;
      this.centre(thumbs, best, 'smooth');
    }
  }

  go(track: HTMLElement, thumbs: HTMLElement, i: number) {
    const n = this.slides.length;
    i = (i + n) % n; // wrap around at both ends
    this.centre(track, i, 'smooth');
    this.centre(thumbs, i, 'smooth');
  }

  // Scroll only this container (scrollIntoView would also move the page).
  private centre(box: HTMLElement, i: number, behavior: ScrollBehavior) {
    const el = box.children[i] as HTMLElement;
    box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2, behavior });
  }
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReaderComponent } from '../reader/reader.component';
import { PHOTOS } from '../photos/photos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ReaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  slides = PHOTOS;
  current = 0;

  // Nearest slide to the track's centre — keeps the counter honest during free swipes.
  onScroll(track: HTMLElement) {
    const mid = track.scrollLeft + track.clientWidth / 2;
    const imgs = Array.from(track.children) as HTMLElement[];
    let best = 0;
    imgs.forEach((img, i) => {
      if (Math.abs(img.offsetLeft + img.offsetWidth / 2 - mid) <
          Math.abs(imgs[best].offsetLeft + imgs[best].offsetWidth / 2 - mid)) best = i;
    });
    this.current = best;
  }

  step(track: HTMLElement, dir: number) {
    const next = (this.current + dir + this.slides.length) % this.slides.length;
    (track.children[next] as HTMLElement).scrollIntoView({ inline: 'center', block: 'nearest' });
  }
}

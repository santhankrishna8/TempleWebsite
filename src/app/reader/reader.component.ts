import { Component, Input } from '@angular/core';

// Thumbnail tile that opens a bottom sheet with scanned prayer pages.
@Component({
  selector: 'app-reader',
  standalone: true,
  template: `
    <button type="button" class="tile card pressable" (click)="sheet.showModal()">
      <img [src]="thumb" alt="" width="300" height="168">
      <span class="tile-text">
        <strong>{{ title }}</strong>
        <span class="note">{{ pages.length }} పేజీలు · చదవడానికి నొక్కండి</span>
      </span>
    </button>

    <dialog #sheet class="sheet" [attr.aria-label]="title" (click)="$event.target === sheet && sheet.close()">
      <div class="sheet-head">
        <h2>{{ title }}</h2>
        <button type="button" class="icon-btn pressable" aria-label="మూసివేయి" (click)="sheet.close()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </div>
      <div class="sheet-body">
        @for (p of pages; track p; let i = $index) {
          <img [src]="p" [alt]="title + ' — పేజీ ' + (i + 1)" loading="lazy">
        }
      </div>
    </dialog>
  `,
  styles: `
    :host { display: block; }
    .tile {
      width: 100%; border: 0; font: inherit; color: inherit; text-align: left;
      display: flex; align-items: center; gap: 20px; padding: 14px;
    }
    .tile img { width: 132px; height: auto; aspect-ratio: 300 / 168; object-fit: cover; border-radius: 14px; flex: none; }
    .tile-text { display: grid; gap: 4px; }
    .tile strong { font: 400 1.3rem/1.4 var(--display); color: var(--text); }
    @media (max-width: 720px) {
      .tile { gap: 14px; padding: 12px; }
      .tile img { width: 88px; aspect-ratio: 1; border-radius: 12px; }
      .tile strong { font-size: 1.15rem; }
    }
  `
})
export class ReaderComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) thumb!: string;
  @Input({ required: true }) pages!: string[];
}

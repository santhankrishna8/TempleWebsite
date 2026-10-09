import { Component, Input } from '@angular/core';
import { Stotra } from '../pv/stotras';

// Long stotram as a native <details> card: compact on phones, opens on tap.
@Component({
  selector: 'app-stotra',
  standalone: true,
  template: `
    <details class="card" [open]="open">
      <summary class="pressable">
        <h2>{{ s.title }}</h2>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
      </summary>
      <div class="body">
        @for (v of s.verses; track $index) {
          <p class="verses">
            @for (l of v; track $index) { <span>{{ l }}</span> }
          </p>
        }
      </div>
    </details>
  `,
  styles: `
    :host { display: block; }
    details { padding: 0; }
    summary {
      list-style: none;
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      min-height: 64px; padding: 14px 20px;
      color: var(--accent);
    }
    summary::-webkit-details-marker { display: none; }
    summary h2 { font: 400 1.25rem/1.4 var(--display); color: var(--text); }
    summary svg { color: var(--accent); }
    summary svg { flex: none; transition: transform 240ms var(--ease); }
    details[open] summary svg { transform: rotate(180deg); }
    details[open] summary { border-bottom: 1px solid var(--line); }
    .body { padding: 8px 20px 24px; }
    .verses { margin-top: 16px; }
  `
})
export class StotraComponent {
  @Input({ required: true }) s!: Stotra;
  @Input() open = false;
}

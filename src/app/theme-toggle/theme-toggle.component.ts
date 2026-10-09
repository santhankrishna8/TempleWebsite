import { Component } from '@angular/core';

// Light/dark switch: just a sun/moon icon that rotates as it swaps. Fills its tab slot on phones,
// a round icon button on desktop. Theme lives on <html data-theme>, saved in localStorage.

type Theme = 'light' | 'dark';

const currentTheme = (): Theme =>
  document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light'; // light unless the visitor picked dark

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  template: `
    <button type="button" class="toggle pressable" (click)="toggle()" [class.dark]="theme === 'dark'"
            [attr.aria-label]="theme === 'dark' ? 'లైట్ థీమ్‌కి మార్చండి' : 'డార్క్ థీమ్‌కి మార్చండి'">
      <span class="icon" aria-hidden="true">
        <svg class="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-17.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        <svg class="moon" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
      </span>
    </button>
  `,
  styles: `
    :host { display: inline-flex; }
    .toggle {
      display: inline-grid; place-items: center;
      width: 40px; height: 40px; padding: 0;
      border: 1px solid var(--line); border-radius: 50%;
      background: var(--surface); color: var(--accent);
      font: inherit;
    }
    .icon { position: relative; width: 20px; height: 20px; }
    .icon svg {
      position: absolute; inset: 0; width: 100%; height: 100%;
      fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
      transition: transform 500ms var(--ease), opacity 250ms ease;
    }
    .moon { opacity: 0; transform: rotate(-90deg) scale(0.5); }
    .dark .sun { opacity: 0; transform: rotate(90deg) scale(0.5); }
    .dark .moon { opacity: 1; transform: none; fill: var(--accent-soft); }

    /* Phones: sits in the bottom tab bar, so look like the other tabs */
    @media (max-width: 720px) {
      :host { display: flex; height: 100%; }
      .toggle {
        width: 100%; height: auto; min-height: 54px;
        gap: 2px; align-content: center;
        border: 0; border-radius: 14px;
        background: none; color: var(--text-2);
      }
      .icon { width: 26px; height: 26px; }
    }
  `
})
export class ThemeToggleComponent {
  theme: Theme = currentTheme();

  toggle() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', this.theme); } catch { /* private mode: theme just won't persist */ }
    document.documentElement.dataset['theme'] = this.theme; // applied immediately: state and page never disagree
  }
}

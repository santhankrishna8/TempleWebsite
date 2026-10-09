import { Component } from '@angular/core';

// Light/dark switch styled like a tab: outline sun/moon icon (rotates as it swaps) + label on phones,
// a plain round icon button on desktop. Theme lives on <html data-theme>, saved in localStorage.

type Theme = 'light' | 'dark';
const FADE = 400;

const currentTheme = (): Theme => {
  const set = document.documentElement.dataset['theme'];
  return set === 'light' || set === 'dark' ? set : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

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
      <span class="label">{{ theme === 'dark' ? 'డార్క్' : 'లైట్' }}</span>
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
    .label { display: none; }

    /* Phones: sits in the bottom tab bar, so look like the other tabs */
    @media (max-width: 720px) {
      :host { display: flex; height: 100%; }
      .toggle {
        width: 100%; height: auto; min-height: 54px;
        gap: 2px; align-content: center;
        border: 0; border-radius: 14px;
        background: none; color: var(--text-2);
      }
      .icon { width: 24px; height: 24px; }
      .label { display: block; font-size: 0.75rem; line-height: 1.4; }
    }
  `
})
export class ThemeToggleComponent {
  theme: Theme = currentTheme();
  private fadeTimer = 0;

  toggle() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', this.theme); } catch { /* private mode: theme just won't persist */ }
    this.fadePage();
    document.documentElement.dataset['theme'] = this.theme;
  }

  // Ease the page colours instead of an abrupt brightness jump (temporary global transition rule).
  private fadePage() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = 'theme-fade';
    const style = document.getElementById(id) ?? document.head.appendChild(Object.assign(document.createElement('style'), { id }));
    style.textContent = `*:not(svg), *::before, *::after { transition-property: color, background-color, border-color, fill, stroke !important; transition-duration: ${FADE}ms !important; transition-timing-function: ease !important; transition-delay: 0s !important; }`;
    clearTimeout(this.fadeTimer);
    this.fadeTimer = window.setTimeout(() => style.remove(), FADE + 100);
  }
}

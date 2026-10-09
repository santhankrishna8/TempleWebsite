import { Component } from '@angular/core';
import { LANGS, Lang, currentLang, setLang } from '../i18n';

// Gear button + native popover (light-dismiss and Esc for free) with two pill groups: language and theme.
// Theme lives on <html data-theme> (index.html applies the saved one before first paint).

type Theme = 'light' | 'dark';
const FADE = 400;
const currentTheme = (): Theme => {
  const set = document.documentElement.dataset['theme'];
  return set === 'dark' ? 'dark' : 'light'; // light unless the visitor picked dark
};

@Component({
  selector: 'app-settings',
  standalone: true,
  template: `
    <button type="button" class="trigger pressable" popovertarget="settings-pop" aria-label="సెట్టింగ్స్">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
      <span class="label">సెట్టింగ్స్</span>
    </button>

    <div id="settings-pop" popover class="pop">
      <p class="k">భాష</p>
      <div class="pills">
        @for (l of langs; track l.code) {
          <!-- translate="no": each language name always shows in its own script -->
          <button type="button" class="pill pressable" translate="no" [attr.lang]="l.code"
                  [class.on]="l.code === lang" [attr.aria-pressed]="l.code === lang" (click)="pickLang(l.code)">{{ l.name }}</button>
        }
      </div>

      <p class="k">థీమ్</p>
      <!-- One switch: off = light, on = dark. The knob carries the sun/moon. -->
      <button type="button" class="switch-row pressable" role="switch" [attr.aria-checked]="theme === 'dark'"
              (click)="pickTheme(theme === 'dark' ? 'light' : 'dark')">
        <span>డార్క్</span>
        <span class="switch" [class.on]="theme === 'dark'" aria-hidden="true">
          <span class="knob">
            @if (theme === 'dark') {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            } @else {
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-17.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            }
          </span>
        </span>
      </button>
    </div>
  `,
  styles: `
    :host { display: inline-flex; }
    .trigger {
      width: 40px; height: 40px; padding: 0;
      display: grid; place-items: center;
      border: 1px solid var(--line); border-radius: 50%;
      background: var(--surface); color: var(--text-2);
    }
    @media (hover: hover) { .trigger:hover { color: var(--accent); } }
    .icon { width: 20px; height: 20px; }
    .label { display: none; }

    .pop {
      position: fixed; inset: auto; top: 64px; right: max(16px, calc(50vw - 524px));
      width: 280px; margin: 0; padding: 18px;
      border: 1px solid var(--line); border-radius: var(--radius);
      background: var(--surface); color: var(--text);
      box-shadow: var(--shadow-lg);
    }
    .pop::backdrop { background: transparent; }
    .k { margin: 0 0 8px; color: var(--text-2); font-size: 0.875rem; font-weight: 600; }
    .k:not(:first-child) { margin-top: 18px; }

    .pills { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .pill {
      min-height: 44px; padding: 0 12px;
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      border: 1px solid var(--line); border-radius: 999px;
      background: var(--bg); color: var(--text);
      font: 600 0.9375rem/1.2 var(--sans);
    }
    .pill svg { width: 18px; height: 18px; flex: none; }
    .pill[lang="te"] { font-family: "Noto Sans Telugu", sans-serif; }
    .pill[lang="en"] { font-family: "Noto Sans", system-ui, sans-serif; }
    .pill[lang="ta"] { font-family: "Noto Sans Tamil", sans-serif; }
    .pill[lang="kn"] { font-family: "Noto Sans Kannada", sans-serif; }
    @media (hover: hover) { .pill:not(.on):hover { border-color: var(--orange); } }
    .pill.on { background: var(--orange); border-color: var(--orange); color: var(--on-orange); }

    .switch-row {
      width: 100%; min-height: 48px; padding: 0 6px 0 16px;
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      border: 1px solid var(--line); border-radius: 999px;
      background: var(--bg); color: var(--text);
      font: 600 0.9375rem/1.2 var(--sans);
    }
    .switch {
      position: relative; flex: none; width: 56px; height: 34px; border-radius: 999px;
      background: var(--line); transition: background-color 250ms ease;
    }
    .switch.on { background: var(--orange); }
    .knob {
      position: absolute; top: 3px; left: 3px; width: 28px; height: 28px; border-radius: 50%;
      display: grid; place-items: center;
      background: #fff; color: #c2410c; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      transition: transform 300ms var(--ease);
    }
    .switch.on .knob { transform: translateX(22px); color: #1c1917; }
    .knob svg { width: 16px; height: 16px; }

    /* Phones: the trigger is a bottom-bar tab; the panel is a sheet above the bar over a dimmed page */
    @media (max-width: 720px) {
      :host { display: flex; height: 100%; }
      .trigger {
        width: 100%; height: auto; min-height: 54px;
        gap: 2px; align-content: center;
        border: 0; border-radius: 14px; background: none;
      }
      .icon { width: 24px; height: 24px; }
      .label { display: block; font-size: 0.6875rem; line-height: 1.4; white-space: nowrap; }
      .pop { top: auto; bottom: calc(80px + env(safe-area-inset-bottom)); left: 12px; right: 12px; width: auto; }
      .pop::backdrop { background: var(--scrim); }
    }
  `
})
export class SettingsComponent {
  langs = LANGS;
  lang: Lang = currentLang();
  theme: Theme = currentTheme();
  private fadeTimer = 0;

  pickLang(l: Lang) {
    this.lang = l;
    setLang(l);
  }

  pickTheme(t: Theme) {
    if (t === this.theme) return;
    this.theme = t;
    try { localStorage.setItem('theme', t); } catch { /* private mode: theme just won't persist */ }
    this.fadePage();
    document.documentElement.dataset['theme'] = t;
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

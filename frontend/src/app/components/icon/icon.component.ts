import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Strich-Icons aus dem Redesign (Strich 2, abgerundet). Inline-SVG statt einer
 * Icon-Schrift: keine zusätzliche Bibliothek, und die Farbe folgt currentColor.
 * Dekorativ (aria-hidden): Buttons, die nur ein Icon haben, brauchen ein
 * eigenes aria-label.
 */
const PATHS: Record<string, string> = {
  home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  products: '<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v10h14V9"/><path d="M10 13h4"/>',
  database:
    '<ellipse cx="12" cy="5.5" rx="7" ry="2.5"/><path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13"/>' +
    '<path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/>',
  trash: '<path d="M4 7h16"/><path d="M9 7V4h6v3"/><path d="M6 7l1 13h10l1-13"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  'chevron-right': '<path d="M9 6l6 6-6 6"/>',
  'chevron-down': '<path d="M6 9l6 6 6-6"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/>',
};

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
      [innerHTML]="paths()"
    ></svg>
  `,
  styles: `:host { display: inline-flex; flex: none; }`,
})
export class IconComponent {
  readonly name = input.required<string>();
  readonly size = input(20);
  readonly strokeWidth = input(2);

  private readonly sanitizer = inject(DomSanitizer);

  // Angulars Sanitizer würde die <path>-Elemente entfernen. Unbedenklich, weil
  // die Pfade Konstanten aus dieser Datei sind und nie aus Daten stammen.
  protected readonly paths = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(PATHS[this.name()] ?? ''),
  );
}

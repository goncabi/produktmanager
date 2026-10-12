/** Bild für Produkte ohne Foto oder mit einem Foto, das nicht lädt. */
export const PLACEHOLDER_IMAGE = '/products/placeholder.svg';

/**
 * (error)-Handler für Produktbilder: Fremde Bild-URLs können jederzeit
 * verschwinden oder das Einbinden blockieren. Statt eines kaputten Symbols
 * erscheint dann der Platzhalter. Die Prüfung verhindert eine Endlosschleife,
 * falls auch der Platzhalter nicht lädt.
 */
export function showPlaceholder(event: Event): void {
  const img = event.target as HTMLImageElement;
  if (!img.src.endsWith(PLACEHOLDER_IMAGE)) {
    img.src = PLACEHOLDER_IMAGE;
  }
}

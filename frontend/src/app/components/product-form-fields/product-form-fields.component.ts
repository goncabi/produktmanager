import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Category } from '../../interfaces/models';
import { IconComponent } from '../icon/icon.component';

/** Ein Zahlenfeld mit Einheit als Suffix im Feld. */
interface NumberField {
  control: string;
  label: string;
  unit: string;
  step?: string;
}

/**
 * Die Karten des Produktformulars (Bild, Produktdetails, Zutaten, Nährwerte,
 * Hersteller). Anlegen und Bearbeiten haben dieselben Felder; jede Seite stellt
 * nur Titel, Brotkrumen und Buttons. Die Logik (FormGroup, Validierung,
 * Absenden) bleibt in den Seiten-Komponenten.
 */
@Component({
  selector: 'app-product-form-fields',
  templateUrl: './product-form-fields.component.html',
  styleUrl: './product-form-fields.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, NgTemplateOutlet, IconComponent],
})
export class ProductFormFieldsComponent {
  readonly form = input.required<FormGroup>();
  readonly categories = input.required<Category[]>();

  // Die Vorschau-URL, deren Bild nicht geladen werden konnte.
  failedImageUrl: string | null = null;

  readonly sizes: NumberField[] = [
    { control: 'net_weight_g', label: 'Netto-Gewicht', unit: 'g' },
    { control: 'net_volume_l', label: 'Netto-Volumen', unit: 'l' },
    { control: 'gross_weight_g', label: 'Brutto-Gewicht', unit: 'g' },
  ];

  readonly prices: NumberField[] = [
    { control: 'price_delivery', label: 'Preis Lieferung', unit: '€', step: '0.01' },
    { control: 'price_pickup', label: 'Preis Abholung', unit: '€', step: '0.01' },
    { control: 'deposit_amount', label: 'Pfand', unit: '€', step: '0.01' },
  ];

  readonly extras: NumberField[] = [
    { control: 'alcohol_volume', label: 'Alkoholgehalt', unit: '%' },
    { control: 'caffeine_mg', label: 'Koffein', unit: 'mg' },
  ];

  readonly nutrients: NumberField[] = [
    { control: 'energy_kcal', label: 'Energie', unit: 'kcal' },
    { control: 'protein_g', label: 'Eiweiß', unit: 'g' },
    { control: 'fat_g', label: 'Fett', unit: 'g' },
    { control: 'saturated_fat_g', label: 'Gesättigte Fettsäuren', unit: 'g' },
    { control: 'carbohydrates_g', label: 'Kohlenhydrate', unit: 'g' },
    { control: 'sugar_g', label: 'Zucker', unit: 'g' },
    { control: 'fiber_g', label: 'Ballaststoffe', unit: 'g' },
    { control: 'sodium_mg', label: 'Natrium', unit: 'mg' },
  ];

  imageUrl(): string {
    return this.form().get('image_url')?.value ?? '';
  }

  /** Pflichtfeld berührt und leer: Fehler anzeigen. */
  showError(path: string): boolean {
    const control = this.form().get(path);
    return !!control && control.invalid && control.touched;
  }
}

/**
 * Nach einem Absendeversuch mit Fehlern: alle Felder als berührt markieren
 * (damit die Hinweise erscheinen) und das erste fehlerhafte Feld fokussieren,
 * statt kommentarlos nichts zu tun.
 */
export function revealErrors(form: FormGroup, event: Event): void {
  if (form.valid) return;
  form.markAllAsTouched();
  const formEl = event.target as HTMLFormElement;
  // Nach dem Rendern der Fehlerhinweise fokussieren.
  setTimeout(() => formEl.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
}

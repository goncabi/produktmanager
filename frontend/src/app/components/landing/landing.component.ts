import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink, IconComponent],
})
export class LandingComponent {
  // Beispielzeilen für die Vorschau im Hero (nicht aus der Datenbank).
  readonly previewRows = [
    { name: 'Orangensaft', ean: '7614500003456', category: 'Getränke' },
    { name: 'Mandelmix', ean: '7614500004567', category: 'Nüsse und Trockenfrüchte' },
    { name: 'Schoko Cookie', ean: '7614500005678', category: 'Süßwaren' },
  ];

  readonly features = [
    { icon: 'plus', title: 'Produkt hinzufügen', text: 'Füge schnell und einfach neue Produkte zu deiner Datenbank hinzu.' },
    { icon: 'edit', title: 'Produkt bearbeiten', text: 'Aktualisiere deine Produkte jederzeit mit wenigen Klicks.' },
    { icon: 'products', title: 'Produkte anzeigen', text: 'Durchsuche deine Produktliste mit unserer effizienten Suchfunktion.' },
    { icon: 'search', title: 'Schnelle Suche', text: 'Finde Produkte sofort mit unserer leistungsstarken Suchfunktion.' },
  ];

  constructor(private router: Router) {
  }

  navigateToApp(): void {
    this.router.navigate(['/products']);
  }
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}


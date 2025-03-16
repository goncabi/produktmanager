import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatCard} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  imports: [
    MatCard,
    MatIcon,
    MatButton
  ]
})
export class LandingComponent {
  constructor(private router: Router) {}

  navigateToApp(): void {
    this.router.navigate(['/products']); // Redirige a la lista de productos
  }
}

import { Routes } from '@angular/router';import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductTableComponent } from './components/product-table/product-table.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';

export const routes: Routes = [
  { path: '', component: ProductTableComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
];

export const appProviders = [
  provideRouter(routes),
  importProvidersFrom(FormsModule) // <-- AGREGAR ESTO
];

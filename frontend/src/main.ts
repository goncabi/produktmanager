import { DEFAULT_CURRENCY_CODE, LOCALE_ID, provideZoneChangeDetection } from "@angular/core";
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from "./app/app.routes"; // ✅ IMPORTAR LAS RUTAS

// Die Oberfläche ist deutsch: Dezimalkomma und Euro ("1,50 €").
registerLocaleData(localeDe);

bootstrapApplication(AppComponent, {
  providers: [ provideZoneChangeDetection(),provideRouter(routes), provideHttpClient(withXhr()), provideAnimations(),
    { provide: LOCALE_ID, useValue: 'de-DE' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'EUR' } ]
}).catch(err => console.error(err));

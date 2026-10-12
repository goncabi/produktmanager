import { provideZoneChangeDetection } from "@angular/core";
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from "./app/app.routes"; // ✅ IMPORTAR LAS RUTAS

bootstrapApplication(AppComponent, {
  providers: [ provideZoneChangeDetection(),provideRouter(routes), provideHttpClient(withXhr()), provideAnimations() ]
}).catch(err => console.error(err));

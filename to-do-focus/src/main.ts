import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';

import {
  PreloadAllModules,
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    // Configuración de Ionic para reutilizar rutas y optimizar la navegación
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    // Proveedor de funcionalidades específicas de Ionic Angular
    provideIonicAngular(),

    // Agregar ModalController explícitamente como proveedor
    ModalController,

    // Configuración de las rutas con pre-carga para mejorar el rendimiento
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
}).catch((err) => console.error(err));

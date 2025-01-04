import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ModalController } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { ProjectService } from './core/services/project.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent, // Componente standalone
        HttpClientTestingModule, // Mock de HttpClient
      ],
      providers: [
        provideRouter([]), // Proveer rutas
        AuthService, // Proveer AuthService
        ProjectService, // Proveer ProjectService
        {
          provide: ModalController, // Mock de ModalController
          useValue: {
            create: jasmine.createSpy('create').and.returnValue(
              Promise.resolve({
                present: jasmine.createSpy('present'),
                onDidDismiss: jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve({ data: { reload: true } })),
              })
            ),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  /*
  it('should initialize isAuthenticated based on AuthService', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const authService = TestBed.inject(AuthService);

    spyOn(authService, 'isAuthenticated').and.returnValue(true);

    app.ngOnInit();
    expect(app.isAuthenticated).toBeTrue();
  });
  */
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Para manejar [(ngModel)]
import { IonicModule } from '@ionic/angular'; // Para los componentes de Ionic
import { TaskFilterPipe } from 'src/app/core/pipes/task-filter.pipe'; // Pipe personalizado
import { TaskItemComponent } from '../componets/task-item/task-item.component'; // Componente standalone
import { FocusPage } from './focus.page';

describe('FocusPage', () => {
  let component: FocusPage;
  let fixture: ComponentFixture<FocusPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule, // Manejo de [(ngModel)]
        IonicModule.forRoot(), // Configuración de Ionic
        FocusPage, // Componente standalone
        TaskItemComponent, // Mover TaskItemComponent aquí
        TaskFilterPipe, // Pipe personalizado utilizado en la plantilla
      ],
      declarations: [
        
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FocusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

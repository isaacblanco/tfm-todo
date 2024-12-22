import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para manejar servicios HTTP
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { IonicModule } from '@ionic/angular'; // Importar IonicModule
import { TaskItemComponent } from './task-item.component';

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(), // Configuración básica de Ionic
        HttpClientTestingModule, // Mock para servicios HTTP
        FormsModule, // Manejo de [(ngModel)]
        TaskItemComponent, // Componente standalone
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;

    // Inicializa las propiedades necesarias antes de ejecutar detectChanges()
    component.task = {
      id_task: 1,
      fk_project: 1,
      task_name: 'Test Task',
      completed: false,
      status: 'TO_DO',
      priority: 1,
      dini: new Date(), // Fecha de inicio como objeto Date
      dfin: null,
      description: 'Mock task description',
      tabs: 0,
    };

    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

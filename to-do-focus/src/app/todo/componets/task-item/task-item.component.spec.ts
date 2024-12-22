import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para manejar servicios HTTP
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TaskItemComponent } from './task-item.component';

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule, // Añade este módulo para manejar HttpClient
        TaskItemComponent, // Incluye TaskItemComponent como standalone
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
      dini: new Date(), // Changed from toISOString() to return Date object
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

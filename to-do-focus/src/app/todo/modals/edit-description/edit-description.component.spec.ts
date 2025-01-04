import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { TaskService } from 'src/app/core/services/task.service';
import { EditDescriptionComponent } from './edit-description.component';

describe('EditDescriptionComponent', () => {
  let component: EditDescriptionComponent;
  let fixture: ComponentFixture<EditDescriptionComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  interface TaskDTO {
    id_task: number;
    fk_project: number;
    task_name: string;
    completed: boolean;
    dini: Date | null | undefined;
    dfin: Date | null | undefined;
    description?: string;
    status: 'TO_DO' | 'IN_PROGRESS' | 'BLOCKED' | 'IN_REVIEW' | 'DONE';
    tabs?: number; // 0..3
    priority: number;
  }

  // Mock de TaskDTO
  const mockTask: TaskDTO = {
    id_task: 0,
    fk_project: 0,
    task_name: '',
    completed: false,
    dini: null,
    dfin: null,
    description: 'Test Descripcion',
    status: 'TO_DO',
    tabs: 0,
    priority: 1
  };

  beforeEach(waitForAsync(() => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss']);

    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(), 
        HttpClientTestingModule,
        EditDescriptionComponent
      ], 
      providers: [
        { provide: ModalController, useValue: modalControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditDescriptionComponent);
    component = fixture.componentInstance;
    
    // Asignar la tarea mock al componente
    component.task = mockTask;
    
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Pruebas adicionales que podrías agregar
  it('should dismiss modal when calling dismiss()', () => {
    component.dismiss();
    expect(modalControllerSpy.dismiss).toHaveBeenCalled();
  });


  // Test para updateDescription
  it('should call taskService when updating description', () => {
    const taskServiceSpy = spyOn(TestBed.inject(TaskService), 'updateTask').and.returnValue(
      of(mockTask) // Return a TaskDTO object instead of just success flag
    );

    component.updateDescription();
    expect(taskServiceSpy).toHaveBeenCalledWith(
      mockTask.id_task, 
      { description: mockTask.description }
    );
  });
});
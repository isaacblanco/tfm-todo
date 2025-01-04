import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { IonicModule } from '@ionic/angular';
import { TaskDTO } from 'src/app/core/models/task-DTO';
import { SelectDateComponent } from './select-date.component';

describe('SelectDateComponent', () => {
  let component: SelectDateComponent;
  let fixture: ComponentFixture<SelectDateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Mock para HttpClient
        FormsModule, // Manejo de [(ngModel)]
        IonicModule.forRoot(), // Ionic soporte
        SelectDateComponent, // Componente standalone
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectDateComponent);
    component = fixture.componentInstance;

     // Proveer un valor inicial para `task`
     component.task = {
      id_task: 1,
      fk_project: 1,
      task_name: 'Test Task',
      completed: false,
      status: 'TO_DO',
      priority: 1,
      dini: new Date(),
      dfin: null,
      description: '',
      tabs: 0,
    } as TaskDTO;
    
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

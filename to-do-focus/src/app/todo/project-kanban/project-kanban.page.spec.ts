import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para manejar servicios HTTP
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Para manejar [(ngModel)]
import { RouterTestingModule } from '@angular/router/testing'; // Importa RouterTestingModule
import { IonicModule } from '@ionic/angular'; // Importa IonicModule
import { ProjectKanbanPage } from './project-kanban.page';

describe('ProjectKanbanPage', () => {
  let component: ProjectKanbanPage;
  let fixture: ComponentFixture<ProjectKanbanPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        IonicModule.forRoot(), // Asegúrate de incluir IonicModule
        ProjectKanbanPage,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectKanbanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

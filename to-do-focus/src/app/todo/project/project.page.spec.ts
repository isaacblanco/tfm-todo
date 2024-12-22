import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para manejar servicios HTTP
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // Para manejar [(ngModel)]
import { RouterTestingModule } from '@angular/router/testing'; // Importa RouterTestingModule
import { IonicModule } from '@ionic/angular'; // Importa IonicModule
import { ProjectPage } from './project.page';

describe('ProjectPage', () => {
  let component: ProjectPage;
  let fixture: ComponentFixture<ProjectPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        IonicModule.forRoot(), // Asegúrate de incluir IonicModule
        ProjectPage,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

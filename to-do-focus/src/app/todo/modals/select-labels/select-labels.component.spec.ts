import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para manejar HttpClient en tests
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { SelectLabelsComponent } from './select-labels.component';

describe('SelectLabelsComponent', () => {
  let component: SelectLabelsComponent;
  let fixture: ComponentFixture<SelectLabelsComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss']);

    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule, // Proporciona un mock de HttpClient
        SelectLabelsComponent, // Componente standalone
      ],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy }, // Mock del ModalController
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});

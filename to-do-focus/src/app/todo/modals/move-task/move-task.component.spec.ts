import { HttpClientTestingModule } from '@angular/common/http/testing'; // Para manejar HttpClient en tests
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { MoveTaskComponent } from './move-task.component';

describe('MoveTaskComponent', () => {
  let component: MoveTaskComponent;
  let fixture: ComponentFixture<MoveTaskComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(() => {
    // Crear un mock para ModalController
    modalControllerSpy = jasmine.createSpyObj('ModalController', ['create', 'dismiss']);

    TestBed.configureTestingModule({
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule, // Proporciona un mock de HttpClient
        MoveTaskComponent, // Standalone component importado aquí
      ],
      providers: [
        { provide: ModalController, useValue: modalControllerSpy }, // Mock del ModalController
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MoveTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        RouterTestingModule,
        LoginPage, // Importa LoginPage en lugar de declararlo
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an error if email or password is empty', () => {
    component.userData.email = '';
    component.userData.password = '';
    component.login();
    expect(component.errMessage).toBe('Email y contraseña son requeridos.');

    component.userData.email = 'test@example.com';
    component.userData.password = '';
    component.login();
    expect(component.errMessage).toBe('Email y contraseña son requeridos.');
  });

  /*
  it('should hash the password correctly', () => {
    const password = '123456';
    const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    expect(hashedPassword).toBe(
      '8d969eef6ecad3c29a3a629280e686cff8ca1c5e94b11bdb5a71b421f4a1780a'
    );
  });
  */
});

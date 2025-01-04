import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader, IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonItem, IonLabel,
  IonTitle, IonToolbar
} from '@ionic/angular/standalone';
import * as CryptoJS from 'crypto-js'; // Importación para hashear la contraseña
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule,IonToolbar, IonHeader, IonContent, IonCardContent,IonCardTitle,
     IonLabel, IonItem, IonButton, IonTitle, IonInput, IonCard, IonCardHeader, IonCardSubtitle ],
})

export class LoginPage implements OnInit {
  userDetails: any;
  responseData: any;
  errMessage: string = '';

  userData = {
    email: '',
    password: '',
  };

  userPostData = { user_id: '', token: '' };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // this.userDetails = { user_id: '0', token: '' };
  }

  ngOnInit() {
    // console.log("Entra en login");
  }

  /**
   * Maneja el proceso de inicio de sesión.
   */
  login() {
    if (!this.userData.email || !this.userData.password) {
      this.errMessage = 'Email y contraseña son requeridos.';
      return;
    }
  
    const hashedPassword = CryptoJS.SHA256(this.userData.password).toString(
      CryptoJS.enc.Hex
    );
  
    this.authService.login(this.userData.email, hashedPassword).subscribe({
      next: (response) => {
        // console.log('Login bueno, empezando...');
        this.authService.setToken(response.token); // Guarda el token
        this.router.navigate(['/todo/focus'], { replaceUrl: true }); // Redirige al focus
      },
      error: (error) => {
        this.errMessage = 'Inicio de sesión fallido. Verifica tus credenciales.';
        console.error('Error en el inicio de sesión:', error);
      },
    });
  }
  

  navigateToSignUp() {
    this.router.navigate(['/sign-up']);
  }
}

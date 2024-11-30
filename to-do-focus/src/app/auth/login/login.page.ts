import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular/standalone';
import * as CryptoJS from 'crypto-js'; // Importación para hashear la contraseña
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
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
    private navCtrl: NavController,
    private authService: AuthService,
    private router: Router
  ) {
    this.userDetails = { user_id: '0', token: '' };
  }

  ngOnInit() {}

  /**
   * Maneja el proceso de inicio de sesión.
   */
  login() {
    if (!this.userData.email || !this.userData.password) {
      this.errMessage = 'Email y contraseña son requeridos.';
      return;
    }

    // Hashear la contraseña antes de enviarla al servidor
    const hashedPassword = CryptoJS.SHA256(this.userData.password).toString(
      CryptoJS.enc.Hex
    );

    // Llamar al servicio de autenticación
    this.authService.login(this.userData.email, hashedPassword).subscribe({
      next: (response) => {
        this.authService.setToken(response.token); // Guarda el token
        this.navCtrl.navigateRoot('/todo/focus'); // Redirige al focus
      },
      error: (error) => {
        this.errMessage =
          'Inicio de sesión fallido. Verifica tus credenciales.';
        console.error('Error en el inicio de sesión:', error);
      },
    });
  }

  /**
   * Navega a la página de registro.
   */
  navigateToRegister() {
    this.router.navigate(['/sign-up']);
  }
}

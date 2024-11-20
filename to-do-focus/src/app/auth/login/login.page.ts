import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonTitle,
  IonToolbar,
  NavController,
} from '@ionic/angular/standalone';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonButton,
    IonCol,
    IonInput,
    IonRow,
    IonLabel,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class LoginPage implements OnInit {
  userDetails: any;
  responseData: any;
  errMessage: string = '';

  userData = {
    username: 'isaacblanco@uoc.edu',
    password: '123456',
  };

  userPostData = { user_id: '', token: '' };

  constructor(
    private navCtrl: NavController,
    private authService: AuthService
  ) {
    this.userDetails = { user_id: '0', token: '' };
  }

  ngOnInit() {}

  login() {
    console.log('Lanzamos login');

    this.navCtrl.navigateRoot('/todo/focus');
  }

  /*
  login() {
    this.authService.login(this.userData.username, this.userData.password).subscribe({
      next: (response) => {
        this.authService.setToken(response.token); // Guarda el token
        this.navCtrl.navigateRoot('/todo/focus'); // Redirige al focus
      },
      error: (error) => {
        this.errMessage = 'Login failed. Please check your credentials.';
        console.error(error);
      },
    });
  }*/
}

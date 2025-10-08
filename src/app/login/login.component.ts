import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMsg = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMsg = res.message || 'Correo o contraseña incorrectos';
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error de conexión con el servidor';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  // 🔹 NUEVO: Navegar a cambio de contraseña
  goToChangePassword() {
    this.router.navigate(['/cambiar-contraseña']);
  }
}

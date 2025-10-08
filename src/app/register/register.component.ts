import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  nombre = '';
  email = '';
  password = '';
  fechaNacimiento = '';
  celular = '';
  rol = 'usuario';
  errorMsg = '';
  successMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.errorMsg = '';
    this.successMsg = '';

    this.authService.register({
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      fechaNacimiento: this.fechaNacimiento,
      celular: this.celular,
      rol: this.rol
    }).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.successMsg = 'Usuario creado con éxito! Redirigiendo...';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.errorMsg = res.message;
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error de conexión con el servidor';
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}

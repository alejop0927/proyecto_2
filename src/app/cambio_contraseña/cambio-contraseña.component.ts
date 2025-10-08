import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cambio-contraseña.component.html', // ← Cambia esta línea
})
export class ChangePasswordComponent {
  email = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  errorMsg = '';
  successMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  changePassword() {
    this.errorMsg = '';
    this.successMsg = '';

    // Validaciones
    if (!this.email) {
      this.errorMsg = 'El correo electrónico es requerido';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMsg = 'Las contraseñas no coinciden';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMsg = 'La nueva contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.authService.changePassword(this.email, this.currentPassword, this.newPassword).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.successMsg = 'Contraseña actualizada correctamente';
          // Limpiar formulario
          this.email = '';
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } else {
          this.errorMsg = res.message || 'No se pudo cambiar la contraseña';
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Error de conexión con el servidor';
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/login']);
  }
}
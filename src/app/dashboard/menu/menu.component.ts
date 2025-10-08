import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styles: []
})
export class DashboardMenuComponent {
  user: any = null;

  constructor() {
    // Cargar usuario guardado en localStorage después del login
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }

  logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}

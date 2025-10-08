import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DashboardMenuComponent } from '../menu/menu.component'; 

interface User {
  id: number;
  nombre: string;
  rol: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardMenuComponent],
  templateUrl: './dasboard.component.html',
})
export class DashboardComponent implements OnInit {
  currentYear = new Date().getFullYear();
  user: User | null = null; // ✅ agregar propiedad user

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Cargar usuario desde localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      this.router.navigate(['/login']); // redirigir si no hay usuario
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DashboardMenuComponent } from '../menu/menu.component';
import { IotService, DatosIoT } from '../../services/iot.service';

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
export class DashboardComponent implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  user: User | null = null;

  datosIoT: DatosIoT | null = null;
  estaConectado = false;
  private iotSubscription: any;

  constructor(
    private router: Router,
    private iotService: IotService
  ) {}

  ngOnInit(): void {
    // Cargar usuario
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      this.router.navigate(['/login']);
    }

    // Suscripción a datos IoT
    this.iotSubscription = this.iotService.datos$.subscribe(datos => {
      this.datosIoT = datos;
      this.estaConectado = !!datos;
    });

    // Estado inicial
    this.cargarDatosIoT();
  }

  cargarDatosIoT() {
    this.iotService.getEstadoActual().subscribe({
      next: (datos) => {
        this.datosIoT = datos;
        this.estaConectado = !!datos;
      },
      error: (error) => {
        console.error('Error obteniendo datos IoT:', error);
        this.estaConectado = false;
      }
    });
  }

  getCalidadAireTexto(calidad?: number): string {
    if (calidad == null) return '--';
    if (calidad < 300) return 'Excelente';
    if (calidad < 600) return 'Buena';
    if (calidad < 1000) return 'Moderada';
    if (calidad < 2000) return 'Mala';
    return 'Peligrosa';
  }

  getCalidadAireColor(calidad?: number): string {
    if (calidad == null) return 'bg-gray-100 text-gray-800';
    if (calidad < 300) return 'bg-green-100 text-green-800';
    if (calidad < 600) return 'bg-blue-100 text-blue-800';
    if (calidad < 1000) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  esAdvertencia(valor?: number, tipo?: string): boolean {
    if (valor == null || !tipo) return false;

    switch(tipo) {
      case 'temp': return valor < 10 || valor > 30;
      case 'hum': return valor < 30 || valor > 70;
      case 'calidad': return valor > 2000;
      default: return false;
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.iotSubscription?.unsubscribe();
  }
}

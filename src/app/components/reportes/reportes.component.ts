// reportes.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Venta {
  id: number;
  usuario: string;
  vehiculo: string;
  precio: number;
  fecha: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Reportes de Ventas</h2>
      
      <!-- Resumen -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-700">Total Ventas</h3>
          <p class="text-3xl font-bold text-blue-600">{{resumen.totalVentas}}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-700">Ingresos Totales</h3>
          <p class="text-3xl font-bold text-green-600">{{resumen.ingresosTotales}}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold text-gray-700">Promedio por Venta</h3>
          <p class="text-3xl font-bold text-purple-600">{{promedioVenta}}</p>
        </div>
      </div>

      <!-- Lista de Ventas -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehículo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr *ngFor="let venta of ventas">
              <td class="px-6 py-4 whitespace-nowrap">{{venta.id}}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{venta.usuario}}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{venta.vehiculo}}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{venta.precio}}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{venta.fecha | date:'short'}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ReportesComponent implements OnInit {
  ventas: Venta[] = [];
  resumen: any = {
    totalVentas: 0,
    ingresosTotales: 0
  };

  get promedioVenta(): number {
    return this.resumen.totalVentas > 0 
      ? this.resumen.ingresosTotales / this.resumen.totalVentas 
      : 0;
  }

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarReportes();
  }

  cargarReportes() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any>('http://localhost:4000/api/reportes/ventas', { headers })
      .subscribe({
        next: (data) => {
          this.ventas = data.ventas;
          this.resumen = {
            totalVentas: data.totalVentas,
            ingresosTotales: data.ingresosTotales
          };
        },
        error: (error) => console.error('Error:', error)
      });
  }
}
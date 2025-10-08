// lista-autos.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { DashboardMenuComponent } from '../../dashboard/menu/menu.component';

interface Auto {
  id: number;
  nombre: string;
  modelo: string;
  precio: number;
  color: string;
}

@Component({
  selector: 'app-lista-autos',
  standalone: true,
  imports: [CommonModule,DashboardMenuComponent],
  template: `
    <div class="p-6">
    <!-- Menú -->
    <app-dashboard-menu class="flex-1 mt-6"></app-dashboard-menu>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Gestión de Vehículos</h2>
        <button 
          (click)="irAAgregarAuto()"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          ➕ Agregar Auto
        </button>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr *ngFor="let auto of autos">
              <td class="px-6 py-4 whitespace-nowrap">{{auto.id}}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{auto.nombre}}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{auto.modelo}}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{auto.precio}}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{auto.color}}</td>
              <td class="px-6 py-4 whitespace-nowrap space-x-2">
                <button 
                  (click)="editarAuto(auto.id)"
                  class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  Editar
                </button>
                <button 
                  (click)="eliminarAuto(auto.id)"
                  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ListaAutosComponent implements OnInit {
  autos: Auto[] = [];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarAutos();
  }

  cargarAutos() {
    this.http.get<any>('http://localhost:4000/api/autos')
      .subscribe({
        next: (data) => this.autos = data.autos || data,
        error: (error) => console.error('Error:', error)
      });
  }

  irAAgregarAuto() {
    this.router.navigate(['/autos/nuevo']);
  }

  editarAuto(autoId: number) {
    this.router.navigate(['/autos/editar', autoId]);
  }

  eliminarAuto(autoId: number) {
    if (confirm('¿Estás seguro de eliminar este vehículo?')) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      this.http.delete(`http://localhost:4000/api/autos/${autoId}`, { headers })
        .subscribe({
          next: () => {
            alert('Vehículo eliminado');
            this.cargarAutos();
          },
          error: (error) => console.error('Error:', error)
        });
    }
  }
}
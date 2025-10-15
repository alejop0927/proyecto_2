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
  imports: [CommonModule, DashboardMenuComponent],
  template: `
    <div class="flex min-h-screen bg-white font-sans">
      <!-- Menú lateral -->
      <div class="w-64 flex-shrink-0">
        <app-dashboard-menu></app-dashboard-menu>
      </div>

      <!-- Contenido principal -->
      <div class="flex-1 p-10 bg-gradient-to-b from-white via-gray-50 to-gray-100">
        <div class="max-w-6xl mx-auto">
          <!-- Encabezado -->
          <div class="flex justify-between items-center mb-10 border-b border-gray-300 pb-4">
            <h2 class="text-3xl font-bold text-gray-800 tracking-wide uppercase">
              Gestión de Vehículos
            </h2>
            <button 
              (click)="irAAgregarAuto()"
              class="flex items-center gap-2 bg-[#003366] hover:bg-[#002244] text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-transform transform hover:scale-105">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" class="w-6 h-6" alt="BMW">
              <span>Agregar Auto</span>
            </button>
          </div>

          <!-- Tabla de autos -->
          <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-[#f2f2f2]">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nombre</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Modelo</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Precio</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Color</th>
                  <th class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr *ngFor="let auto of autos" class="hover:bg-[#e6f0ff] transition">
                  <td class="px-6 py-4 text-sm text-gray-800 font-medium">{{auto.id}}</td>
                  <td class="px-6 py-4 text-sm text-gray-700">{{auto.nombre}}</td>
                  <td class="px-6 py-4 text-sm text-gray-700">{{auto.modelo}}</td>
                  <td class="px-6 py-4 text-sm text-gray-700">$ {{auto.precio | number:'1.0-0'}}</td>
                  <td class="px-6 py-4 text-sm text-gray-700">{{auto.color}}</td>
                  <td class="px-6 py-4 flex gap-2">
                    <!-- Botón Editar -->
                    <button 
                      (click)="editarAuto(auto.id)"
                      class="flex items-center gap-1 bg-gray-800 hover:bg-black text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition">
                      <img src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png" alt="Editar" class="w-4 h-4">
                      Editar
                    </button>

                    <!-- Botón Eliminar -->
                    <button 
                      (click)="eliminarAuto(auto.id)"
                      class="flex items-center gap-1 bg-[#003366] hover:bg-[#001f3f] text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition">
                      <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="Eliminar" class="w-4 h-4">
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mensaje si no hay autos -->
          <div *ngIf="autos.length === 0" class="text-center py-16 bg-white rounded-2xl shadow-md mt-6 border border-gray-200">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" class="w-14 h-14 mx-auto mb-4" alt="BMW">
            <h3 class="text-lg font-semibold text-gray-700">No hay vehículos registrados</h3>
            <p class="text-gray-500 text-sm">Agrega un nuevo vehículo al sistema para comenzar.</p>
          </div>
        </div>
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
            alert('Vehículo eliminado correctamente');
            this.cargarAutos();
          },
          error: (error) => console.error('Error al eliminar:', error)
        });
    }
  }
}

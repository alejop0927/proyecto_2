import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DashboardMenuComponent } from '../dashboard/menu/menu.component';

interface Auto {
  id: number;
  Nombre: string;
  Modelo: string;
  Precio: number;
  Color: string;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

@Component({
  selector: 'app-registro-venta',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardMenuComponent],
  template: `
    <div class="min-h-screen flex bg-white text-gray-900">
      <!-- Menú lateral -->
      <div class="w-64 flex-shrink-0 bg-white shadow-md">
        <app-dashboard-menu></app-dashboard-menu>
      </div>

      <!-- Contenido principal -->
      <div class="flex-1 p-10 overflow-auto">
        <div class="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          <h2 class="text-3xl font-bold text-center text-[#0066b1] mb-6">Registrar Venta</h2>

          <!-- Selección de Usuario -->
          <div class="mb-5">
            <label class="block mb-2 font-semibold text-gray-800">Selecciona Usuario</label>
            <select [(ngModel)]="usuario_id"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066b1] focus:outline-none">
              <option value="" disabled>-- Elige un usuario --</option>
              <option *ngFor="let usuario of usuarios" [value]="usuario.id">
                {{ usuario.nombre }} ({{ usuario.email }})
              </option>
            </select>
          </div>

          <!-- Selección de Auto -->
          <div class="mb-5">
            <label class="block mb-2 font-semibold text-gray-800">Selecciona Auto</label>
            <select [(ngModel)]="auto_id"
                    class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066b1] focus:outline-none">
              <option value="" disabled>-- Elige un auto --</option>
              <option *ngFor="let auto of autos" [value]="auto.id">
                {{ auto.Nombre }} - {{ auto.Modelo }} ({{ auto.Precio | currency:'COP' }})
              </option>
            </select>
          </div>

          <!-- Precio -->
          <div class="mb-6">
            <label class="block mb-2 font-semibold text-gray-800">Precio Final</label>
            <input type="number"
                   [(ngModel)]="precio"
                   placeholder="Precio final"
                   class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0066b1] focus:outline-none" />
          </div>

          <!-- Botón principal -->
          <button (click)="registrarVenta()"
                  class="w-full bg-[#0066b1] hover:bg-[#004c80] text-white font-semibold py-2 rounded-lg transition">
            Registrar Venta
          </button>

          <!-- Mensajes -->
          <p class="mt-4 text-center text-red-600 font-semibold" *ngIf="mensaje">{{ mensaje }}</p>
          <p class="mt-4 text-center text-green-600 font-semibold" *ngIf="mensajeExito">{{ mensajeExito }}</p>
        </div>
      </div>
    </div>
  `
})
export class RegistroVentaComponent implements OnInit {
  autos: Auto[] = [];
  usuarios: Usuario[] = [];
  usuario_id: number | null = null;
  auto_id: number | null = null;
  precio: number | null = null;
  mensaje = '';
  mensajeExito = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarAutos();
    this.cargarUsuarios();
  }

  cargarAutos() {
    this.http.get<Auto[]>('http://localhost:4000/api/autos').subscribe({
      next: (autos) => (this.autos = autos),
      error: (error) => {
        console.error('Error cargando autos:', error);
        this.mensaje = 'Error al cargar la lista de autos';
      }
    });
  }

  cargarUsuarios() {
    this.http.get<Usuario[]>('http://localhost:4000/api/usuarios').subscribe({
      next: (usuarios) => (this.usuarios = usuarios),
      error: (error) => {
        console.error('Error cargando usuarios:', error);
        this.mensaje = 'Error al cargar la lista de usuarios';
      }
    });
  }

  registrarVenta() {
    this.mensaje = '';
    this.mensajeExito = '';

    if (!this.usuario_id || !this.auto_id || !this.precio) {
      this.mensaje = 'Todos los campos son obligatorios';
      return;
    }

    this.http.post('http://localhost:4000/api/ventas', {
      usuario_id: this.usuario_id,
      auto_id: this.auto_id,
      precio: this.precio
    }).subscribe({
      next: (response: any) => {
        this.mensajeExito = response.message || 'Venta registrada correctamente';
        this.usuario_id = null;
        this.auto_id = null;
        this.precio = null;
      },
      error: (error) => {
        console.error('Error registrando venta:', error);
        this.mensaje = error.error?.message || 'Error al registrar la venta';
      }
    });
  }
}

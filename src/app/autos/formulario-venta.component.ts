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
    <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 flex">
      <!-- Menú lateral -->
      <div class="w-64 flex-shrink-0">
        <app-dashboard-menu></app-dashboard-menu>
      </div>

      <!-- Contenido principal -->
      <div class="flex-1 p-6 overflow-auto">
        <div class="max-w-md mx-auto">
          <div class="bg-gray-900 text-white p-6 rounded-2xl shadow-xl border border-gray-800">
            <h2 class="text-2xl font-bold text-yellow-400 mb-4">Registrar Venta</h2>

            <div class="mb-4">
              <label class="block mb-1 font-semibold">Selecciona Usuario</label>
              <select [(ngModel)]="usuario_id" class="w-full p-2 rounded bg-gray-800 text-white border border-gray-700">
                <option value="" disabled>-- Elige un usuario --</option>
                <option *ngFor="let usuario of usuarios" [value]="usuario.id">
                  {{ usuario.nombre }} ({{ usuario.email }})
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block mb-1 font-semibold">Selecciona Auto</label>
              <select [(ngModel)]="auto_id" class="w-full p-2 rounded bg-gray-800 text-white border border-gray-700">
                <option value="" disabled>-- Elige un auto --</option>
                <option *ngFor="let auto of autos" [value]="auto.id">
                  {{ auto.Nombre }} - {{ auto.Modelo }} ({{ auto.Precio }})
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label class="block mb-1 font-semibold">Precio Final</label>
              <input type="number" [(ngModel)]="precio" placeholder="Precio final"
                    class="w-full p-2 rounded bg-gray-800 text-white border border-gray-700" />
            </div>

            <button (click)="registrarVenta()"
                    class="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-2 rounded transition">
              Registrar Venta
            </button>

            <p class="mt-4 text-center text-red-500 font-semibold" *ngIf="mensaje">{{ mensaje }}</p>
            <p class="mt-4 text-center text-green-500 font-semibold" *ngIf="mensajeExito">{{ mensajeExito }}</p>
          </div>
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
    this.http.get<Auto[]>('http://localhost:4000/api/autos')
      .subscribe({
        next: (autos) => {
          this.autos = autos;
        },
        error: (error) => {
          console.error('Error cargando autos:', error);
          this.mensaje = 'Error al cargar la lista de autos';
        }
      });
  }

  cargarUsuarios() {
    this.http.get<Usuario[]>('http://localhost:4000/api/usuarios')
      .subscribe({
        next: (usuarios) => {
          this.usuarios = usuarios;
        },
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
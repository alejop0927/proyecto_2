import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { DashboardMenuComponent } from '../dashboard/menu/menu.component';

@Component({
  selector: 'app-formulario-auto',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardMenuComponent],
  template: `
    <div class="min-h-screen bg-white flex">
      <!-- Menú lateral -->
      <div class="w-64 flex-shrink-0 bg-white border-r border-gray-200">
        <app-dashboard-menu></app-dashboard-menu>
      </div>

      <!-- Contenido principal -->
      <div class="flex-1 p-8 overflow-auto">
        <div class="max-w-4xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-2xl p-8">
          <h2 class="text-3xl font-extrabold text-gray-900 mb-6 text-center tracking-tight">
            <span class="text-blue-700">BMW</span> - Agregar Nuevo Vehículo
          </h2>

          <!-- Formulario -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Columna 1 -->
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                <input type="text" [(ngModel)]="nombre" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Precio (USD)</label>
                <input type="number" [(ngModel)]="precio" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Fecha de Fabricación</label>
                <input type="date" [(ngModel)]="fechaFabricacion" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Motor</label>
                <input type="text" [(ngModel)]="motor" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Combustible</label>
                <input type="text" [(ngModel)]="tipoCombustible" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>
            </div>

            <!-- Columna 2 -->
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Modelo</label>
                <input type="text" [(ngModel)]="modelo" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Color</label>
                <input type="text" [(ngModel)]="color" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">País</label>
                <input type="text" [(ngModel)]="paisFabricacion" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Transmisión</label>
                <input type="text" [(ngModel)]="transmision" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Carrocería</label>
                <input type="text" [(ngModel)]="tipoCarroceria" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>
            </div>

            <!-- Columna 3 -->
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Puertas</label>
                <input type="number" [(ngModel)]="numPuertas" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Pasajeros</label>
                <input type="number" [(ngModel)]="capacidadPasajeros" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Velocidades</label>
                <input type="number" [(ngModel)]="velocidades" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">RPM</label>
                <input type="number" [(ngModel)]="rpm" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Imagen (URL)</label>
                <input type="text" [(ngModel)]="imagen" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
              </div>
            </div>
          </div>

          <!-- Campos adicionales -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Consumo (km/l)</label>
              <input type="number" [(ngModel)]="consumo" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Emisiones CO₂ (g/km)</label>
              <input type="number" [(ngModel)]="emisionesCo2" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" />
            </div>
          </div>

          <!-- Botón principal -->
          <button (click)="agregarAuto()"
                  class="w-full bg-gradient-to-r from-blue-700 to-gray-800 hover:from-blue-800 hover:to-black text-white font-semibold py-3 rounded-xl shadow-lg mt-6 transition-all">
            <span class="flex items-center justify-center gap-2">
             
              Agregar Vehículo
            </span>
          </button>

          <!-- Mensajes -->
          <p class="mt-4 text-center text-green-600 font-medium" *ngIf="mensajeExito">{{ mensajeExito }}</p>
          <p class="mt-4 text-center text-red-600 font-medium" *ngIf="mensajeError">{{ mensajeError }}</p>
        </div>
      </div>
    </div>
  `
})
export class FormularioAutoComponent {
  nombre = '';
  modelo = '';
  precio: number | null = null;
  color = '';
  fechaFabricacion = '';
  paisFabricacion = '';
  motor = '';
  velocidades: number | null = null;
  rpm: number | null = null;
  tipoCombustible = '';
  transmision = '';
  tipoCarroceria = '';
  numPuertas: number | null = null;
  capacidadPasajeros: number | null = null;
  consumo: number | null = null;
  emisionesCo2: number | null = null;
  imagen = '';
  mensajeExito = '';
  mensajeError = '';

  constructor(private http: HttpClient) {}

  agregarAuto() {
    this.mensajeError = '';
    this.mensajeExito = '';

    this.http.post('http://localhost:4000/api/autos', {
      nombre: this.nombre,
      modelo: this.modelo,
      precio_usd: this.precio,
      color: this.color,
      fecha_fabricacion: this.fechaFabricacion,
      pais_fabricacion: this.paisFabricacion,
      motor: this.motor,
      velocidades: this.velocidades,
      rpm: this.rpm,
      tipo_combustible: this.tipoCombustible,
      transmision: this.transmision,
      tipo_carroceria: this.tipoCarroceria,
      num_puertas: this.numPuertas,
      capacidad_pasajeros: this.capacidadPasajeros,
      consumo: this.consumo,
      emisiones_co2: this.emisionesCo2,
      imagen: this.imagen
    }).subscribe({
      next: () => {
        this.mensajeExito = '🚗 Vehículo agregado exitosamente';
        this.limpiarFormulario();
      },
      error: () => {
        this.mensajeError = '❌ Error al agregar el vehículo';
      }
    });
  }

  limpiarFormulario() {
    this.nombre = '';
    this.modelo = '';
    this.precio = null;
    this.color = '';
    this.fechaFabricacion = '';
    this.paisFabricacion = '';
    this.motor = '';
    this.velocidades = null;
    this.rpm = null;
    this.tipoCombustible = '';
    this.transmision = '';
    this.tipoCarroceria = '';
    this.numPuertas = null;
    this.capacidadPasajeros = null;
    this.consumo = null;
    this.emisionesCo2 = null;
    this.imagen = '';
  }
}

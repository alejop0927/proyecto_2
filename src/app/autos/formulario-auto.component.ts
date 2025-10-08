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
    <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50 flex">
      <!-- Menú lateral -->
      <div class="w-64 flex-shrink-0">
        <app-dashboard-menu></app-dashboard-menu>
      </div>

      <!-- Contenido principal -->
      <div class="flex-1 p-4 overflow-auto">
        <div class="max-w-3xl mx-auto">
          <div class="bg-gray-900 text-white p-6 rounded-2xl shadow-xl border border-gray-800">
            <h2 class="text-2xl font-bold text-yellow-400 mb-4 text-center">Agregar Nuevo Vehículo</h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <!-- Columna 1 -->
              <div class="space-y-2">
                <div>
                  <label class="block text-sm font-semibold mb-1">Nombre</label>
                  <input type="text" [(ngModel)]="nombre" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-1">Precio</label>
                  <input type="number" [(ngModel)]="precio" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-1">Fecha Fabricación</label>
                  <input type="date" [(ngModel)]="fechaFabricacion" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-1">Motor</label>
                  <input type="text" [(ngModel)]="motor" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-1">Combustible</label>
                  <input type="text" [(ngModel)]="tipoCombustible" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
                </div>
              </div>

              <!-- Columna 2 -->
              <div class="space-y-2">
                <div>
                  <label class="block text-sm font-semibold mb-1">Modelo</label>
                  <input type="text" [(ngModel)]="modelo" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-1">Color</label>
                  <input type="text" [(ngModel)]="color" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-1">País</label>
                  <input type="text" [(ngModel)]="paisFabricacion" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-1">Transmisión</label>
                  <input type="text" [(ngModel)]="transmision" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-1">Carrocería</label>
                  <input type="text" [(ngModel)]="tipoCarroceria" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
                </div>
              </div>

              <!-- Columna 3 -->
              <div class="space-y-2">
                <div>
                  <label class="block text-sm font-semibold mb-1">Puertas</label>
                  <input type="number" [(ngModel)]="numPuertas" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-1">Pasajeros</label>
                  <input type="number" [(ngModel)]="capacidadPasajeros" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-1">Velocidades</label>
                  <input type="number" [(ngModel)]="velocidades" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-1">RPM</label>
                  <input type="number" [(ngModel)]="rpm" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
                </div>

                <div>
                  <label class="block text-sm font-semibold mb-1">Imagen</label>
                  <input type="text" [(ngModel)]="imagen" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
                </div>
              </div>
            </div>

            <!-- Campos adicionales compactos -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div>
                <label class="block text-sm font-semibold mb-1">Consumo</label>
                <input type="number" [(ngModel)]="consumo" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
              </div>

              <div>
                <label class="block text-sm font-semibold mb-1">Emisiones CO2</label>
                <input type="number" [(ngModel)]="emisionesCo2" class="w-full p-2 text-sm rounded bg-gray-800 text-white border border-gray-700" />
              </div>
            </div>

            <button (click)="agregarAuto()"
                    class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition text-sm mt-4">
              Agregar Vehículo
            </button>

            <p class="mt-3 text-center text-green-500 font-semibold text-sm" *ngIf="mensajeExito">{{ mensajeExito }}</p>
            <p class="mt-3 text-center text-red-500 font-semibold text-sm" *ngIf="mensajeError">{{ mensajeError }}</p>
          </div>
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
        this.mensajeExito = 'Vehículo agregado';
        this.limpiarFormulario();
      },
      error: (error) => {
        this.mensajeError = 'Error al agregar';
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
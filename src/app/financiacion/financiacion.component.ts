import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardMenuComponent } from '../dashboard/menu/menu.component';

interface PlanCuota {
  cuota: number;
  montoCuota: number;
  totalPagar: number;
  interes: number;
}

@Component({
  selector: 'app-financiacion',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardMenuComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      <!-- Menú lateral -->
      <div class="w-64 flex-shrink-0">
        <app-dashboard-menu></app-dashboard-menu>
      </div>

      <!-- Contenido principal -->
      <div class="flex-1 p-8 overflow-auto">
        <div class="max-w-6xl mx-auto">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">Simulador de Financiación</h1>
            <p class="text-gray-600 text-lg">Calcule su plan de pagos personalizado</p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Panel de entrada -->
            <div class="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
              <div class="flex items-center space-x-4 mb-6">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span class="text-2xl">💰</span>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-gray-800">Datos del Vehículo</h2>
                  <p class="text-gray-500 text-sm">Complete la información requerida</p>
                </div>
              </div>

              <div class="space-y-6">
                <!-- Precio del vehículo -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Precio del Vehículo (USD)
                  </label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                    <input type="number" [(ngModel)]="precioVehiculo" 
                           placeholder="0.00"
                           min="0"
                           (input)="calcularFinanciacion()"
                           class="w-full p-4 pl-10 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-lg font-semibold" />
                  </div>
                </div>

                <!-- Enganche -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span class="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Enganche (%)
                  </label>
                  <input type="range" [(ngModel)]="enganchePorcentaje" 
                         min="10" max="50" step="5"
                         (input)="calcularFinanciacion()"
                         class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600">
                  <div class="flex justify-between text-sm text-gray-600 mt-2">
                    <span>10%</span>
                    <span class="font-bold text-blue-600">{{ enganchePorcentaje }}%</span>
                    <span>50%</span>
                  </div>
                  <div class="text-center mt-2">
                    <span class="text-lg font-bold text-gray-700">{{ engancheMonto | number:'1.2-2' }}</span>
                    <span class="text-sm text-gray-500 ml-2">de enganche</span>
                  </div>
                </div>

                <!-- Plazo en meses -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Plazo de Financiación
                  </label>
                  <div class="grid grid-cols-4 gap-2">
                    <button *ngFor="let plazo of plazosDisponibles" 
                            (click)="seleccionarPlazo(plazo)"
                            [class]="plazoSeleccionado === plazo ? 
                                    'bg-blue-600 text-white' : 
                                    'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                            class="p-3 rounded-xl font-semibold transition-all duration-200 text-sm">
                      {{ plazo }} meses
                    </button>
                  </div>
                </div>

                <!-- Tasa de interés -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Tasa de Interés Anual (%)
                  </label>
                  <select [(ngModel)]="tasaInteresAnual" 
                          (change)="calcularFinanciacion()"
                          class="w-full p-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200">
                    <option value="8">8% - Excelente crédito</option>
                    <option value="12">12% - Buen crédito</option>
                    <option value="16">16% - Crédito estándar</option>
                    <option value="20">20% - Crédito básico</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Panel de resultados -->
            <div class="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
              <div class="flex items-center space-x-4 mb-6">
                <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                  <span class="text-2xl">📊</span>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-gray-800">Resumen de Financiación</h2>
                  <p class="text-gray-500 text-sm">Detalles de su plan de pagos</p>
                </div>
              </div>

              <!-- Resumen rápido -->
              <div *ngIf="precioVehiculo > 0" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-200">
                <div class="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div class="text-2xl font-bold text-blue-600">{{ montoFinanciar | number:'1.2-2' }}</div>
                    <div class="text-sm text-gray-600">A financiar</div>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-green-600">{{ cuotaMensual | number:'1.2-2' }}</div>
                    <div class="text-sm text-gray-600">Cuota mensual</div>
                  </div>
                </div>
              </div>

              <!-- Tabla de cuotas -->
              <div *ngIf="planesCuotas.length > 0" class="mb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Planes Disponibles</h3>
                <div class="overflow-hidden rounded-xl border border-gray-200">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cuotas</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cuota Mensual</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total a Pagar</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Interés</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr *ngFor="let plan of planesCuotas" 
                          [class]="plan.cuota === plazoSeleccionado ? 'bg-blue-50 border-2 border-blue-200' : 'hover:bg-gray-50'"
                          class="transition-colors duration-200 cursor-pointer"
                          (click)="seleccionarPlazo(plan.cuota)">
                        <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ plan.cuota }}</td>
                        <td class="px-4 py-3 text-sm text-gray-900 font-semibold">{{ plan.montoCuota | number:'1.2-2' }}</td>
                        <td class="px-4 py-3 text-sm text-gray-900">{{ plan.totalPagar | number:'1.2-2' }}</td>
                        <td class="px-4 py-3 text-sm text-gray-900">{{ plan.interes | number:'1.2-2' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Detalles del plan seleccionado -->
              <div *ngIf="plazoSeleccionado && precioVehiculo > 0" class="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Detalle del Plan Seleccionado</h3>
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Precio del vehículo:</span>
                    <span class="font-semibold">{{ precioVehiculo | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Enganche ({{ enganchePorcentaje }}%):</span>
                    <span class="font-semibold">{{ engancheMonto | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Monto a financiar:</span>
                    <span class="font-semibold">{{ montoFinanciar | number:'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Plazo:</span>
                    <span class="font-semibold">{{ plazoSeleccionado }} meses</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Tasa de interés:</span>
                    <span class="font-semibold">{{ tasaInteresAnual }}% anual</span>
                  </div>
                  <div class="border-t border-green-200 pt-3 mt-3">
                    <div class="flex justify-between text-lg font-bold">
                      <span class="text-gray-800">Cuota mensual:</span>
                      <span class="text-green-600">{{ cuotaMensual | number:'1.2-2' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Estado inicial -->
              <div *ngIf="precioVehiculo === 0" class="text-center py-12">
                <div class="text-6xl mb-4">🚗</div>
                <h3 class="text-xl font-semibold text-gray-600 mb-2">Complete los datos del vehículo</h3>
                <p class="text-gray-500">Ingrese el precio para ver las opciones de financiación</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FinanciacionComponent {
  precioVehiculo = 0;
  enganchePorcentaje = 20;
  plazoSeleccionado = 36;
  tasaInteresAnual = 12;

  plazosDisponibles = [12, 24, 36, 48];
  planesCuotas: PlanCuota[] = [];

  // Propiedades calculadas
  get engancheMonto(): number {
    return (this.precioVehiculo * this.enganchePorcentaje) / 100;
  }

  get montoFinanciar(): number {
    return this.precioVehiculo - this.engancheMonto;
  }

  get cuotaMensual(): number {
    if (this.montoFinanciar <= 0) return 0;
    
    const tasaMensual = (this.tasaInteresAnual / 100) / 12;
    const factor = Math.pow(1 + tasaMensual, this.plazoSeleccionado);
    return (this.montoFinanciar * tasaMensual * factor) / (factor - 1);
  }

  constructor() {
    this.calcularFinanciacion();
  }

  seleccionarPlazo(plazo: number) {
    this.plazoSeleccionado = plazo;
    this.calcularFinanciacion();
  }

  calcularFinanciacion() {
    this.planesCuotas = this.plazosDisponibles.map(plazo => {
      const tasaMensual = (this.tasaInteresAnual / 100) / 12;
      const factor = Math.pow(1 + tasaMensual, plazo);
      const montoCuota = (this.montoFinanciar * tasaMensual * factor) / (factor - 1);
      const totalPagar = montoCuota * plazo;
      const interes = totalPagar - this.montoFinanciar;

      return {
        cuota: plazo,
        montoCuota: montoCuota || 0,
        totalPagar: totalPagar || 0,
        interes: interes || 0
      };
    });
  }
}
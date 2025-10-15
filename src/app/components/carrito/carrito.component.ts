import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DashboardMenuComponent } from '../../dashboard/menu/menu.component';

interface ItemCarrito {
  id: number;
  Nombre: string;
  Modelo: string;
  Precio: number;
  Color: string;
}

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, DashboardMenuComponent],
  template: `
  <div class="flex min-h-screen bg-white font-sans text-gray-900">

    <!-- Sidebar BMW -->
    <aside class="hidden lg:flex flex-col w-64 bg-[#0A0A0A] text-white shadow-2xl">
      <app-dashboard-menu class="flex-1 mt-6"></app-dashboard-menu>
    </aside>

    <!-- Contenido principal -->
    <main class="flex-1 p-8 bg-gradient-to-b from-white to-gray-50">
      <h2 class="text-3xl font-bold text-gray-900 mb-10 flex items-center gap-3 border-b border-gray-200 pb-4">
        <i class="fa-solid fa-cart-shopping text-[#003366] text-2xl"></i>
        Mi Carrito
      </h2>

      <!-- Carrito vacío -->
      <section *ngIf="carritoItems.length === 0" 
               class="text-center py-20 bg-gray-50 rounded-2xl shadow-inner border border-gray-200">
       
           
        <h3 class="text-2xl font-semibold text-gray-800 mb-2">Tu carrito está vacío</h3>
        <p class="text-gray-500 mb-6">Explora nuestro catálogo  EasyDrive y agrega tus modelos favoritos.</p>
        <button (click)="irAlCatalogo()" 
                class="bg-[#003366] hover:bg-[#1a4a7a] text-white px-6 py-3 rounded-lg font-semibold shadow-md transition">
          <i class="fa-solid fa-car text-white mr-2"></i> Explorar Catálogo
        </button>
      </section>

      <!-- Carrito con ítems -->
      <section *ngIf="carritoItems.length > 0" class="space-y-6">
        <div *ngFor="let item of carritoItems; let i = index"
             class="bg-white rounded-xl shadow-md p-6 flex items-center gap-5 border border-gray-200 hover:shadow-xl transition relative overflow-hidden">

          <!-- Imagen decorativa -->
                 
          <div class="flex-1">
            <h3 class="font-bold text-lg text-gray-900">{{ item.Nombre }}</h3>
            <p class="text-gray-600">{{ item.Modelo }} - {{ item.Color }}</p>
            <p class="text-[#003366] font-bold text-xl mt-2">
              {{ item.Precio | currency:'USD':'symbol':'1.0-0' }}
            </p>
          </div>

          <!-- Botón eliminar -->
          <button (click)="eliminarDelCarrito(i)"
                  class="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-semibold shadow transition">
            <i class="fa-solid fa-trash-can mr-2"></i> Eliminar
          </button>
        </div>

        <!-- Resumen total -->
        <div class="bg-gray-50 rounded-2xl shadow-inner border border-gray-200 p-6 mt-10">
          <div class="flex justify-between items-center mb-6">
            <span class="text-xl font-semibold text-gray-800">Total:</span>
            <span class="text-3xl font-bold text-[#003366]">
              {{ total | currency:'USD':'symbol':'1.0-0' }}
            </span>
          </div>

          <div class="flex flex-col sm:flex-row gap-4">
            <button (click)="seguirComprando()"
                    class="flex-1 bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-lg font-semibold transition">
              <i class="fa-solid fa-arrow-left mr-2"></i> Seguir Comprando
            </button>
            <button (click)="comprarTodo()"
                    class="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-semibold transition">
              <i class="fa-solid fa-credit-card mr-2"></i> Comprar Todo
            </button>
          </div>
        </div>
      </section>

      <!-- Mensaje flotante -->
      <div *ngIf="mensaje"
           class="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-2"
           [class]="mensajeExito ? 'bg-green-600 text-white' : 'bg-red-600 text-white'">
        <i class="fa-solid" [ngClass]="mensajeExito ? 'fa-check-circle' : 'fa-circle-exclamation'"></i>
        {{ mensaje }}
      </div>
    </main>
  </div>
  `
})
export class CarritoComponent implements OnInit {
  carritoItems: ItemCarrito[] = [];
  mensaje = '';
  mensajeExito = false;
  usuarioId: number | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.obtenerUsuarioActual();
    this.cargarCarrito();
  }

  obtenerUsuarioActual() {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.usuarioId = userData.id;
    }
  }

  cargarCarrito() {
    const carrito = localStorage.getItem('carrito');
    this.carritoItems = carrito ? JSON.parse(carrito) : [];
  }

  get total(): number {
    return this.carritoItems.reduce((sum, item) => sum + item.Precio, 0);
  }

  eliminarDelCarrito(index: number) {
    this.carritoItems.splice(index, 1);
    this.guardarCarrito();
    this.mostrarMensaje('Vehículo eliminado del carrito', true);
  }

  guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(this.carritoItems));
  }

  seguirComprando() {
    this.router.navigate(['/catalogo-mejorado']);
  }

  irAlCatalogo() {
    this.router.navigate(['/catalogo-mejorado']);
  }

  async comprarTodo() {
    if (!this.usuarioId) {
      this.mostrarMensaje('Debes iniciar sesión para comprar', false);
      return;
    }

    const cantidadVehiculos = this.carritoItems.length;
    const totalFormateado = this.total.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });

    if (confirm(`¿Deseas comprar ${cantidadVehiculos} vehículo(s) por un total de ${totalFormateado}?`)) {
      try {
        for (const item of this.carritoItems) {
          await this.registrarCompra(item);
        }
        this.carritoItems = [];
        this.guardarCarrito();
        this.mostrarMensaje('¡Compra completada con éxito!', true);
        setTimeout(() => this.router.navigate(['/catalogo-mejorado']), 2000);
      } catch (error) {
        console.error('Error al procesar la compra:', error);
        this.mostrarMensaje('Error al procesar la compra', false);
      }
    }
  }

  registrarCompra(auto: ItemCarrito): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:4000/api/compras', {
        usuario_id: this.usuarioId,
        vehiculo_id: auto.id,
        estado: 'comprado'
      }).subscribe({
        next: () => resolve(),
        error: (error) => reject(error)
      });
    });
  }

  mostrarMensaje(mensaje: string, exito: boolean) {
    this.mensaje = mensaje;
    this.mensajeExito = exito;
    setTimeout(() => (this.mensaje = ''), 4000);
  }
}

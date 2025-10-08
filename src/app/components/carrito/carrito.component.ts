// carrito.component.ts (CORREGIDO)
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

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
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">🛒 Mi Carrito</h2>

        <div *ngIf="carritoItems.length === 0" class="text-center py-12 bg-white rounded-2xl shadow-lg">
          <div class="text-gray-400 text-6xl mb-4">🛒</div>
          <h3 class="text-xl font-semibold text-gray-600 mb-2">Tu carrito está vacío</h3>
          <p class="text-gray-500 mb-4">Agrega algunos vehículos desde nuestro catálogo</p>
          <button (click)="irAlCatalogo()" 
                  class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
            Explorar Catálogo
          </button>
        </div>

        <div *ngIf="carritoItems.length > 0" class="space-y-4">
          <!-- Items del carrito -->
          <div *ngFor="let item of carritoItems; let i = index" 
               class="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4">
            
            <div class="w-24 h-24 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg flex items-center justify-center">
              <span class="text-2xl opacity-60">🚗</span>
            </div>
          
            <div class="flex-1">
              <h3 class="font-bold text-lg text-gray-900">{{item.Nombre}}</h3>
              <p class="text-gray-600">{{item.Modelo}} - {{item.Color}}</p>
              <p class="text-green-600 font-bold text-xl mt-2">{{item.Precio | currency:'USD':'symbol':'1.0-0'}}</p>
            </div>

            <button (click)="eliminarDelCarrito(i)" 
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
              ❌ Eliminar
            </button>
          </div>

          <!-- Resumen y pago -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <div class="flex justify-between items-center mb-6">
              <span class="text-xl font-semibold text-gray-900">Total:</span>
              <span class="text-3xl font-bold text-green-600">{{total | currency:'USD':'symbol':'1.0-0'}}</span>
            </div>
            
            <div class="flex gap-4">
              <button (click)="seguirComprando()" 
                      class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg transition-colors font-semibold">
                ← Seguir Comprando
              </button>
              <button (click)="comprarTodo()" 
                      class="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition-colors font-semibold">
                💰 Comprar Todo
              </button>
            </div>
          </div>
        </div>

        <!-- Mensaje de confirmación -->
        <div *ngIf="mensaje" class="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50" 
             [class]="mensajeExito ? 'bg-green-500 text-white' : 'bg-red-500 text-white'">
          {{mensaje}}
        </div>
      </div>
    </div>
  `
})
export class CarritoComponent implements OnInit {
  carritoItems: ItemCarrito[] = [];
  mensaje: string = '';
  mensajeExito: boolean = false;
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

    if (confirm(`¿Estás seguro de que deseas comprar ${cantidadVehiculos} vehículo(s) por un total de ${totalFormateado}?`)) {
      try {
        // Guardar la cantidad antes de vaciar el carrito
        const cantidad = this.carritoItems.length;
        
        // Procesar cada item del carrito con estado "comprado"
        for (const item of this.carritoItems) {
          await this.registrarCompra(item);
        }

        // Vaciar carrito después de procesar todo
        this.carritoItems = [];
        this.guardarCarrito();
        
        // Mostrar mensaje con la cantidad correcta
        this.mostrarMensaje(`¡${cantidad} vehículo(s) comprados con éxito! Estado: COMPRADO`, true);
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/catalogo-mejorado']);
        }, 2000);
        
      } catch (error) {
        console.error('Error procesando compra:', error);
        this.mostrarMensaje('Error al procesar la compra', false);
      }
    }
  }

  registrarCompra(auto: ItemCarrito): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:4000/api/compras', {
        usuario_id: this.usuarioId,
        vehiculo_id: auto.id,
        estado: 'comprado'  // Cambiado a "comprado" en lugar de "entregado"
      }).subscribe({
        next: () => resolve(),
        error: (error) => {
          console.error('Error registrando compra:', error);
          reject(error);
        }
      });
    });
  }

  mostrarMensaje(mensaje: string, exito: boolean) {
    this.mensaje = mensaje;
    this.mensajeExito = exito;
    setTimeout(() => {
      this.mensaje = '';
    }, 4000);
  }
}
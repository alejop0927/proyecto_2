// favoritos.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { DashboardMenuComponent } from '../../dashboard/menu/menu.component';

interface AutoFavorito {
  id: number;
  vehiculo_id: number;
  nombre: string;
  modelo: string;
  precio: number;
  color: string;
  tipo_combustible: string;
  transmision: string;
  created_at: string;
}

@Component({
  selector: 'app-favoritos',
  standalone: true,
  imports: [CommonModule, RouterModule, DashboardMenuComponent],
  template: `
<div class="flex min-h-screen bg-gray-900 text-white">

  <!-- Sidebar -->
  <aside class="flex flex-col w-64 bg-gradient-to-b from-gray-800 to-gray-900 p-6 space-y-6 shadow-xl border-r border-yellow-500/20 rounded-tr-2xl rounded-br-2xl">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-yellow-400 tracking-wide">Dashboard</h2>
    </div>
    <!-- Menú -->
    <app-dashboard-menu class="flex-1 mt-6"></app-dashboard-menu>

    <!-- Footer usuario -->
    <div class="mt-auto text-gray-300 space-y-2">
      <div *ngIf="user" class="font-semibold">
        {{ user.nombre }} <span class="text-yellow-400 italic">({{ user.rol }})</span>
      </div>
      <button *ngIf="user"
              (click)="logout()"
              class="w-full py-2 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition-all">
        Cerrar Sesión
      </button>
    </div>
  </aside>

  <!-- Contenido principal -->
  <div class="flex-1 flex flex-col bg-gray-100">

    <!-- Header -->
    <header class="flex justify-between items-center p-4 bg-gray-200 shadow-lg border-b border-yellow-400 rounded-b-xl">
      <h1 class="text-2xl font-bold text-gray-800">Mis Favoritos ❤️</h1>
      <a routerLink="/cerrar" 
         class="text-gray-800 hover:text-yellow-500 transition flex items-center gap-2 font-semibold">
        <i class="fas fa-sign-out-alt"></i> Cerrar
      </a>
    </header>

    <!-- Contenido central -->
    <main class="flex-1 p-8 bg-gray-100">
      <div *ngIf="favoritos.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">❤️</div>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">No tienes vehículos en favoritos</h3>
        <p class="text-gray-500">Explora nuestro catálogo y agrega tus vehículos favoritos</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let auto of favoritos" 
             class="bg-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden border border-gray-200 group">

          <!-- Imagen auto -->
          <div class="h-48 bg-gradient-to-br from-yellow-50 to-yellow-100 relative overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-6xl opacity-20">🚗</div>
            </div>
            <div class="absolute top-4 right-4">
              <span class="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Favorito
              </span>
            </div>
          </div>

          <!-- Info auto -->
          <div class="p-6">
            <h3 class="font-bold text-xl text-gray-900 mb-2">{{auto.nombre}}</h3>
            <p class="text-gray-500 text-sm mb-3">{{auto.modelo}}</p>

            <div class="flex items-center gap-2 mb-3">
              <div class="w-4 h-4 rounded-full border border-gray-300" [style.background-color]="getColorHex(auto.color)"></div>
              <span class="text-gray-700 text-sm">{{auto.color}}</span>
            </div>

            <p class="text-green-600 font-bold text-xl mb-4">{{auto.precio | currency:'USD':'symbol':'1.0-0'}}</p>

            <div class="flex gap-2">
              <button (click)="comprarAuto(auto.vehiculo_id)" 
                      class="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 px-4 rounded-lg transition-all duration-200 font-semibold">
                💰 Comprar
              </button>
              <button (click)="eliminarFavorito(auto.id)" 
                      class="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-2.5 rounded-lg transition-all duration-200">
                ❌
              </button>
            </div>
          </div>

        </div>
      </div>

      <!-- Mensaje de alerta -->
      <div *ngIf="mensaje" class="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50" 
           [class]="mensajeExito ? 'bg-green-500 text-white' : 'bg-red-500 text-white'">
        {{mensaje}}
      </div>

    </main>
  </div>
</div>
  `
})
export class FavoritosComponent implements OnInit {
  favoritos: AutoFavorito[] = [];
  mensaje: string = '';
  mensajeExito: boolean = false;
  usuarioId: number | null = null;
  user: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerUsuarioActual();
    this.cargarFavoritos();
  }

  obtenerUsuarioActual() {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      this.usuarioId = userData.id;
      this.user = userData;
    }
  }

  cargarFavoritos() {
    if (!this.usuarioId) {
      this.mostrarMensaje('Debes iniciar sesión para ver favoritos', false);
      return;
    }

    this.http.get<AutoFavorito[]>(`http://localhost:4000/api/favoritos?usuario_id=${this.usuarioId}`)
      .subscribe({
        next: (data) => this.favoritos = data,
        error: (error) => {
          console.error('Error cargando favoritos:', error);
          this.mostrarMensaje('Error al cargar favoritos', false);
        }
      });
  }

  comprarAuto(autoId: number) {
    if (!this.usuarioId) {
      this.mostrarMensaje('Debes iniciar sesión para comprar', false);
      return;
    }

    if (confirm('¿Estás seguro de que deseas comprar este vehículo?')) {
      this.http.post('http://localhost:4000/api/compras', {
        usuario_id: this.usuarioId,
        vehiculo_id: autoId
      }).subscribe({
        next: (response: any) => {
          this.mostrarMensaje(response.message || '¡Compra realizada con éxito!', true);
        },
        error: (error) => {
          console.error('Error en la compra:', error);
          this.mostrarMensaje(error.error?.message || 'Error al procesar la compra', false);
        }
      });
    }
  }

  eliminarFavorito(favoritoId: number) {
    this.http.delete(`http://localhost:4000/api/favoritos/${favoritoId}`)
      .subscribe({
        next: () => {
          this.favoritos = this.favoritos.filter(f => f.id !== favoritoId);
          this.mostrarMensaje('Eliminado de favoritos', true);
        },
        error: (error) => {
          console.error('Error eliminando favorito:', error);
          this.mostrarMensaje('Error al eliminar de favoritos', false);
        }
      });
  }

  mostrarMensaje(mensaje: string, exito: boolean) {
    this.mensaje = mensaje;
    this.mensajeExito = exito;
    setTimeout(() => { this.mensaje = ''; }, 3000);
  }

  getColorHex(colorName: string): string {
    const colorMap: { [key: string]: string } = {
      'rojo': '#dc2626', 'azul': '#2563eb', 'negro': '#000000', 'blanco': '#ffffff',
      'gris': '#6b7280', 'plateado': '#c0c0c0', 'verde': '#16a34a', 'amarillo': '#eab308',
      'naranja': '#ea580c', 'morado': '#9333ea', 'rosa': '#db2777', 'marron': '#92400e', 'beige': '#d6d3d1'
    };
    const normalizedColor = colorName.toLowerCase().trim();
    return colorMap[normalizedColor] || '#6b7280';
  }

  logout() {
    localStorage.removeItem('user');
    location.reload();
  }
}

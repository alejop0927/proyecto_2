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
<div class="flex min-h-screen bg-white text-gray-900">

  <!-- Menú lateral -->
  <app-dashboard-menu class="w-64 bg-white shadow-md border-r border-gray-200"></app-dashboard-menu>

  <!-- Contenido principal -->
  <div class="flex-1 p-10">

    <h2 class="text-3xl font-bold text-gray-800 mb-8 border-b-4 border-blue-700 inline-block pb-2">
      Mis Vehículos Favoritos
    </h2>

    <!-- Si no hay favoritos -->
    <div *ngIf="favoritos.length === 0" class="text-center py-20">
      <img src="assets/bmw_logo.png" alt="BMW Logo" class="w-24 mx-auto mb-6 opacity-80">
      <h3 class="text-2xl font-semibold text-gray-700 mb-2">No tienes vehículos en favoritos</h3>
      <p class="text-gray-500">Explora el catálogo y agrega tus modelos BMW preferidos.</p>
    </div>

    <!-- Lista de favoritos -->
    <div *ngIf="favoritos.length > 0" 
         class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

      <div *ngFor="let auto of favoritos" 
           class="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl transition duration-300 overflow-hidden">

        <!-- Imagen del vehículo -->
        <div class="h-48 bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center relative">
                    <!-- Imagen simulada (ícono de auto gris) -->
          <div class="absolute inset-0 opacity-10 bg-[url('https://cdn-icons-png.flaticon.com/512/3202/3202926.png')] bg-center bg-no-repeat bg-contain"></div>
        </div>

        <!-- Información -->
        <div class="p-6">
          <h3 class="font-bold text-lg text-gray-900 mb-1">{{ auto.nombre }}</h3>
          <p class="text-gray-500 text-sm mb-3">{{ auto.modelo }}</p>

          <div class="flex items-center gap-2 mb-3">
            <div class="w-4 h-4 rounded-full border border-gray-400"
                 [style.background-color]="getColorHex(auto.color)"></div>
            <span class="text-gray-600 text-sm capitalize">{{ auto.color }}</span>
          </div>

          <p class="text-blue-700 font-semibold text-xl mb-4">
            {{ auto.precio | currency:'USD':'symbol':'1.0-0' }}
          </p>

          <div class="flex gap-2">
            <button (click)="comprarAuto(auto.vehiculo_id)"
                    class="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition">
              <i class="fas fa-shopping-cart"></i>
              <span>Comprar</span>
            </button>

            <button (click)="eliminarFavorito(auto.id)"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-700 p-2.5 rounded-lg transition">
              <i class="fas fa-trash-alt">Eliminar</i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje de alerta -->
    <div *ngIf="mensaje"
         class="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 font-medium"
         [ngClass]="mensajeExito ? 'bg-blue-700 text-white' : 'bg-red-600 text-white'">
      {{ mensaje }}
    </div>
  </div>
</div>
  `
})
export class FavoritosComponent implements OnInit {
  favoritos: AutoFavorito[] = [];
  mensaje = '';
  mensajeExito = false;
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

    if (confirm('¿Deseas comprar este vehículo BMW?')) {
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
          this.mostrarMensaje('Vehículo eliminado de favoritos', true);
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
      'rojo': '#c1121f', 'azul': '#0033a0', 'negro': '#000000', 'blanco': '#ffffff',
      'gris': '#7a7a7a', 'plateado': '#b0b0b0', 'verde': '#007a3d', 'amarillo': '#ffcc00',
      'naranja': '#ff6600', 'morado': '#4b0082', 'rosa': '#e75480', 'marron': '#5c4033', 'beige': '#d6d3d1'
    };
    const normalizedColor = colorName.toLowerCase().trim();
    return colorMap[normalizedColor] || '#7a7a7a';
  }

  logout() {
    localStorage.removeItem('user');
    location.reload();
  }
}

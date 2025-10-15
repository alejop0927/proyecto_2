import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DashboardMenuComponent } from '../../dashboard/menu/menu.component';

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
  rol: string;
}

@Component({
  selector: 'app-catalogo-mejorado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, DashboardMenuComponent],
  template: `
  <div class="flex min-h-screen bg-white">

    <!-- Sidebar -->
    <aside class="hidden lg:flex flex-col w-64 bg-gray-950 text-white shadow-2xl">
      
      <app-dashboard-menu class="flex-1 mt-6"></app-dashboard-menu>
    </aside>

    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col p-8">

      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900">Catálogo EasyDrive</h1>
          <p class="text-gray-600 mt-1">Elegancia, potencia y tecnología alemana.</p>
        </div>
        
        <div class="flex gap-4 items-center flex-wrap">
          <!-- Botón Carrito -->
          <button (click)="irAlCarrito()" 
                  class="relative bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 flex items-center gap-2">
            <span class="text-xl">🛒</span>
            <span class="hidden sm:block">Carrito</span>
            <div *ngIf="cantidadCarrito > 0" 
                 class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {{cantidadCarrito}}
            </div>
          </button>

          <input type="text" [(ngModel)]="filtroBusqueda" 
                 placeholder="Buscar vehículo..." 
                 class="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-600">
          
          <button *ngIf="rolUsuario === 'admin'" 
                  (click)="irAAgregarAuto()"
                  class="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-md transition-all duration-300">
            ➕ Agregar Auto
          </button>
        </div>
      </div>

      <!-- Grid de autos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div *ngFor="let auto of autosFiltrados" 
             class="rounded-2xl shadow-xl bg-gray-100 border border-gray-300 overflow-hidden relative group hover:shadow-2xl transition-all duration-300">

          <!-- Imagen simulada (ícono de auto gris) -->
          <div class="absolute inset-0 opacity-10 bg-[url('https://cdn-icons-png.flaticon.com/512/3202/3202926.png')] bg-center bg-no-repeat bg-contain"></div>

          <!-- Información -->
          <div class="relative z-10 p-6">
            <h3 class="font-bold text-2xl text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
              {{auto.Nombre}}
            </h3>
            <p class="text-gray-600 text-sm">{{auto.Modelo}}</p>

            <div class="flex items-center gap-2 mt-3">
              <div class="w-4 h-4 rounded-full border border-gray-400" [style.background-color]="getColorHex(auto.Color)"></div>
              <span class="text-gray-700 font-medium">{{auto.Color}}</span>
            </div>

            <p class="text-blue-800 font-bold text-xl mt-3 mb-5">
              {{auto.Precio | currency:'USD':'symbol':'1.0-0'}}
            </p>

            <div class="flex gap-2">
              <button (click)="agregarAlCarrito(auto)" 
                      class="flex-1 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white py-2.5 rounded-lg font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                🛒 Añadir
              </button>

              <button (click)="agregarFavorito(auto.id)" 
                      class="bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center">
                ♡
              </button>

              <button *ngIf="rolUsuario === 'admin'"
                      (click)="eliminarAuto(auto.id)" 
                      class="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensajes -->
      <div *ngIf="mensaje" class="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50"
           [class]="mensajeExito ? 'bg-green-600 text-white' : 'bg-red-600 text-white'">
        {{mensaje}}
      </div>

      <!-- Sin resultados -->
      <div *ngIf="autosFiltrados.length === 0" class="text-center py-20 text-gray-500">
        <div class="text-6xl mb-3">🚘</div>
        <h3 class="text-lg font-semibold">
          {{filtroBusqueda ? 'No se encontraron resultados' : 'No hay vehículos disponibles'}}
        </h3>
        <p class="text-gray-400 text-sm">
          {{filtroBusqueda ? 'Prueba con otro nombre o modelo' : 'Agrega el primer auto al catálogo'}}
        </p>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class CatalogoMejoradoComponent implements OnInit {
  autos: Auto[] = [];
  filtroBusqueda = '';
  paginaActual = 1;
  totalPaginas = 1;
  autosPorPagina = 12;

  rolUsuario: string | null = null;
  usuarioId: number | null = null;
  mensaje: string = '';
  mensajeExito: boolean = false;
  cantidadCarrito: number = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.cargarAutos();
    this.obtenerUsuarioActual();
    this.actualizarContadorCarrito();
  }

  obtenerUsuarioActual() {
    try {
      const user = localStorage.getItem('user');
      if (user) {
        const userData: Usuario = JSON.parse(user);
        this.rolUsuario = userData.rol || null;
        this.usuarioId = userData.id || null;
      } else {
        this.rolUsuario = null;
        this.usuarioId = null;
      }
    } catch {
      this.rolUsuario = null;
      this.usuarioId = null;
    }
  }

  cargarAutos() {
    this.http.get<Auto[]>('http://localhost:4000/api/autos').subscribe({
      next: (data) => {
        this.autos = data;
        this.totalPaginas = Math.ceil(this.autos.length / this.autosPorPagina);
      },
      error: () => this.mostrarMensaje('Error al cargar los vehículos', false)
    });
  }

  actualizarContadorCarrito() {
    const carrito = localStorage.getItem('carrito');
    this.cantidadCarrito = carrito ? JSON.parse(carrito).length : 0;
  }

  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }

  irAAgregarAuto() {
    this.router.navigate(['/autos/nuevo']);
  }

  agregarAlCarrito(auto: Auto) {
    if (!this.usuarioId) return this.mostrarMensaje('Debes iniciar sesión', false);
    let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    if (carrito.find((item: any) => item.id === auto.id))
      return this.mostrarMensaje('Este vehículo ya está en tu carrito', false);
    carrito.push(auto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    this.actualizarContadorCarrito();
    this.mostrarMensaje('Vehículo agregado al carrito', true);
  }

  eliminarAuto(autoId: number) {
    if (confirm('¿Seguro deseas eliminar este vehículo?')) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      this.http.delete(`http://localhost:4000/api/autos/${autoId}`, { headers }).subscribe({
        next: () => { this.mostrarMensaje('Vehículo eliminado correctamente', true); this.cargarAutos(); },
        error: () => this.mostrarMensaje('Error al eliminar el vehículo', false)
      });
    }
  }

  agregarFavorito(autoId: number) {
    if (!this.usuarioId) return this.mostrarMensaje('Debes iniciar sesión', false);
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.post('http://localhost:4000/api/favoritos', { usuario_id: this.usuarioId, vehiculo_id: autoId }, { headers })
      .subscribe({
        next: (res: any) => this.mostrarMensaje(res.message || 'Agregado a favoritos', true),
        error: (err) => {
          if (err.status === 409) this.mostrarMensaje('El vehículo ya está en favoritos', false);
          else this.mostrarMensaje('Error al agregar a favoritos', false);
        }
      });
  }

  mostrarMensaje(mensaje: string, exito: boolean) {
    this.mensaje = mensaje;
    this.mensajeExito = exito;
    setTimeout(() => (this.mensaje = ''), 4000);
  }

  getColorHex(colorName: string): string {
    const colorMap: { [key: string]: string } = {
      'rojo': '#dc2626', 'azul': '#2563eb', 'negro': '#000000', 'blanco': '#ffffff',
      'gris': '#6b7280', 'plateado': '#c0c0c0', 'verde': '#16a34a', 'amarillo': '#eab308',
      'naranja': '#ea580c', 'morado': '#9333ea', 'rosa': '#db2777', 'marron': '#92400e', 'beige': '#d6d3d1'
    };
    return colorMap[colorName.toLowerCase().trim()] || '#6b7280';
  }

  get autosFiltrados(): Auto[] {
    let filtrados = this.autos;
    if (this.filtroBusqueda) {
      const filtro = this.filtroBusqueda.toLowerCase();
      filtrados = filtrados.filter(auto =>
        auto.Nombre.toLowerCase().includes(filtro) ||
        auto.Modelo.toLowerCase().includes(filtro) ||
        auto.Color.toLowerCase().includes(filtro)
      );
    }
    if (!this.filtroBusqueda) {
      const inicio = (this.paginaActual - 1) * this.autosPorPagina;
      filtrados = filtrados.slice(inicio, inicio + this.autosPorPagina);
    }
    return filtrados;
  }
}

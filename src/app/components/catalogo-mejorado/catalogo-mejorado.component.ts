// catalogo-mejorado.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DashboardMenuComponent } from '../../dashboard/menu/menu.component'; // ✅ Asegúrate del path

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
  <div class="flex min-h-screen bg-gray-50">

    <!-- Sidebar -->
    <aside class="hidden lg:flex flex-col w-64 bg-gray-900 text-white shadow-2xl">
      <div class="p-6 font-bold text-yellow-400 text-3xl border-b border-gray-800 flex items-center justify-center tracking-widest">
        EasyDrive
      </div>
      <app-dashboard-menu class="flex-1 mt-6"></app-dashboard-menu>
    </aside>

    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col p-6">

      <!-- Header -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Catálogo EasyDrive</h1>
          <p class="text-gray-600 mt-2">Encuentra el vehículo perfecto para ti</p>
        </div>
        
        <div class="flex gap-4 items-center flex-wrap">
          <!-- Botón Carrito -->
          <button (click)="irAlCarrito()" 
                  class="relative bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors font-semibold flex items-center gap-2 group">
            <span class="text-xl">🛒</span>
            <span class="hidden sm:block">Carrito</span>
            <div *ngIf="cantidadCarrito > 0" 
                 class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {{cantidadCarrito}}
            </div>
          </button>

          <input type="text" [(ngModel)]="filtroBusqueda" 
                 placeholder="Buscar por nombre, modelo o color..." 
                 class="border border-gray-300 rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500">
          
          <button *ngIf="rolUsuario === 'admin'" 
                  (click)="irAAgregarAuto()"
                  class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold flex items-center gap-2">
            <span>➕</span>
            Agregar Auto
          </button>
        </div>
      </div>

      <!-- Grid de autos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let auto of autosFiltrados" 
             class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200">
          
          <!-- Imagen del auto -->
          <div class="h-48 bg-gradient-to-br from-blue-50 to-gray-100 relative overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-6xl opacity-20">🚗</div>
            </div>
            <div class="absolute top-4 right-4">
              <span class="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Nuevo
              </span>
            </div>
            <div class="absolute bottom-4 left-4">
              <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg" [style.background-color]="getColorHex(auto.Color)"></div>
            </div>
          </div>

          <!-- Información del auto -->
          <div class="p-6">
            <h3 class="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {{auto.Nombre}}
            </h3>
            <p class="text-gray-500 text-sm mt-1">{{auto.Modelo}}</p>
            
            <div class="flex items-center gap-2 my-2">
              <div class="w-4 h-4 rounded-full border border-gray-300" [style.background-color]="getColorHex(auto.Color)"></div>
              <span class="text-gray-700 text-sm font-medium">{{auto.Color}}</span>
            </div>

            <p class="text-green-600 font-bold text-xl my-2">
              {{auto.Precio | currency:'USD':'symbol':'1.0-0'}}
            </p>

            <div class="flex gap-2 mb-3">
              <button (click)="agregarAlCarrito(auto)" 
                      class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 px-4 rounded-lg transition-all duration-200 font-semibold flex items-center justify-center gap-2">
                🛒 Añadir al Carrito
              </button>
              <button (click)="agregarFavorito(auto.id)" 
                      class="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white p-2.5 rounded-lg transition-all duration-200 flex items-center justify-center">
                ❤️
              </button>
            </div>

            <div *ngIf="rolUsuario === 'admin'" class="flex gap-2">
              <button (click)="editarAuto(auto.id)" 
                      class="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2.5 px-4 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center gap-2 text-sm">
                ✏️ Editar
              </button>
              <button (click)="eliminarAuto(auto.id)" 
                      class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center gap-2 text-sm">
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mensajes de alerta -->
      <div *ngIf="mensaje" class="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50" 
           [class]="mensajeExito ? 'bg-green-500 text-white' : 'bg-red-500 text-white'">
        {{mensaje}}
      </div>

      <!-- Mensaje cuando no hay autos -->
      <div *ngIf="autosFiltrados.length === 0" class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 class="text-xl font-semibold text-gray-600 mb-2">
          {{filtroBusqueda ? 'No se encontraron resultados' : 'No hay vehículos disponibles'}}
        </h3>
        <p class="text-gray-500">
          {{filtroBusqueda ? 'Intenta con otros términos de búsqueda' : 'Agrega el primer auto al catálogo'}}
        </p>
      </div>

      <!-- Paginación -->
      <div *ngIf="autosFiltrados.length > 0 && !filtroBusqueda" class="flex justify-center items-center space-x-4 mt-8">
        <button (click)="cambiarPagina(paginaActual - 1)" 
                [disabled]="paginaActual === 1"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          ← Anterior
        </button>
        <span class="text-gray-700 font-medium">Página {{paginaActual}} de {{totalPaginas}}</span>
        <button (click)="cambiarPagina(paginaActual + 1)" 
                [disabled]="paginaActual === totalPaginas"
                class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Siguiente →
        </button>
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
    } catch (error) {
      this.rolUsuario = null;
      this.usuarioId = null;
    }
  }

  cargarAutos() {
    this.http.get<Auto[]>('http://localhost:4000/api/autos')
      .subscribe({
        next: (data) => {
          this.autos = data;
          this.totalPaginas = Math.ceil(this.autos.length / this.autosPorPagina);
        },
        error: (error) => {
          this.mostrarMensaje('Error al cargar los vehículos', false);
        }
      });
  }

  actualizarContadorCarrito() {
    const carrito = localStorage.getItem('carrito');
    this.cantidadCarrito = carrito ? JSON.parse(carrito).length : 0;
  }

  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }

  agregarAlCarrito(auto: Auto) {
    if (!this.usuarioId) {
      this.mostrarMensaje('Debes iniciar sesión para agregar al carrito', false);
      return;
    }

    let carrito: any[] = [];
    const carritoStorage = localStorage.getItem('carrito');
    if (carritoStorage) carrito = JSON.parse(carritoStorage);

    if (carrito.find(item => item.id === auto.id)) {
      this.mostrarMensaje('Este vehículo ya está en tu carrito', false);
      return;
    }

    carrito.push({ id: auto.id, Nombre: auto.Nombre, Modelo: auto.Modelo, Precio: auto.Precio, Color: auto.Color });
    localStorage.setItem('carrito', JSON.stringify(carrito));
    this.actualizarContadorCarrito();
    this.mostrarMensaje('¡Vehículo agregado al carrito!', true);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) this.paginaActual = pagina;
  }

  get autosFiltrados(): Auto[] {
    let autosFiltrados = this.autos;
    if (this.filtroBusqueda) {
      const filtro = this.filtroBusqueda.toLowerCase();
      autosFiltrados = autosFiltrados.filter(auto =>
        auto.Nombre.toLowerCase().includes(filtro) ||
        auto.Modelo.toLowerCase().includes(filtro) ||
        auto.Color.toLowerCase().includes(filtro)
      );
    }
    if (!this.filtroBusqueda) {
      const inicio = (this.paginaActual - 1) * this.autosPorPagina;
      const fin = inicio + this.autosPorPagina;
      autosFiltrados = autosFiltrados.slice(inicio, fin);
    }
    return autosFiltrados;
  }

  irAAgregarAuto() {
    this.router.navigate(['/autos/nuevo']);
  }

  editarAuto(autoId: number) {
    this.router.navigate(['/autos/editar', autoId]);
  }

  eliminarAuto(autoId: number) {
    if (confirm('¿Estás seguro de eliminar este vehículo?')) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
      this.http.delete(`http://localhost:4000/api/autos/${autoId}`, { headers }).subscribe({
        next: () => { this.mostrarMensaje('Vehículo eliminado correctamente', true); this.cargarAutos(); },
        error: () => { this.mostrarMensaje('Error al eliminar el vehículo', false); }
      });
    }
  }

  agregarFavorito(autoId: number) {
    if (!this.usuarioId) { this.mostrarMensaje('Debes iniciar sesión para agregar favoritos', false); return; }
    this.http.post('http://localhost:4000/api/favoritos', { usuario_id: this.usuarioId, vehiculo_id: autoId }).subscribe({
      next: (res: any) => { this.mostrarMensaje(res.message || '¡Agregado a favoritos!', true); },
      error: (err) => {
        const errorMsg = err.error?.message || err.message || 'Error al agregar a favoritos';
        this.mostrarMensaje(errorMsg.includes('ya está en favoritos') ? 'Este vehículo ya está en tus favoritos' : errorMsg, false);
      }
    });
  }

  mostrarMensaje(mensaje: string, exito: boolean) {
    this.mensaje = mensaje;
    this.mensajeExito = exito;
    setTimeout(() => { this.mensaje = ''; }, 4000);
  }

  getColorHex(colorName: string): string {
    const colorMap: { [key: string]: string } = {
      'rojo': '#dc2626','azul': '#2563eb','negro': '#000000','blanco': '#ffffff',
      'gris': '#6b7280','plateado': '#c0c0c0','verde': '#16a34a','amarillo': '#eab308',
      'naranja': '#ea580c','morado': '#9333ea','rosa': '#db2777','marron': '#92400e',
      'beige': '#d6d3d1'
    };
    return colorMap[colorName.toLowerCase().trim()] || '#6b7280';
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardMenuComponent } from '../../dashboard/menu/menu.component';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  celular: string;
  fechaNacimiento: string;
  created_at: string;
}

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, DashboardMenuComponent],
  template: `
    <div class="min-h-screen bg-white flex">
      <!-- Menú lateral -->
      <div class="w-64 flex-shrink-0">
        <app-dashboard-menu></app-dashboard-menu>
      </div>

      <!-- Contenido principal -->
      <div class="flex-1 p-8 overflow-auto bg-gradient-to-b from-white via-gray-50 to-gray-100">
        <div class="max-w-7xl mx-auto">

          <!-- Header -->
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
            <div>
              <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Usuarios</h2>
              <p class="text-gray-600 text-sm mt-1">Administra los usuarios registrados en el sistema</p>
            </div>
            <button 
              (click)="mostrarFormularioCrear()"
              class="bg-[#003366] hover:bg-[#002244] text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition-transform transform hover:scale-105">
              Nuevo Usuario
            </button>
          </div>

          <!-- Tabla -->
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nombre</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Teléfono</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Rol</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Registro</th>
                    <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-100">
                  <tr *ngFor="let usuario of usuarios" class="hover:bg-gray-50 transition">
                    <td class="px-6 py-4 text-sm font-medium text-gray-900">{{usuario.id}}</td>
                    <td class="px-6 py-4 text-sm text-gray-900">{{usuario.nombre}}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{usuario.email}}</td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{usuario.celular || 'N/A'}}</td>
                    <td class="px-6 py-4">
                      <select 
                        [value]="usuario.rol" 
                        (change)="cambiarRol(usuario.id, $event)"
                        class="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]">
                        <option value="usuario">Usuario</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">{{usuario.created_at | date:'dd/MM/yyyy'}}</td>
                    <td class="px-6 py-4 text-sm font-medium flex gap-2">
                      <button 
                        (click)="editarUsuario(usuario)"
                        class="bg-[#0055A4] hover:bg-[#003E7E] text-white px-4 py-1 rounded-lg text-xs shadow-sm transition">
                        Editar
                      </button>
                      <button 
                        (click)="eliminarUsuario(usuario.id)"
                        class="bg-gray-700 hover:bg-black text-white px-4 py-1 rounded-lg text-xs shadow-sm transition">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Mensaje vacío -->
          <div *ngIf="usuarios.length === 0" class="text-center py-16 bg-white rounded-2xl shadow-md mt-6 border border-gray-200">
            <div class="text-gray-400 text-6xl mb-3">👤</div>
            <h3 class="text-lg font-semibold text-gray-700">No hay usuarios registrados</h3>
            <p class="text-gray-500 text-sm">Crea el primer usuario en el sistema</p>
          </div>

          <!-- Modal -->
          <div *ngIf="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div class="p-6">
                <h3 class="text-xl font-bold text-gray-900 mb-4">{{usuarioEditando ? 'Editar Usuario' : 'Crear Nuevo Usuario'}}</h3>
                
                <form (ngSubmit)="guardarUsuario()" class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label>
                    <input type="text" [(ngModel)]="usuarioForm.nombre" name="nombre" required
                          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#003366]">
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Email *</label>
                    <input type="email" [(ngModel)]="usuarioForm.email" name="email" required
                          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#003366]">
                  </div>

                  <div *ngIf="!usuarioEditando">
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Contraseña *</label>
                    <input type="password" [(ngModel)]="usuarioForm.password" name="password" required
                          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#003366]">
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                    <input type="tel" [(ngModel)]="usuarioForm.celular" name="celular"
                          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#003366]">
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Fecha de Nacimiento</label>
                    <input type="date" [(ngModel)]="usuarioForm.fechaNacimiento" name="fechaNacimiento"
                          class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#003366]">
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Rol *</label>
                    <select [(ngModel)]="usuarioForm.rol" name="rol" required
                            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#003366]">
                      <option value="usuario">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  <div class="flex gap-3 pt-4">
                    <button type="button" (click)="cerrarModal()"
                            class="flex-1 bg-gray-700 hover:bg-black text-white py-2 rounded-lg font-medium transition">
                      Cancelar
                    </button>
                    <button type="submit"
                            class="flex-1 bg-[#003366] hover:bg-[#002244] text-white py-2 rounded-lg font-medium transition">
                      {{usuarioEditando ? 'Actualizar' : 'Crear'}}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Mensajes -->
          <div *ngIf="mensaje" class="fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50"
              [class]="mensajeExito ? 'bg-green-600 text-white' : 'bg-red-600 text-white'">
            {{mensaje}}
          </div>

        </div>
      </div>
    </div>
  `
})
export class GestionUsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  mostrarModal = false;
  usuarioEditando: Usuario | null = null;
  mensaje: string = '';
  mensajeExito: boolean = false;

  usuarioForm = {
    nombre: '',
    email: '',
    password: '',
    celular: '',
    fechaNacimiento: '',
    rol: 'usuario'
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<Usuario[]>('http://localhost:4000/api/usuarios', { headers })
      .subscribe({
        next: (data) => { this.usuarios = data; },
        error: () => { this.mostrarMensaje('Error al cargar los usuarios', false); }
      });
  }

  mostrarFormularioCrear() {
    this.usuarioEditando = null;
    this.usuarioForm = { nombre: '', email: '', password: '', celular: '', fechaNacimiento: '', rol: 'usuario' };
    this.mostrarModal = true;
  }

  editarUsuario(usuario: Usuario) {
    this.usuarioEditando = usuario;
    this.usuarioForm = {
      nombre: usuario.nombre,
      email: usuario.email,
      password: '',
      celular: usuario.celular || '',
      fechaNacimiento: usuario.fechaNacimiento || '',
      rol: usuario.rol
    };
    this.mostrarModal = true;
  }

  cerrarModal() { this.mostrarModal = false; this.usuarioEditando = null; }

  guardarUsuario() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    if (this.usuarioEditando) {
      this.http.put(`http://localhost:4000/api/usuarios/${this.usuarioEditando.id}`, this.usuarioForm, { headers })
        .subscribe({
          next: (res: any) => { this.mostrarMensaje(res.message || 'Usuario actualizado', true); this.cerrarModal(); this.cargarUsuarios(); },
          error: (err) => { this.mostrarMensaje(err.error?.message || 'Error al actualizar', false); }
        });
    } else {
      this.http.post('http://localhost:4000/api/usuarios', this.usuarioForm, { headers })
        .subscribe({
          next: (res: any) => { this.mostrarMensaje(res.message || 'Usuario creado', true); this.cerrarModal(); this.cargarUsuarios(); },
          error: (err) => { this.mostrarMensaje(err.error?.message || 'Error al crear', false); }
        });
    }
  }

  cambiarRol(usuarioId: number, event: any) {
    const nuevoRol = event.target.value;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.put(`http://localhost:4000/api/usuarios/${usuarioId}/rol`, { rol: nuevoRol }, { headers })
      .subscribe({
        next: (res: any) => { this.mostrarMensaje(res.message || 'Rol actualizado', true); this.cargarUsuarios(); },
        error: (err) => { this.mostrarMensaje(err.error?.message || 'Error al cambiar rol', false); this.cargarUsuarios(); }
      });
  }

  eliminarUsuario(usuarioId: number) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.delete(`http://localhost:4000/api/usuarios/${usuarioId}`, { headers })
      .subscribe({
        next: (res: any) => { this.mostrarMensaje(res.message || 'Usuario eliminado', true); this.cargarUsuarios(); },
        error: (err) => { this.mostrarMensaje(err.error?.message || 'Error al eliminar', false); }
      });
  }

  mostrarMensaje(mensaje: string, exito: boolean) {
    this.mensaje = mensaje;
    this.mensajeExito = exito;
    setTimeout(() => this.mensaje = '', 4000);
  }
}

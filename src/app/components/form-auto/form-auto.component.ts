import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-auto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-white flex flex-col items-center py-10">
      <div class="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-8">
        
        <!-- Encabezado -->
        <div class="flex items-center justify-between mb-6 border-b pb-3">
          <h2 class="text-3xl font-bold text-gray-900 tracking-tight">
            {{ esEdicion ? 'Editar Vehículo' : 'Agregar Vehículo' }}
          </h2>
          <div class="flex items-center space-x-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" 
                 alt="BMW" class="h-10 w-10">
          </div>
        </div>

        <!-- Formulario -->
        <form (ngSubmit)="guardarAuto()" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label class="block text-sm font-semibold text-gray-700">Nombre</label>
              <input type="text" [(ngModel)]="auto.nombre" name="nombre"
                     class="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                     required>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700">Modelo</label>
              <input type="text" [(ngModel)]="auto.modelo" name="modelo"
                     class="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                     required>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700">Precio (USD)</label>
              <input type="number" [(ngModel)]="auto.precio_usd" name="precio"
                     class="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                     required>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700">Color</label>
              <input type="text" [(ngModel)]="auto.color" name="color"
                     class="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                     required>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex justify-end space-x-4 pt-6">
            <button type="button" (click)="cancelar()"
                    class="px-5 py-2 rounded-lg bg-gray-800 text-white font-semibold hover:bg-black transition">
              Cancelar
            </button>

            <button type="submit"
                    class="px-6 py-2 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition">
              {{ esEdicion ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class FormAutoComponent implements OnInit {
  auto: any = {
    nombre: '',
    modelo: '',
    precio_usd: 0,
    color: ''
  };
  esEdicion = false;
  autoId: number | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.autoId = this.route.snapshot.params['id'];
    if (this.autoId) {
      this.esEdicion = true;
      this.cargarAuto();
    }
  }

  cargarAuto() {
    this.http.get(`http://localhost:4000/api/autos/${this.autoId}`)
      .subscribe({
        next: (data: any) => this.auto = data,
        error: (error) => console.error('Error:', error)
      });
  }

  guardarAuto() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    if (this.esEdicion) {
      this.http.put(`http://localhost:4000/api/autos/${this.autoId}`, this.auto, { headers })
        .subscribe({
          next: () => {
            alert('Vehículo actualizado correctamente');
            this.router.navigate(['/autos/lista']);
          },
          error: (error) => console.error('Error al actualizar:', error)
        });
    } else {
      this.http.post('http://localhost:4000/api/autos', this.auto)
        .subscribe({
          next: () => {
            alert('Vehículo agregado correctamente');
            this.router.navigate(['/autos/lista']);
          },
          error: (error) => console.error('Error al agregar:', error)
        });
    }
  }

  cancelar() {
    this.router.navigate(['/autos/lista']);
  }
}
